/**
 * Personalized Recommendation Engine Service.
 *
 * Implements the three-phase recommendation pipeline:
 *   Step A — Gather real candidates (DETERMINISTIC)
 *   Step B — Validate candidates (DETERMINISTIC)
 *   Step C — AI personalization (OPTIONAL, graceful fallback)
 *   Step D — Empty state handling
 *
 * Key principle: AI personalizes the wording, not the candidate selection.
 */

import { createProvider } from './providers/index.js';
import { validateEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AIError, aiErrorFromUnknown } from '../types/errors.js';
import {
  getStudentDiagnoses,
  getSkillPrerequisites,
  getAllSkills,
  getAvailableContent,
  type DiagnosisDto,
  type SkillDto,
  type QuestionDto,
} from './resource-client.js';

const log = logger.child({ component: 'recommendation.service' });

// ─── Recommendation Output Types ───────────────────────────────────────────────

export interface SuggestedContent {
  contentId: string;
  contentTitle: string;
  contentType: string;
  difficulty: number;
}

export interface Recommendation {
  skillId: string;
  skillName: string;
  priority: number;
  reason: string;
  aiExplanation?: string;
  suggestedContent?: SuggestedContent[];
  prerequisites?: string[];
}

export type RecommendationStatus = 'SUCCESS' | 'PARTIAL' | 'NO_RECOMMENDATION_AVAILABLE' | 'INSUFFICIENT_DATA';

export type NoRecommendationReason = 'NO_WEAK_SKILLS' | 'NO_AVAILABLE_CONTENT' | 'INSUFFICIENT_DATA';

export interface RecommendationResponse {
  studentId: string;
  status: RecommendationStatus;
  reason?: NoRecommendationReason;
  recommendations: Recommendation[];
  generatedAt: string;
  aiPersonalization: boolean;
}

// ─── Weak Skill Analysis ───────────────────────────────────────────────────────

interface WeakSkill {
  diagnosis: DiagnosisDto;
  skill: SkillDto;
  prerequisiteDepth: number;
  hasAvailableContent: boolean;
}

/**
 * Identify weak skills from student diagnoses.
 * Weak = STRUGGLING OR (DIAGNOSED with pKnown < 0.6)
 */
function identifyWeakSkills(
  diagnoses: DiagnosisDto[],
  skills: SkillDto[]
): WeakSkill[] {
  const skillMap = new Map<string, SkillDto>();
  for (const skill of skills) {
    skillMap.set(skill.id, skill);
  }

  const weakSkills: WeakSkill[] = [];

  for (const diagnosis of diagnoses) {
    const isWeak =
      diagnosis.status === 'STRUGGLING' ||
      (diagnosis.status === 'DIAGNOSED' && diagnosis.pKnown < 0.6);

    if (!isWeak) continue;

    const skill = skillMap.get(diagnosis.skillId);
    if (!skill) continue;

    weakSkills.push({
      diagnosis,
      skill,
      prerequisiteDepth: 0,
      hasAvailableContent: false,
    });
  }

  return weakSkills;
}

// ─── Prerequisite Depth Calculation ───────────────────────────────────────────

/**
 * Calculate prerequisite depth for a skill.
 * Depth 0 = no prerequisites, Depth 1 = has prerequisites, etc.
 */
async function calculatePrerequisiteDepth(
  skillId: string,
  visited: Set<string> = new Set(),
  depth = 0
): Promise<number> {
  if (visited.has(skillId)) return depth;
  visited.add(skillId);

  const prereqs = await getSkillPrerequisites(skillId);
  if (prereqs.length === 0) return depth;

  let maxDepth = depth;
  for (const prereq of prereqs) {
    const prereqDepth = await calculatePrerequisiteDepth(prereq.id, new Set(visited), depth + 1);
    maxDepth = Math.max(maxDepth, prereqDepth);
  }

  return maxDepth;
}

/**
 * Check if a prerequisite skill is also weak.
 * Used to prioritize prerequisite skills.
 */
function hasWeakPrerequisite(
  skillId: string,
  weakSkillIds: Set<string>,
  skillMap: Map<string, SkillDto>
): boolean {
  const skill = skillMap.get(skillId);
  if (!skill) return false;

  for (const prereqId of skill.prereqSkills) {
    if (weakSkillIds.has(prereqId)) return true;
  }
  return false;
}

// ─── Content Availability Check ─────────────────────────────────────────────────

/**
 * Check if content is available for a skill.
 */
async function checkContentAvailability(skillId: string): Promise<boolean> {
  const content = await getAvailableContent(skillId);
  return content.length > 0;
}

// ─── Priority Calculation ─────────────────────────────────────────────────────

/**
 * Calculate deterministic priority score for a recommendation.
 *
 * Priority = (1 - pKnown) × (1 + prerequisite_depth) × recency_factor
 * - STRUGGLING skills get +0.2 boost
 * - Skills with no available content get -0.3 penalty
 */
function calculatePriority(skill: WeakSkill, recencyFactor: number): number {
  const { diagnosis, skill: skillData, hasAvailableContent } = skill;

  // Base priority from pKnown
  const pKnownComponent = 1 - diagnosis.pKnown;

  // Prerequisite depth component
  const prereqDepthComponent = 1 + skill.prerequisiteDepth;

  // Status boost
  const statusBoost = diagnosis.status === 'STRUGGLING' ? 0.2 : 0;

  // Content availability penalty
  const contentPenalty = hasAvailableContent ? 0 : -0.3;

  // Calculate final priority
  let priority = pKnownComponent * prereqDepthComponent * recencyFactor;
  priority += statusBoost;
  priority += contentPenalty;

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, priority));
}

// ─── AI Personalization ───────────────────────────────────────────────────────

interface AIPersonalizationInput {
  studentId: string;
  weakSkills: WeakSkill[];
  recommendations: Recommendation[];
  language: 'vi' | 'en';
}

interface AIPersonalizationResult {
  explanations: Map<string, string>;
  success: boolean;
}

async function personalizeWithAI(input: AIPersonalizationInput): Promise<AIPersonalizationResult> {
  const env = validateEnv();

  // Skip AI if provider is not configured
  const providerConfig = buildProviderConfig(env);
  if (!providerConfig) {
    log.debug('AI provider not configured, skipping personalization');
    return { explanations: new Map(), success: false };
  }

  try {
    const provider = createProvider(providerConfig);

    const prompt = buildPersonalizationPrompt(input);

    const response = await provider.generate({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    // Parse AI response to extract explanations
    const explanations = parseAIResponse(response.content, input.recommendations);

    return { explanations, success: true };
  } catch (err) {
    const mappedError = aiErrorFromUnknown(err, env.LLM_PROVIDER);
    log.warn('AI personalization failed, using deterministic output', {
      studentId: input.studentId,
      errorCode: mappedError.code,
      errorMessage: mappedError.message,
    });
    return { explanations: new Map(), success: false };
  }
}

function buildProviderConfig(env: ReturnType<typeof validateEnv>) {
  switch (env.LLM_PROVIDER) {
    case 'openai':
      if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === 'your-openai-api-key-here') {
        return null;
      }
      return {
        type: 'openai' as const,
        apiKey: env.OPENAI_API_KEY,
        model: env.OPENAI_MODEL,
        baseUrl: env.OPENAI_BASE_URL,
        timeoutMs: env.OPENAI_TIMEOUT_MS,
      };
    case 'anthropic':
      if (!env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
        return null;
      }
      return {
        type: 'anthropic' as const,
        apiKey: env.ANTHROPIC_API_KEY,
        model: env.ANTHROPIC_MODEL,
        timeoutMs: env.ANTHROPIC_TIMEOUT_MS,
      };
    case 'local':
      return {
        type: 'local' as const,
        baseUrl: env.LOCAL_LLM_URL,
        model: env.LOCAL_LLM_MODEL,
        timeoutMs: env.LOCAL_LLM_TIMEOUT_MS,
      };
    default:
      return null;
  }
}

function buildPersonalizationPrompt(input: AIPersonalizationInput): string {
  const { studentId, weakSkills, recommendations, language } = input;
  const lang = language === 'vi' ? 'Tiếng Việt' : 'English';

  const skillsSummary = weakSkills
    .map(
      (ws) =>
        `- Skill: ${ws.skill.name} (${ws.skill.id})\n  pKnown: ${ws.diagnosis.pKnown.toFixed(2)}\n  Status: ${ws.diagnosis.status}`
    )
    .join('\n');

  const recsSummary = recommendations
    .map(
      (r) =>
        `- Skill: ${r.skillName} (${r.skillId})\n  Priority: ${r.priority.toFixed(2)}\n  Reason: ${r.reason}`
    )
    .join('\n');

  return `You are an AI learning assistant. Generate personalized explanations for skill recommendations.

Student ID: ${studentId}
Language: ${lang}

Weak Skills Analysis:
${skillsSummary}

Top Recommendations:
${recsSummary}

Generate a brief personalized explanation for each recommendation in ${lang}. Format your response as:
SKILL_ID|explanation

Only include explanations for skills listed above. Keep explanations under 100 words each. Focus on why this skill is important and how it connects to the student's learning path.`;
}

function parseAIResponse(
  aiContent: string,
  recommendations: Recommendation[]
): Map<string, string> {
  const explanations = new Map<string, string>();
  const skillIds = new Set(recommendations.map((r) => r.skillId));

  const lines = aiContent.split('\n').filter((line) => line.trim());
  for (const line of lines) {
    const match = line.match(/^([a-f0-9-]{36})\|(.+)$/i);
    if (match) {
      const skillId = match[1];
      const explanation = match[2].trim();
      if (skillIds.has(skillId) && explanation) {
        explanations.set(skillId, explanation);
      }
    }
  }

  return explanations;
}

// ─── Main Recommendation Pipeline ─────────────────────────────────────────────

export interface GetRecommendationsInput {
  studentId: string;
  limit: number;
  includeContent: boolean;
  language: 'vi' | 'en';
}

export async function getRecommendations(
  input: GetRecommendationsInput
): Promise<RecommendationResponse> {
  const startTime = Date.now();
  const { studentId, limit, includeContent, language } = input;

  log.info('Generating recommendations', { studentId, limit, language });

  // Step A: Gather real candidates (DETERMINISTIC)

  // Fetch student diagnoses
  const diagnoses = await getStudentDiagnoses(studentId);
  log.debug('Fetched diagnoses', { studentId, count: diagnoses.length });

  if (diagnoses.length === 0) {
    // No diagnoses = insufficient data
    log.info('No diagnoses found for student', { studentId });
    return {
      studentId,
      status: 'INSUFFICIENT_DATA',
      reason: 'INSUFFICIENT_DATA',
      recommendations: [],
      generatedAt: new Date().toISOString(),
      aiPersonalization: false,
    };
  }

  // Fetch all skills to build skill map
  const allSkills = await getAllSkills();
  const skillMap = new Map<string, SkillDto>();
  for (const skill of allSkills) {
    skillMap.set(skill.id, skill);
  }

  // Identify weak skills
  let weakSkills = identifyWeakSkills(diagnoses, allSkills);
  log.debug('Identified weak skills', { studentId, count: weakSkills.length });

  if (weakSkills.length === 0) {
    // No weak skills = no recommendations needed
    log.info('No weak skills found for student', { studentId });
    return {
      studentId,
      status: 'NO_RECOMMENDATION_AVAILABLE',
      reason: 'NO_WEAK_SKILLS',
      recommendations: [],
      generatedAt: new Date().toISOString(),
      aiPersonalization: false,
    };
  }

  // Calculate prerequisite depths and check content availability
  const processedWeakSkills: WeakSkill[] = [];
  for (const ws of weakSkills) {
    const prereqDepth = await calculatePrerequisiteDepth(ws.skill.id);
    const hasContent = await checkContentAvailability(ws.skill.id);
    processedWeakSkills.push({
      ...ws,
      prerequisiteDepth: prereqDepth,
      hasAvailableContent: hasContent,
    });
  }

  // Check for prerequisite weaknesses (prioritize prerequisites)
  const weakSkillIds = new Set(processedWeakSkills.map((ws) => ws.skill.id));
  for (const ws of processedWeakSkills) {
    if (hasWeakPrerequisite(ws.skill.id, weakSkillIds, skillMap)) {
      ws.prerequisiteDepth += 1;
    }
  }

  // Calculate recency factor (more recent updates = higher factor)
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const processedWeakSkillsWithRecency = processedWeakSkills.map((ws) => {
    const updatedAt = new Date(ws.diagnosis.updatedAt).getTime();
    const age = now - updatedAt;
    const recencyFactor = Math.max(0.5, 1 - age / maxAge);
    return { ws, recencyFactor };
  });

  // Calculate priorities
  const prioritizedSkills = processedWeakSkillsWithRecency.map(({ ws, recencyFactor }) => ({
    ws,
    priority: calculatePriority(ws, recencyFactor),
  }));

  // Sort by priority (descending)
  prioritizedSkills.sort((a, b) => b.priority - a.priority);

  // Take top N
  const topSkills = prioritizedSkills.slice(0, limit);

  // Build recommendations
  const recommendations: Recommendation[] = [];
  for (const { ws, priority } of topSkills) {
    const recommendation: Recommendation = {
      skillId: ws.skill.id,
      skillName: ws.skill.name,
      priority: Math.round(priority * 1000) / 1000,
      reason: buildDeterministicReason(ws, language),
      prerequisites: ws.skill.prereqSkills.length > 0 ? ws.skill.prereqSkills : undefined,
    };

    // Include content if requested and available
    if (includeContent && ws.hasAvailableContent) {
      const content = await getAvailableContent(ws.skill.id);
      if (content.length > 0) {
        recommendation.suggestedContent = content.slice(0, 5).map(mapQuestionToContent);
      }
    }

    recommendations.push(recommendation);
  }

  // Check if we have any recommendations with content
  const hasAvailableContent = recommendations.some((r) => r.suggestedContent && r.suggestedContent.length > 0);
  if (recommendations.length === 0 || (!hasAvailableContent && includeContent)) {
    // Check if we have skills but no content
    if (recommendations.length > 0) {
      log.info('No available content for weak skills', { studentId });
      return {
        studentId,
        status: 'NO_RECOMMENDATION_AVAILABLE',
        reason: 'NO_AVAILABLE_CONTENT',
        recommendations,
        generatedAt: new Date().toISOString(),
        aiPersonalization: false,
      };
    }
  }

  // Step C: AI Personalization (OPTIONAL)
  let aiPersonalization = false;
  const aiResult = await personalizeWithAI({
    studentId,
    weakSkills: processedWeakSkills,
    recommendations,
    language,
  });

  if (aiResult.success && aiResult.explanations.size > 0) {
    // Apply AI explanations to recommendations
    for (const rec of recommendations) {
      const explanation = aiResult.explanations.get(rec.skillId);
      if (explanation) {
        rec.aiExplanation = explanation;
      }
    }
    aiPersonalization = true;
    log.info('AI personalization applied', {
      studentId,
      explanationsCount: aiResult.explanations.size,
    });
  }

  const latencyMs = Date.now() - startTime;
  log.info('Recommendations generated', {
    studentId,
    diagnosisCount: diagnoses.length,
    weakSkillCount: weakSkills.length,
    recommendationCount: recommendations.length,
    aiPersonalization,
    latencyMs,
  });

  return {
    studentId,
    status: aiPersonalization ? 'SUCCESS' : 'PARTIAL',
    recommendations,
    generatedAt: new Date().toISOString(),
    aiPersonalization,
  };
}

// ─── Helper Functions ──────────────────────────────────────────────────────────

function buildDeterministicReason(ws: WeakSkill, language: 'vi' | 'en'): string {
  const { diagnosis, skill, hasAvailableContent } = ws;

  if (diagnosis.status === 'STRUGGLING') {
    return language === 'vi'
      ? `Học sinh đang gặp khó khăn với kỹ năng này (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`
      : `Student is struggling with this skill (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`;
  }

  if (!hasAvailableContent) {
    return language === 'vi'
      ? `Cần ôn luyện kỹ năng này (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`
      : `Needs practice on this skill (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`;
  }

  return language === 'vi'
    ? `Cần cải thiện kỹ năng (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`
    : `Needs improvement on this skill (pKnown: ${(diagnosis.pKnown * 100).toFixed(0)}%)`;
}

function mapQuestionToContent(question: QuestionDto): SuggestedContent {
  return {
    contentId: question.id,
    contentTitle: question.title,
    contentType: question.type,
    difficulty: question.difficulty,
  };
}
