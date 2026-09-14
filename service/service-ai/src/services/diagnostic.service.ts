/**
 * Diagnostic Interpretation Service
 * 
 * Provides AI-generated human-readable summaries of BKT diagnostic data.
 * 
 * CRITICAL: AI MUST NOT calculate or return p_known values, mastery probability,
 * BKT state transitions, or BKT parameters. AI only provides textual explanations
 * of existing BKT data.
 */

import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { createProvider } from './providers/index.js';
import { validateEnv } from '../config/env.js';
import { AIError, AIErrorCode, aiErrorFromUnknown } from '../types/errors.js';
import { 
  getStudentDiagnoses, 
  getStudentEvidence, 
  getSkillPrerequisites,
  type DiagnosisDto,
  type EvidenceDto,
  DiagnosisStatus 
} from './bkt-client.js';

const log = logger.child({ component: 'diagnostic-service' });

/* ─────────────────────────── Response Types ─────────────────────────── */

export interface DiagnosticInterpretation {
  dataStatus: 'HAS_DATA' | 'INSUFFICIENT_DATA' | 'ERROR';
  overallSummary: string;
  strengths: Array<{
    skillId: string;
    skillName: string;
    explanation: string;
  }>;
  weakAreas: Array<{
    skillId: string;
    skillName: string;
    masteryState: DiagnosisStatus;
    pKnown?: number;
    explanation: string;
  }>;
  observations: string[];
  prioritySkills: string[];
  recommendedActions: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DiagnosticResult {
  studentId: string;
  interpretation: DiagnosticInterpretation;
  diagnosisCount: number;
  evidenceCount: number;
  lastUpdated: string | null;
  provider: string;
  latencyMs: number;
}

type InsufficientDataReason = 'NO_DIAGNOSIS' | 'INSUFFICIENT_EVIDENCE' | 'STALE_DATA';

/* ─────────────────────────── Zod Schemas for Validation ─────────────────────────── */

const strengthSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  explanation: z.string(),
});

const weakAreaSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  masteryState: z.enum(['PENDING', 'DIAGNOSED', 'MASTERED', 'STRUGGLING']),
  pKnown: z.number().optional(),
  explanation: z.string(),
});

const interpretationResponseSchema = z.object({
  dataStatus: z.enum(['HAS_DATA', 'INSUFFICIENT_DATA', 'ERROR']),
  overallSummary: z.string(),
  strengths: z.array(strengthSchema),
  weakAreas: z.array(weakAreaSchema),
  observations: z.array(z.string()),
  prioritySkills: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

/* ─────────────────────────── Insufficient Data Responses ─────────────────────────── */

const INSUFFICIENT_SUMMARIES_VI: Record<InsufficientDataReason, string> = {
  NO_DIAGNOSIS: 'Học sinh chưa có dữ liệu chẩn đoán nào từ hệ thống BKT.',
  INSUFFICIENT_EVIDENCE: 'Học sinh có dữ liệu chẩn đoán nhưng chưa đủ bằng chứng học tập để đưa ra phân tích đáng tin cậy.',
  STALE_DATA: 'Dữ liệu chẩn đoán cuối cùng của học sinh đã cũ (hơn 30 ngày).',
};

const INSUFFICIENT_SUMMARIES_EN: Record<InsufficientDataReason, string> = {
  NO_DIAGNOSIS: 'The student has no diagnostic data from the BKT system yet.',
  INSUFFICIENT_EVIDENCE: 'The student has diagnostic data but insufficient learning evidence for a reliable analysis.',
  STALE_DATA: 'The student\'s last diagnostic data is stale (over 30 days old).',
};

function createInsufficientDataResponse(
  reason: InsufficientDataReason,
  language: 'vi' | 'en'
): DiagnosticInterpretation {
  const summaries = language === 'vi' ? INSUFFICIENT_SUMMARIES_VI : INSUFFICIENT_SUMMARIES_EN;
  return {
    dataStatus: 'INSUFFICIENT_DATA',
    overallSummary: summaries[reason],
    strengths: [],
    weakAreas: [],
    observations: [],
    prioritySkills: [],
    recommendedActions: [language === 'vi' 
      ? 'Học sinh cần hoàn thành thêm các bài kiểm tra để hệ thống có đủ dữ liệu phân tích.'
      : 'The student needs to complete more assessments for the system to have enough data for analysis.'],
    confidence: 'LOW',
  };
}

/* ─────────────────────────── Data Staleness Check ─────────────────────────── */

function isDataStale(diagnoses: DiagnosisDto[]): boolean {
  if (diagnoses.length === 0) return false;
  
  const mostRecent = diagnoses.reduce((latest, d) => {
    const updated = new Date(d.updatedAt).getTime();
    return updated > latest ? updated : latest;
  }, 0);
  
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return mostRecent < thirtyDaysAgo;
}

/* ─────────────────────────── Build AI Prompt ─────────────────────────── */

function buildDiagnosticPrompt(
  studentId: string,
  diagnoses: DiagnosisDto[],
  evidence: EvidenceDto[],
  prerequisites: Map<string, string[]>,
  maxSkills: number,
  language: 'vi' | 'en'
): string {
  const isVietnamese = language === 'vi';
  
  const weakDiagnoses = diagnoses
    .filter(d => d.status === 'STRUGGLING' || (d.pKnown !== undefined && d.pKnown < 0.5))
    .slice(0, maxSkills);
  
  const strongDiagnoses = diagnoses
    .filter(d => d.status === 'MASTERED' || (d.pKnown !== undefined && d.pKnown >= 0.7))
    .slice(0, maxSkills);
  
  // Build evidence lookup
  const evidenceByDiagnosis = new Map<string, EvidenceDto[]>();
  for (const e of evidence) {
    const list = evidenceByDiagnosis.get(e.diagnosisId) ?? [];
    list.push(e);
    evidenceByDiagnosis.set(e.diagnosisId, list);
  }

  const skillList = diagnoses.map(d => ({
    skillId: d.skillId,
    skillName: d.skillName ?? d.skillId,
    status: d.status,
    pKnown: d.pKnown,
    evidenceCount: d.evidenceCount,
  }));

  let prompt = isVietnamese
    ? `Bạn là một chuyên gia giáo dục phân tích dữ liệu chẩn đoán học tập của học sinh.
Nhiệm vụ: Đưa ra phân tích bằng ngôn ngữ tự nhiên về điểm mạnh, điểm yếu và khuyến nghị.
QUAN TRỌNG: 
- KHÔNG tính toán p_known hay xác suất thành thạo
- CHỈ giải thích ý nghĩa của dữ liệu BKT hiện có
- Sử dụng ngôn ngữ tự nhiên, dễ hiểu cho phụ huynh và giáo viên

Dữ liệu học sinh (ID: ${studentId}):

**Tổng quan các kỹ năng:**
${JSON.stringify(skillList, null, 2)}

**Kỹ năng cần chú ý (yếu):**
${weakDiagnoses.map(d => {
  const prereqs = prerequisites.get(d.skillId);
  const prereqNote = prereqs && prereqs.length > 0 
    ? `\n  - Điều kiện tiên quyết: ${prereqs.join(', ')}` 
    : '';
  const evidence = evidenceByDiagnosis.get(d.id) ?? [];
  const evidenceNote = evidence.length > 0 
    ? `\n  - Bằng chứng gần đây: ${evidence.length} mục (${evidence.slice(0, 3).map(e => e.correct === true ? 'đúng' : e.correct === false ? 'sai' : 'không rõ').join(', ')})`
    : '';
  return `- ${d.skillName ?? d.skillId}: Trạng thái=${d.status}, p_known=${d.pKnown?.toFixed(3)}${prereqNote}${evidenceNote}`;
}).join('\n')}

**Kỹ năng mạnh:**
${strongDiagnoses.map(d => `- ${d.skillName ?? d.skillId}: Trạng thái=${d.status}, p_known=${d.pKnown?.toFixed(3)}`).join('\n')}

Hãy trả lời CHỈ với JSON (không có markdown code block):
{
  "dataStatus": "HAS_DATA",
  "overallSummary": "1-2 câu tóm tắt tổng quan",
  "strengths": [{"skillId": "id", "skillName": "tên", "explanation": "giải thích ngắn"}],
  "weakAreas": [{"skillId": "id", "skillName": "tên", "masteryState": "STRUGGLING|DIAGNOSED|PENDING|MASTERED", "pKnown": 0.0-1.0, "explanation": "giải thích ngắn"}],
  "observations": ["quan sát 1", "quan sát 2"],
  "prioritySkills": ["skillId1", "skillId2"],
  "recommendedActions": ["hành động 1", "hành động 2"],
  "confidence": "HIGH|MEDIUM|LOW"
}`
    : `You are an educational expert analyzing student learning diagnostic data.
Task: Provide natural language analysis of strengths, weaknesses, and recommendations.
IMPORTANT:
- DO NOT calculate p_known or mastery probability
- ONLY explain the meaning of existing BKT data
- Use natural language understandable by parents and teachers

Student data (ID: ${studentId}):

**Skills overview:**
${JSON.stringify(skillList, null, 2)}

**Skills needing attention (weak):**
${weakDiagnoses.map(d => {
  const prereqs = prerequisites.get(d.skillId);
  const prereqNote = prereqs && prereqs.length > 0 
    ? `\n  - Prerequisites: ${prereqs.join(', ')}` 
    : '';
  const evidence = evidenceByDiagnosis.get(d.id) ?? [];
  const evidenceNote = evidence.length > 0 
    ? `\n  - Recent evidence: ${evidence.length} items (${evidence.slice(0, 3).map(e => e.correct === true ? 'correct' : e.correct === false ? 'incorrect' : 'unknown').join(', ')})`
    : '';
  return `- ${d.skillName ?? d.skillId}: Status=${d.status}, p_known=${d.pKnown?.toFixed(3)}${prereqNote}${evidenceNote}`;
}).join('\n')}

**Strong skills:**
${strongDiagnoses.map(d => `- ${d.skillName ?? d.skillId}: Status=${d.status}, p_known=${d.pKnown?.toFixed(3)}`).join('\n')}

Respond ONLY with JSON (no markdown code block):
{
  "dataStatus": "HAS_DATA",
  "overallSummary": "1-2 sentence overall summary",
  "strengths": [{"skillId": "id", "skillName": "name", "explanation": "brief explanation"}],
  "weakAreas": [{"skillId": "id", "skillName": "name", "masteryState": "STRUGGLING|DIAGNOSED|PENDING|MASTERED", "pKnown": 0.0-1.0, "explanation": "brief explanation"}],
  "observations": ["observation 1", "observation 2"],
  "prioritySkills": ["skillId1", "skillId2"],
  "recommendedActions": ["action 1", "action 2"],
  "confidence": "HIGH|MEDIUM|LOW"
}`;

  return prompt;
}

/* ─────────────────────────── Parse AI Response ─────────────────────────── */

function parseAIResponse(content: string): DiagnosticInterpretation {
  // Try to extract JSON from the response
  let jsonStr = content.trim();
  
  // Remove markdown code block if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }
  
  // Try to parse as-is first
  try {
    const parsed = JSON.parse(jsonStr);
    return interpretationResponseSchema.parse(parsed);
  } catch {
    // Fall through to error
  }
  
  // Try to find JSON object in the response
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0]);
      return interpretationResponseSchema.parse(parsed);
    } catch {
      // Fall through to error
    }
  }
  
  throw new AIError(
    AIErrorCode.AI_INVALID_RESPONSE,
    'AI provider returned an invalid or malformed response',
    { rawResponse: content.substring(0, 500) }
  );
}

/* ─────────────────────────── Main Service Function ─────────────────────────── */

export interface GenerateDiagnosticOptions {
  studentId: string;
  includeEvidence?: boolean;
  includePrerequisites?: boolean;
  maxSkills?: number;
  language?: 'vi' | 'en';
}

export async function generateDiagnostic(options: GenerateDiagnosticOptions): Promise<DiagnosticResult> {
  const startTime = Date.now();
  const {
    studentId,
    includeEvidence = true,
    includePrerequisites = false,
    maxSkills = 10,
    language = 'vi',
  } = options;

  log.info('Generating diagnostic interpretation', {
    operation: 'diagnostic-interpretation',
    studentId,
    includeEvidence,
    includePrerequisites,
    maxSkills,
    language,
  });

  const env = validateEnv();
  
  // Create AI provider
  const providerConfig = {
    type: env.LLM_PROVIDER as 'openai' | 'anthropic' | 'local',
    timeoutMs: env.LLM_PROVIDER === 'openai' 
      ? env.OPENAI_TIMEOUT_MS 
      : env.LLM_PROVIDER === 'anthropic'
        ? env.ANTHROPIC_TIMEOUT_MS
        : env.LOCAL_LLM_TIMEOUT_MS,
    ...(env.LLM_PROVIDER === 'openai' && {
      apiKey: env.OPENAI_API_KEY ?? '',
      model: env.OPENAI_MODEL,
      baseUrl: env.OPENAI_BASE_URL,
    }),
    ...(env.LLM_PROVIDER === 'anthropic' && {
      apiKey: env.ANTHROPIC_API_KEY ?? '',
      model: env.ANTHROPIC_MODEL,
    }),
    ...(env.LLM_PROVIDER === 'local' && {
      baseUrl: env.LOCAL_LLM_URL,
      model: env.LOCAL_LLM_MODEL,
    }),
  };

  const provider = createProvider(providerConfig as Parameters<typeof createProvider>[0]);

  // Fetch BKT data
  let diagnoses: DiagnosisDto[] = [];
  let evidence: EvidenceDto[] = [];

  try {
    diagnoses = await getStudentDiagnoses(studentId);
  } catch (err) {
    log.error('Failed to fetch diagnoses from BKT service', {
      studentId,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new AIError(
      AIErrorCode.AI_PROVIDER_UNAVAILABLE,
      'BKT service is unavailable',
      { cause: 'bkt-service-error' }
    );
  }

  // Check for insufficient data
  if (diagnoses.length === 0) {
    const result: DiagnosticResult = {
      studentId,
      interpretation: createInsufficientDataResponse('NO_DIAGNOSIS', language),
      diagnosisCount: 0,
      evidenceCount: 0,
      lastUpdated: null,
      provider: provider.providerName,
      latencyMs: Date.now() - startTime,
    };

    log.info('Insufficient data for diagnostic', {
      operation: 'diagnostic-interpretation',
      studentId,
      diagnosisCount: 0,
      dataStatus: 'NO_DIAGNOSIS',
      latencyMs: result.latencyMs,
    });

    return result;
  }

  // Check for stale data
  if (isDataStale(diagnoses)) {
    const result: DiagnosticResult = {
      studentId,
      interpretation: createInsufficientDataResponse('STALE_DATA', language),
      diagnosisCount: diagnoses.length,
      evidenceCount: 0,
      lastUpdated: diagnoses[0]?.updatedAt ?? null,
      provider: provider.providerName,
      latencyMs: Date.now() - startTime,
    };

    log.info('Stale data for diagnostic', {
      operation: 'diagnostic-interpretation',
      studentId,
      diagnosisCount: diagnoses.length,
      dataStatus: 'STALE_DATA',
      latencyMs: result.latencyMs,
    });

    return result;
  }

  // Fetch additional data if needed
  if (includeEvidence) {
    try {
      evidence = await getStudentEvidence(studentId);
    } catch (err) {
      log.warn('Failed to fetch evidence, continuing without it', {
        studentId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Fetch prerequisites if needed
  const prerequisites = new Map<string, string[]>();
  if (includePrerequisites) {
    const weakSkillIds = diagnoses
      .filter(d => d.status === 'STRUGGLING')
      .map(d => d.skillId);
    
    for (const skillId of weakSkillIds) {
      try {
        const prereqs = await getSkillPrerequisites(skillId);
        // Extract just the skill IDs from the SkillDto objects
        prerequisites.set(skillId, prereqs.map(s => s.id));
      } catch (err) {
        log.warn('Failed to fetch prerequisites for skill', {
          skillId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  // Check for insufficient evidence (less than 3 diagnoses)
  if (diagnoses.length < 3) {
    const result: DiagnosticResult = {
      studentId,
      interpretation: createInsufficientDataResponse('INSUFFICIENT_EVIDENCE', language),
      diagnosisCount: diagnoses.length,
      evidenceCount: evidence.length,
      lastUpdated: diagnoses[0]?.updatedAt ?? null,
      provider: provider.providerName,
      latencyMs: Date.now() - startTime,
    };

    log.info('Insufficient evidence for reliable diagnostic', {
      operation: 'diagnostic-interpretation',
      studentId,
      diagnosisCount: diagnoses.length,
      evidenceCount: evidence.length,
      dataStatus: 'INSUFFICIENT_EVIDENCE',
      latencyMs: result.latencyMs,
    });

    return result;
  }

  // Build prompt and call AI
  const prompt = buildDiagnosticPrompt(
    studentId,
    diagnoses,
    evidence,
    prerequisites,
    maxSkills,
    language
  );

  let aiContent: string;
  try {
    const response = await provider.generate({
      prompt,
      maxTokens: 2048,
      temperature: 0.3, // Lower temperature for more consistent output
    });
    aiContent = response.content;
  } catch (err) {
    log.error('AI provider call failed', {
      studentId,
      error: err instanceof Error ? err.message : String(err),
      provider: provider.providerName,
    });
    throw aiErrorFromUnknown(err, provider.providerName);
  }

  // Parse and validate AI response
  let interpretation: DiagnosticInterpretation;
  try {
    interpretation = parseAIResponse(aiContent);
  } catch (err) {
    log.error('Failed to parse AI response', {
      studentId,
      error: err instanceof Error ? err.message : String(err),
      rawResponse: aiContent.substring(0, 500),
    });
    throw new AIError(
      AIErrorCode.AI_INVALID_RESPONSE,
      'AI provider returned an invalid response format',
      { provider: provider.providerName }
    );
  }

  const result: DiagnosticResult = {
    studentId,
    interpretation,
    diagnosisCount: diagnoses.length,
    evidenceCount: evidence.length,
    lastUpdated: diagnoses[0]?.updatedAt ?? null,
    provider: provider.providerName,
    latencyMs: Date.now() - startTime,
  };

  log.info('Diagnostic interpretation completed', {
    operation: 'diagnostic-interpretation',
    studentId,
    diagnosisCount: diagnoses.length,
    evidenceCount: evidence.length,
    provider: provider.providerName,
    latencyMs: result.latencyMs,
    dataStatus: interpretation.dataStatus,
    confidence: interpretation.confidence,
  });

  return result;
}
