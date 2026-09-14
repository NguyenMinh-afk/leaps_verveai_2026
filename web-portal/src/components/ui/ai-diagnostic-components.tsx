// ============================================
// VERVE AI - AI Diagnostic UI Components
// ============================================
// Components for the 3-layer AI diagnostic UI:
// - DiagnosisCard: Shows diagnosis with confidence, abstention, root cause
// - EvidenceChainView: Teacher-facing evidence chain visualization
// - TeacherOverrideModal: Accept/Adjust/Reject workflow
// - TeacherExplanationCard: Layer 3 explanation display

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { Progress } from './progress';
import type {
  Diagnosis,
  DiagnosisEvidence,
  TeacherOverride,
  TeacherExplanation,
  DiagnosisStatus,
  ConfidenceLevel,
  OverrideReason,
  NonKnowledgeCause,
} from '@/types';

// ============================================
// DIAGNOSIS CARD
// ============================================

export interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  showStudentInfo?: boolean;
  showActions?: boolean;
  onViewEvidence?: (diagnosis: Diagnosis) => void;
  onOverride?: (diagnosis: Diagnosis) => void;
  className?: string;
}

/**
 * Get confidence level from confidence value
 */
function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

/**
 * Get status display info
 */
function getStatusDisplay(status: DiagnosisStatus): { label: string; labelVi: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'; } {
  switch (status) {
    case 'system_conclusion':
      return { label: 'System', labelVi: 'Hệ thống', variant: 'info' };
    case 'pending_review':
      return { label: 'Pending Review', labelVi: 'Chờ duyệt', variant: 'warning' };
    case 'accepted':
      return { label: 'Accepted', labelVi: 'Đã chấp nhận', variant: 'success' };
    case 'adjusted':
      return { label: 'Adjusted', labelVi: 'Đã điều chỉnh', variant: 'primary' };
    case 'rejected':
      return { label: 'Rejected', labelVi: 'Đã từ chối', variant: 'error' };
    case 'abstained':
      return { label: 'Abstained', labelVi: 'Chưa đủ dữ liệu', variant: 'default' };
    default:
      return { label: 'Unknown', labelVi: 'Không xác định', variant: 'default' };
  }
}

/**
 * Confidence Badge Component
 */
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const { t } = useLanguage()
  const level = getConfidenceLevel(confidence);
  const colors = {
    high: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  };
  const getLabel = (l: string) => {
    if (l === 'high') return t('interventions.high');
    if (l === 'medium') return t('interventions.medium');
    return t('interventions.low');
  };

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', colors[level])}>
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {Math.round(confidence * 100)}% ({getLabel(level)})
    </span>
  );
}

/**
 * Abstention Banner Component
 */
function AbstentionBanner({ reason }: { reason?: string }) {
  const { t } = useLanguage()
  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600">
        <svg className="h-4 w-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{t('diagnosis.cannotConclude')}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {reason || t('diagnosis.insufficientData')}
        </p>
      </div>
    </div>
  );
}

/**
 * Non-Knowledge Badge
 */
function NonKnowledgeBadge({ cause }: { cause: NonKnowledgeCause }) {
  const { t } = useLanguage()
  const config = {
    carelessness: { label: t('diagnosis.careless'), variant: 'warning' as const },
    guessing: { label: t('diagnosis.randomGuess'), variant: 'warning' as const },
    language_barrier: { label: t('diagnosis.languageBarrier') || 'Rào cản ngôn ngữ', variant: 'info' as const },
    test_anxiety: { label: t('diagnosis.testAnxiety') || 'Lo lắng khi thi', variant: 'info' as const },
    other_non_knowledge: { label: t('diagnosis.otherNonKnowledge') || 'Nguyên nhân khác', variant: 'info' as const },
  };
  const info = config[cause] || config.other_non_knowledge;

  return (
    <Badge variant={info.variant} size="sm" className="gap-1">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {info.label}
    </Badge>
  );
}

/**
 * Diagnosis Card Component
 */
export function DiagnosisCard({
  diagnosis,
  showStudentInfo = false,
  showActions = true,
  onViewEvidence,
  onOverride,
  className,
}: DiagnosisCardProps) {
  const { t } = useLanguage()
  const statusInfo = getStatusDisplay(diagnosis.status);
  const confidenceLevel = getConfidenceLevel(diagnosis.confidence);
  const isAbstained = diagnosis.abstain || diagnosis.status === 'abstained';

  // Determine if override is allowed
  const canOverride = diagnosis.status === 'pending_review' || diagnosis.status === 'system_conclusion';

  return (
    <Card variant="default" padding="none" className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant} size="sm">
              {statusInfo.labelVi}
            </Badge>
            {diagnosis.teacherOverride && (
              <Badge variant="outline" size="sm" className="gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('diagnosis.teacherApproved') || 'GV đã duyệt'}
              </Badge>
            )}
          </div>
          {!isAbstained && (
            <ConfidenceBadge confidence={diagnosis.confidence} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Student info */}
        {showStudentInfo && diagnosis.studentName && (
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {diagnosis.studentName}
          </div>
        )}

        {/* Abstention Banner */}
        {isAbstained && (
          <AbstentionBanner reason={diagnosis.abstainReason ? `${t('diagnosis.reason') || 'Lý do'}: ${diagnosis.abstainReason}` : undefined} />
        )}

        {/* Root Cause */}
        {!isAbstained && (
          <>
            <div className="mb-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('diagnosis.rootCause')}
              </p>
              <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {diagnosis.rootCauseVi || diagnosis.rootCause}
              </h4>
              {diagnosis.skillNameVi && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {t('mastery.skills') || 'Kỹ năng'}: {diagnosis.skillNameVi}
                </p>
              )}
            </div>

            {/* Non-knowledge flag */}
            {diagnosis.nonKnowledgeCause && (
              <div className="mb-3">
                <NonKnowledgeBadge cause={diagnosis.nonKnowledgeCause} />
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('diagnosis.nonKnowledgeWarning') || 'Hệ thống phát hiện đây có thể không phải là lỗ hổng kiến thức. Kết luận kiến thức bị tạm dừng.'}
                </p>
              </div>
            )}

            {/* pKnown (BKT) */}
            {diagnosis.pKnown !== undefined && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t('mastery.title') || 'Mức độ thành thạo'} (pKnown)</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {Math.round(diagnosis.pKnown * 100)}%
                  </span>
                </div>
                <Progress value={diagnosis.pKnown * 100} size="sm" className="mt-1" />
              </div>
            )}

            {/* Teacher Override Info */}
            {diagnosis.teacherOverride && (
              <div className="mt-3 rounded-lg border border-primary-200 bg-primary-50 p-3 dark:border-primary-800 dark:bg-primary-900/20">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-primary-700 dark:text-primary-300">
                    {t('diagnosis.teacherDecision') || 'Quyết định của giáo viên'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">
                  {diagnosis.teacherOverride.newConclusionVi || diagnosis.teacherOverride.newConclusion}
                </p>
                {diagnosis.teacherOverride.reasonDetail && (
                  <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
                    {t('diagnosis.note') || 'Ghi chú'}: {diagnosis.teacherOverride.reasonDetail}
                  </p>
                )}
              </div>
            )}

            {/* Evidence count */}
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {diagnosis.evidenceIds.length} {t('diagnosis.evidence')}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {showActions && !isAbstained && (
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          {onViewEvidence && (
            <Button variant="ghost" size="sm" onClick={() => onViewEvidence(diagnosis)}>
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t('diagnosis.viewEvidence') || 'Xem bằng chứng'}
            </Button>
          )}
          {onOverride && canOverride && (
            <Button variant="outline" size="sm" onClick={() => onOverride(diagnosis)}>
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t('diagnosis.reviewConclusion') || 'Duyệt kết luận'}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

// ============================================
// EVIDENCE CHAIN VIEW
// ============================================

export interface EvidenceChainViewProps {
  evidenceItems: DiagnosisEvidence[];
  diagnosisId?: string;
  className?: string;
}

/**
 * Evidence Item Row Component
 */
function EvidenceItemRow({ evidence, index }: { evidence: DiagnosisEvidence; index: number }) {
  const { t } = useLanguage()
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
      {/* Index indicator */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium dark:bg-slate-600">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        {/* Question */}
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {evidence.itemContentVi || evidence.itemContent}
        </p>

        {/* Response */}
        <div className="mt-1 flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
            evidence.correct
              ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
              : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300'
          )}>
            {evidence.correct ? `✓ ${t('common.yes') || 'Đúng'}` : `✗ ${t('common.no') || 'Sai'}`}
          </span>
          {!evidence.correct && evidence.selectedDistractor && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t('diagnosis.error') || 'Lỗi'}: {evidence.selectedDistractor}
            </span>
          )}
          {evidence.isAbstain && (
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              "{t('diagnosis.abstain') || 'Tôi không chắc'}"
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {evidence.latencyMs ? `${Math.round(evidence.latencyMs / 1000)}s` : 'N/A'}
          </span>
          <span className={cn(
            'flex items-center gap-1',
            evidence.contextMode === 'in-class' ? 'text-success-600 dark:text-success-400' : ''
          )}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {evidence.contextMode === 'in-class' ? t('diagnosis.inClass') || 'Trên lớp' : t('diagnosis.outOfClass') || 'Ngoài lớp'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t('diagnosis.weight') || 'Trọng số'}: {Math.round(evidence.confidenceWeight * 100)}%
          </span>
        </div>

        {/* Extraction status (Layer 1) */}
        {evidence.extractionStatus && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">{t('diagnosis.extraction') || 'Trích xuất (AI)'} :</span>
            <span className={cn(
              'flex items-center gap-1',
              evidence.extractionStatus === 'completed' ? 'text-success-600 dark:text-success-400' :
              evidence.extractionStatus === 'pending' ? 'text-amber-600 dark:text-amber-400' :
              'text-error-600 dark:text-error-400'
            )}>
              {evidence.extractionStatus === 'completed' && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {evidence.extractionStatus === 'pending' && (
                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {evidence.extractionStatus === 'completed' ? t('common.success') || 'Hoàn thành' :
               evidence.extractionStatus === 'pending' ? t('common.loading') || 'Đang xử lý' : t('common.error') || 'Lỗi'}
            </span>
            {evidence.extractionConfidence && (
              <span className="text-slate-400">
                ({Math.round(evidence.extractionConfidence * 100)}%)
              </span>
            )}
          </div>
        )}

        {/* Non-knowledge cause */}
        {evidence.nonKnowledgeCause && (
          <div className="mt-2">
            <Badge variant="warning" size="sm" className="gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {evidence.nonKnowledgeCause === 'carelessness' ? t('diagnosis.careless') :
               evidence.nonKnowledgeCause === 'guessing' ? t('diagnosis.randomGuess') :
               evidence.nonKnowledgeCause === 'language_barrier' ? t('diagnosis.languageBarrier') || 'Rào cản ngôn ngữ' :
               t('diagnosis.nonKnowledge') || 'Nguyên nhân phi kiến thức'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Evidence Chain View Component
 */
export function EvidenceChainView({ evidenceItems, diagnosisId, className }: EvidenceChainViewProps) {
  const { t } = useLanguage()
  const correctCount = evidenceItems.filter(e => e.correct).length;
  const incorrectCount = evidenceItems.filter(e => !e.correct).length;
  const abstainsCount = evidenceItems.filter(e => e.isAbstain).length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
          {t('diagnosis.evidenceChain') || 'Chuỗi bằng chứng'}
        </h4>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-success-600 dark:text-success-400">
            <span className="h-2 w-2 rounded-full bg-success-500" />
            {correctCount} {t('diagnosis.correct') || 'đúng'}
          </span>
          <span className="flex items-center gap-1 text-error-600 dark:text-error-400">
            <span className="h-2 w-2 rounded-full bg-error-500" />
            {incorrectCount} {t('diagnosis.incorrect') || 'sai'}
          </span>
          {abstainsCount > 0 && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              {abstainsCount} {t('diagnosis.unsure') || 'không chắc'}
            </span>
          )}
        </div>
      </div>

      {/* Evidence Items */}
      <div className="space-y-2">
        {evidenceItems.map((evidence, index) => (
          <EvidenceItemRow key={evidence.id} evidence={evidence} index={index} />
        ))}
      </div>

      {evidenceItems.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
          {t('diagnosis.noEvidence') || 'Chưa có bằng chứng nào'}
        </div>
      )}
    </div>
  );
}

// ============================================
// TEACHER OVERRIDE MODAL
// ============================================

export interface TeacherOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: Diagnosis | null;
  onOverride: (override: TeacherOverride) => void;
  teacherId?: string;
  teacherName?: string;
}

const overrideReasons: { value: OverrideReason; label: string; labelVi: string; description: string }[] = [
  { value: 'correct_conclusion', label: 'Confirm correct', labelVi: 'Xác nhận đúng', description: 'System conclusion is correct' },
  { value: 'wrong_cause', label: 'Wrong cause', labelVi: 'Sai nguyên nhân', description: 'System identified wrong root cause' },
  { value: 'missing_context', label: 'Missing context', labelVi: 'Thiếu ngữ cảnh', description: 'I have additional information' },
  { value: 'insufficient_evidence', label: 'Insufficient evidence', labelVi: 'Bằng chứng không đủ', description: 'More evidence is needed' },
  { value: 'student_knows_better', label: 'Student understands', labelVi: 'HS hiểu bài', description: 'I know this student understands' },
  { value: 'other', label: 'Other', labelVi: 'Khác', description: 'Other reason' },
];

/**
 * Teacher Override Modal Component
 */
export function TeacherOverrideModal({ isOpen, onClose, diagnosis, onOverride, teacherId, teacherName }: TeacherOverrideModalProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [overrideType, setOverrideType] = React.useState<'accept' | 'adjust' | 'reject'>('accept');
  const [reason, setReason] = React.useState<OverrideReason>('correct_conclusion');
  const [newConclusion, setNewConclusion] = React.useState('');
  const [note, setNote] = React.useState('');

  // Resolve teacher info: props > auth context > fallback
  const resolvedTeacherId = teacherId || user?.id || 'unknown';
  const resolvedTeacherName = teacherName || user?.name || 'Unknown Teacher';

  // Reset form when diagnosis changes
  React.useEffect(() => {
    if (diagnosis) {
      setNewConclusion(diagnosis.rootCauseVi || diagnosis.rootCause);
      setNote('');
      setReason('correct_conclusion');
      setOverrideType('accept');
    }
  }, [diagnosis]);

  if (!isOpen || !diagnosis) return null;

  const handleSubmit = () => {
    const override: TeacherOverride = {
      originalDiagnosis: diagnosis.rootCause,
      originalDiagnosisVi: diagnosis.rootCauseVi,
      originalConfidence: diagnosis.confidence,
      newConclusion: overrideType === 'reject' ? diagnosis.rootCause : newConclusion,
      newConclusionVi: overrideType === 'reject' ? diagnosis.rootCauseVi : newConclusion,
      overrideType,
      reason,
      reasonDetail: note,
      teacherId: resolvedTeacherId,
      teacherName: resolvedTeacherName,
      createdAt: new Date(),
    };
    onOverride(override);
    onClose();
  };

  const getOverrideLabel = (type: 'accept' | 'adjust' | 'reject') => {
    if (type === 'accept') return t('common.accept') || 'Chấp nhận';
    if (type === 'adjust') return t('common.adjust') || 'Điều chỉnh';
    return t('common.reject') || 'Từ chối';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('diagnosis.reviewDiagnosis') || 'Duyệt kết luận chẩn đoán'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Original Diagnosis */}
        <div className="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('diagnosis.systemConclusion') || 'Kết luận của hệ thống'}
          </p>
          <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
            {diagnosis.rootCauseVi || diagnosis.rootCause}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ConfidenceBadge confidence={diagnosis.confidence} />
          </div>
        </div>

        {/* Override Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('diagnosis.yourDecision') || 'Quyết định của bạn'}
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOverrideType('accept')}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors',
                overrideType === 'accept'
                  ? 'border-success-500 bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">{getOverrideLabel('accept')}</span>
            </button>
            <button
              type="button"
              onClick={() => setOverrideType('adjust')}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors',
                overrideType === 'adjust'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm font-medium">{getOverrideLabel('adjust')}</span>
            </button>
            <button
              type="button"
              onClick={() => setOverrideType('reject')}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors',
                overrideType === 'reject'
                  ? 'border-error-500 bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">{getOverrideLabel('reject')}</span>
            </button>
          </div>
        </div>

        {/* Adjusted Conclusion */}
        {overrideType === 'adjust' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('diagnosis.newConclusion') || 'Kết luận mới'}
            </label>
            <input
              type="text"
              value={newConclusion}
              onChange={(e) => setNewConclusion(e.target.value)}
              placeholder={t('diagnosis.enterNewConclusion') || 'Nhập kết luận mới...'}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {/* Reason Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('interventions.reason')}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as OverrideReason)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {overrideReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.labelVi}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('interventions.notes')} ({t('common.optional') || 'tùy chọn'})
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('diagnosis.addNote') || 'Thêm ghi chú giải thích quyết định của bạn...'}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant={overrideType === 'reject' ? 'destructive' : 'primary'}
            onClick={handleSubmit}
            disabled={overrideType === 'adjust' && !newConclusion.trim()}
          >
            {t('diagnosis.saveDecision') || 'Lưu quyết định'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEACHER EXPLANATION CARD (Layer 3)
// ============================================

export interface TeacherExplanationCardProps {
  explanation: TeacherExplanation;
  className?: string;
}

/**
 * Teacher Explanation Card Component
 */
export function TeacherExplanationCard({ explanation, className }: TeacherExplanationCardProps) {
  const { t } = useLanguage()
  return (
    <Card variant="default" padding="md" className={cn('border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/10', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-primary-700 dark:text-primary-300">
            {t('diagnosis.systemExplanation') || 'Giải thích từ hệ thống'}
          </h4>
          {explanation.isFactChecked !== undefined && (
            <p className="text-xs text-primary-600 dark:text-primary-400">
              {explanation.isFactChecked ? `✓ ${t('diagnosis.factChecked') || 'Đã kiểm tra tính chính xác'}` : `⚠ ${t('diagnosis.notChecked') || 'Chưa kiểm tra'}`}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {explanation.summaryVi || explanation.summary}
      </p>

      {/* Reasoning */}
      {explanation.reasoningVi && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('diagnosis.reasoning') || 'Lý do'}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {explanation.reasoningVi}
          </p>
        </div>
      )}

      {/* Affected Skills */}
      {explanation.affectedSkills && explanation.affectedSkills.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('diagnosis.relatedSkills') || 'Kỹ năng liên quan'}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {explanation.affectedSkills.map((skill, index) => (
              <Badge key={index} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {explanation.recommendedActionsVi && explanation.recommendedActionsVi.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('interventions.recommendedAction')}
          </p>
          <ul className="mt-1 space-y-1">
            {explanation.recommendedActionsVi.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence Highlights */}
      {explanation.evidenceHighlights && explanation.evidenceHighlights.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('diagnosis.evidenceHighlights') || 'Điểm bằng chứng chính'}
          </p>
          <ul className="mt-1 space-y-1">
            {explanation.evidenceHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// ============================================
// DIAGNOSTIC INTERVENTION CARD
// ============================================

export interface DiagnosticInterventionCardProps {
  intervention: import('@/types').DiagnosticInterventionGroup;
  onViewDetails?: (intervention: import('@/types').DiagnosticInterventionGroup) => void;
  onViewStudent?: (studentId: string) => void;
  className?: string;
}

/**
 * Diagnostic Intervention Card Component
 */
export function DiagnosticInterventionCard({
  intervention,
  onViewDetails,
  onViewStudent,
  className,
}: DiagnosticInterventionCardProps) {
  const { t } = useLanguage()
  const severityColors = {
    high: {
      bg: 'bg-error-50 dark:bg-error-900/20',
      border: 'border-l-4 border-l-error-500',
      badge: 'error' as const,
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-l-4 border-l-amber-500',
      badge: 'warning' as const,
    },
    low: {
      bg: 'bg-info-50 dark:bg-info-900/20',
      border: 'border-l-4 border-l-info-500',
      badge: 'info' as const,
    },
  };

  const colors = severityColors[intervention.severity];
  const confidenceColors = {
    high: 'text-success-600 dark:text-success-400',
    medium: 'text-amber-600 dark:text-amber-400',
    low: 'text-error-600 dark:text-error-400',
  };

  const getSeverityLabel = (s: 'high' | 'medium' | 'low') => {
    if (s === 'high') return t('interventions.highSeverity') || 'Nghiêm trọng';
    if (s === 'medium') return t('interventions.mediumSeverity') || 'Trung bình';
    return t('interventions.lowSeverity') || 'Nhẹ';
  };

  return (
    <Card variant="default" padding="none" className={cn('overflow-hidden', className)}>
      <div className={cn('p-4', colors.bg)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {intervention.rootCauseVi || intervention.rootCause}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {intervention.evidenceSummaryVi || intervention.evidenceSummary}
            </p>
          </div>
          <Badge variant={colors.badge} size="sm">
            {getSeverityLabel(intervention.severity)}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{intervention.size} {t('interventions.students') || 'học sinh'}</span>
          </div>
          <div className={cn('flex items-center gap-1.5', confidenceColors[intervention.confidenceLevel])}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{t('diagnosis.confidence') || 'Độ tin cậy'}: {Math.round(intervention.averageConfidence * 100)}%</span>
          </div>
        </div>

        {/* Skills */}
        {intervention.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {intervention.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-400"
              >
                {skill}
              </span>
            ))}
            {intervention.skills.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800/80 dark:text-slate-500">
                +{intervention.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Non-knowledge flag */}
        {intervention.hasNonKnowledgeCases && (
          <div className="mt-3">
            <Badge variant="warning" size="sm" className="gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {(intervention.nonKnowledgeCount || t('diagnosis.some')) + ' ' + (t('diagnosis.nonKnowledgeCases') || 'trường hợp nghi ngờ không phải lỗ hổng kiến thức')}
            </Badge>
          </div>
        )}

        {/* Status */}
        <div className="mt-3 flex items-center gap-2">
          <Badge
            variant={
              intervention.status === 'resolved' ? 'success' :
              intervention.status === 'in-progress' ? 'info' : 'warning'
            }
            size="sm"
          >
            {intervention.status === 'resolved' ? t('interventions.resolved') :
             intervention.status === 'in-progress' ? t('interventions.inProgress') || 'Đang xử lý' : t('interventions.pending')}
          </Badge>
        </div>
      </div>

      {/* Students List */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('interventions.students')}
        </p>
        <div className="flex flex-wrap gap-2">
          {intervention.students.map((student) => (
            <button
              key={student.id}
              onClick={() => onViewStudent?.(student.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span>{student.name}</span>
              <span className="text-slate-400">({student.code})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => onViewDetails?.(intervention)}>
          {t('interventions.viewDetails')}
        </Button>
        {intervention.status === 'pending' && (
          <Button variant="primary" size="sm" className="flex-1">
            {t('interventions.process') || 'Xử lý'}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Export all components (named exports are at function definitions above)
