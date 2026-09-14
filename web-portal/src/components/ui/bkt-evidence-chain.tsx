/**
 * VERVE AI - BKT Evidence Chain Components
 *
 * Components for displaying the real BKT (Bayesian Knowledge Tracing) evidence chain
 * from the backend API: GET /api/bkt/evidence/:id/chain
 *
 * This shows the reasoning chain - how P(L) probability changes after each evidence item.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { Progress } from './progress';
import type { EvidenceChain, EvidenceChainStep, MasteryStatus } from '@/lib/api/bkt';

interface BKTEvidenceChainViewProps {
  chain: EvidenceChain;
  className?: string;
}

/**
 * Format a probability as percentage string
 */
function formatProbability(p: number): string {
  return `${Math.round(p * 100)}%`;
}

/**
 * Get mastery status display info
 */
function getMasteryStatusDisplay(status: MasteryStatus): { label: string; labelVi: string; color: string; bgColor: string } {
  switch (status) {
    case 'MASTERED':
      return { label: 'Mastered', labelVi: 'Đã thành thạo', color: 'text-success-600 dark:text-success-400', bgColor: 'bg-success-100 dark:bg-success-900/30' };
    case 'DIAGNOSED':
      return { label: 'Diagnosed', labelVi: 'Đã chẩn đoán', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
    case 'STRUGGLING':
      return { label: 'Struggling', labelVi: 'Cần luyện tập', color: 'text-error-600 dark:text-error-400', bgColor: 'bg-error-100 dark:bg-error-900/30' };
    case 'PENDING':
    default:
      return { label: 'Pending', labelVi: 'Chưa xác định', color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' };
  }
}

/**
 * Get evidence quality display info
 */
function getQualityDisplay(quality: string): { label: string; color: string } {
  switch (quality) {
    case 'HIGH':
      return { label: 'Cao', color: 'text-success-600 dark:text-success-400' };
    case 'MEDIUM':
      return { label: 'Trung bình', color: 'text-amber-600 dark:text-amber-400' };
    case 'LOW':
      return { label: 'Thấp', color: 'text-error-600 dark:text-error-400' };
    default:
      return { label: 'Không xác định', color: 'text-slate-400' };
  }
}

/**
 * Format timestamp to relative time
 */
function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

/**
 * Single evidence step in the BKT chain
 */
function EvidenceStep({ step, index }: { step: EvidenceChainStep; index: number }) {
  const isCorrect = step.correct === true;
  const isIncorrect = step.correct === false;
  const delta = step.pKnownAfter - step.pKnownBefore;
  const quality = getQualityDisplay(step.quality);

  return (
    <div className="flex gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          isCorrect ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' :
          isIncorrect ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300' :
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        )}>
          {isCorrect ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : isIncorrect ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ) : (
            <span>?</span>
          )}
        </div>
        {index < 999 && <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-700" />}
      </div>

      {/* Content */}
      <div className={cn(
        'mb-4 flex-1 rounded-lg border p-4',
        isCorrect ? 'border-success-200 bg-success-50/50 dark:border-success-800 dark:bg-success-900/10' :
        isIncorrect ? 'border-error-200 bg-error-50/50 dark:border-error-800 dark:bg-error-900/10' :
        'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Bước {index + 1}
              </span>
              {step.correct === null ? (
                <Badge variant="default" size="sm">Không xác định</Badge>
              ) : isCorrect ? (
                <Badge variant="success" size="sm">Đúng</Badge>
              ) : (
                <Badge variant="error" size="sm">Sai</Badge>
              )}
              <span className={cn('text-xs', quality.color)} title="Chất lượng bằng chứng">
                Chất lượng: {quality.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              ID: {step.evidenceId.slice(0, 8)}... • {formatTime(step.createdAt)}
            </p>
          </div>
        </div>

        {/* P(L) change visualization */}
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Trước</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatProbability(step.pKnownBefore)}
                </span>
              </div>
              <Progress value={step.pKnownBefore * 100} size="sm" className="mt-1" />
            </div>

            {/* Arrow and delta */}
            <div className="flex flex-col items-center px-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className={cn(
                'mt-1 text-xs font-medium',
                delta > 0 ? 'text-success-600 dark:text-success-400' :
                delta < 0 ? 'text-error-600 dark:text-error-400' :
                'text-slate-400'
              )}>
                {delta > 0 ? '+' : ''}{formatProbability(delta)}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Sau</span>
                <span className={cn(
                  'font-medium',
                  step.pKnownAfter >= 0.8 ? 'text-success-600 dark:text-success-400' :
                  step.pKnownAfter >= 0.5 ? 'text-amber-600 dark:text-amber-400' :
                  'text-error-600 dark:text-error-400'
                )}>
                  {formatProbability(step.pKnownAfter)}
                </span>
              </div>
              <Progress 
                value={step.pKnownAfter * 100} 
                size="sm" 
                className={cn(
                  'mt-1',
                  step.pKnownAfter >= 0.8 ? '[&>div]:bg-success-500' :
                  step.pKnownAfter >= 0.5 ? '[&>div]:bg-amber-500' :
                  '[&>div]:bg-error-500'
                )} 
              />
            </div>
          </div>
        </div>

        {/* Confidence change */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Độ tin cậy: {formatProbability(step.confidenceBefore)} → {formatProbability(step.confidenceAfter)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * BKT Evidence Chain View Component
 *
 * Displays the reasoning chain showing how the mastery probability (P(L))
 * changes after each evidence item. This is the core BKT algorithm visualization.
 */
export function BKTEvidenceChainView({ chain, className }: BKTEvidenceChainViewProps) {
  const { t } = useLanguage();
  const statusDisplay = getMasteryStatusDisplay(chain.currentStatus);
  const correctCount = chain.steps.filter(s => s.correct === true).length;
  const incorrectCount = chain.steps.filter(s => s.correct === false).length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
          {t('bkt.evidenceChain') || 'Chuỗi suy luận BKT'}
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
        </div>
      </div>

      {/* Current state summary */}
      <Card variant="default" padding="md" className="border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('bkt.currentMastery') || 'Mức độ thành thạo hiện tại'}
            </p>
            <p className={cn(
              'mt-1 text-2xl font-bold',
              chain.currentPKnown >= 0.8 ? 'text-success-600 dark:text-success-400' :
              chain.currentPKnown >= 0.5 ? 'text-amber-600 dark:text-amber-400' :
              'text-error-600 dark:text-error-400'
            )}>
              {formatProbability(chain.currentPKnown)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('bkt.status') || 'Trạng thái'}
            </p>
            <Badge className={cn('mt-1', statusDisplay.bgColor, statusDisplay.color)} size="sm">
              {statusDisplay.labelVi}
            </Badge>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {chain.steps.length} {t('bkt.evidenceItems') || 'bằng chứng'}
            </p>
          </div>
        </div>

        {/* P(L) visualization bar */}
        <div className="mt-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                chain.currentPKnown >= 0.8 ? 'bg-success-500' :
                chain.currentPKnown >= 0.5 ? 'bg-amber-500' :
                'bg-error-500'
              )}
              style={{ width: `${chain.currentPKnown * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </Card>

      {/* Evidence Steps Timeline */}
      <div className="pl-2">
        {chain.steps.map((step, index) => (
          <EvidenceStep key={step.evidenceId} step={step} index={index} />
        ))}
      </div>

      {chain.steps.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
          {t('bkt.noEvidence') || 'Chưa có bằng chứng nào để hiển thị chuỗi suy luận'}
        </div>
      )}
    </div>
  );
}

// ============================================
// EVIDENCE CHAIN LOADER COMPONENT
// ============================================

interface EvidenceChainLoaderProps {
  diagnosisId: string;
  className?: string;
}

/**
 * Evidence Chain Loader Component
 *
 * Fetches and displays the BKT evidence chain for a given diagnosis.
 * Handles loading, error, and empty states.
 */
export function BKTEvidenceChainLoader({ diagnosisId, className }: EvidenceChainLoaderProps) {
  const { t } = useLanguage();
  const [chain, setChain] = React.useState<EvidenceChain | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchChain() {
      setIsLoading(true);
      setError(null);
      try {
        const { getEvidenceChain } = await import('@/lib/api/bkt');
        const data = await getEvidenceChain(diagnosisId);
        setChain(data);
      } catch (err) {
        console.error('Failed to fetch evidence chain:', err);
        setError(t('bkt.fetchError') || 'Không thể tải chuỗi bằng chứng. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    }

    if (diagnosisId) {
      fetchChain();
    }
  }, [diagnosisId, t]);

  if (isLoading) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('bkt.loading') || 'Đang tải chuỗi suy luận...'}
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="default" padding="lg" className={cn('border-error-200 dark:border-error-800', className)}>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-4 text-sm text-error-600 dark:text-error-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              import('@/lib/api/bkt').then(({ getEvidenceChain }) => {
                getEvidenceChain(diagnosisId)
                  .then(setChain)
                  .catch(() => setError(t('bkt.fetchError') || 'Không thể tải chuỗi bằng chứng'))
                  .finally(() => setIsLoading(false));
              });
            }}
          >
            {t('common.retry') || 'Thử lại'}
          </Button>
        </div>
      </Card>
    );
  }

  if (!chain || chain.steps.length === 0) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
            {t('bkt.noChain') || 'Không có chuỗi bằng chứng'}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('bkt.noChainDesc') || 'Chưa có đủ bằng chứng để xây dựng chuỗi suy luận BKT cho chẩn đoán này.'}
          </p>
        </div>
      </Card>
    );
  }

  return <BKTEvidenceChainView chain={chain} className={className} />;
}
