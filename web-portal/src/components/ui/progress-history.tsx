/**
 * VERVE AI - Progress History Components
 *
 * Components for displaying student progress history from the backend API:
 * GET /api/class/progress/:studentId/history
 *
 * Shows the historical mastery changes for a specific skill.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { Progress } from './progress';
import type { ProgressHistory as ProgressHistoryType } from '@/lib/api/classes';

interface ProgressHistoryCardProps {
  history: ProgressHistoryType;
  skillName?: string;
  className?: string;
}

/**
 * Format a probability as percentage string
 */
function formatProbability(p: number): string {
  return `${Math.round(p * 100)}%`;
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
 * Format timestamp to full date
 */
function formatFullDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get mastery status display info
 */
function getMasteryStatusDisplay(pKnown: number): { label: string; labelVi: string; color: string; bgColor: string } {
  if (pKnown >= 0.8) {
    return { label: 'Mastered', labelVi: 'Đã thành thạo', color: 'text-success-600 dark:text-success-400', bgColor: 'bg-success-100 dark:bg-success-900/30' };
  }
  if (pKnown >= 0.5) {
    return { label: 'Learning', labelVi: 'Đang học', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
  }
  if (pKnown >= 0.3) {
    return { label: 'Needs Practice', labelVi: 'Cần luyện tập', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
  }
  return { label: 'Struggling', labelVi: 'Cần hỗ trợ', color: 'text-error-600 dark:text-error-400', bgColor: 'bg-error-100 dark:bg-error-900/30' };
}

/**
 * Progress History Card Component
 *
 * Shows the historical mastery changes for a skill with before/after comparison.
 */
export function ProgressHistoryCard({ history, skillName, className }: ProgressHistoryCardProps) {
  const { t } = useLanguage();
  const currentStatus = getMasteryStatusDisplay(history.current.pKnown);
  const hasPrevious = history.previous !== null;
  const delta = history.delta;
  const deltaPercent = Math.abs(Math.round(delta * 100));

  return (
    <Card variant="default" padding="md" className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            {skillName || t('progress.history') || 'Lịch sử tiến bộ'}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('progress.windowDays', { days: history.windowDays }) || `Dữ liệu trong ${history.windowDays} ngày`}
          </p>
        </div>
        <Badge className={cn(currentStatus.bgColor, currentStatus.color)} size="sm">
          {currentStatus.labelVi}
        </Badge>
      </div>

      {/* Current State */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t('progress.currentMastery') || 'Mức độ hiện tại'}
          </span>
          <span className={cn('text-lg font-bold', currentStatus.color)}>
            {formatProbability(history.current.pKnown)}
          </span>
        </div>
        <Progress
          value={history.current.pKnown * 100}
          size="md"
          className={cn(
            history.current.pKnown >= 0.8 ? '[&>div]:bg-success-500' :
            history.current.pKnown >= 0.5 ? '[&>div]:bg-amber-500' :
            '[&>div]:bg-error-500'
          )}
        />
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{history.current.attemptCount} {t('progress.attempts') || 'lần thực hiện'}</span>
          <span>{formatFullDate(history.current.timestamp)}</span>
        </div>
      </div>

      {/* Change Indicator */}
      {hasPrevious && (
        <div className={cn(
          'flex items-center justify-center gap-3 rounded-lg p-3',
          delta > 0 ? 'bg-success-50 dark:bg-success-900/20' :
          delta < 0 ? 'bg-error-50 dark:bg-error-900/20' :
          'bg-slate-50 dark:bg-slate-800'
        )}>
          <div className="flex items-center gap-2">
            {delta > 0 ? (
              <>
                <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-sm font-medium text-success-600 dark:text-success-400">
                  +{deltaPercent}%
                </span>
              </>
            ) : delta < 0 ? (
              <>
                <svg className="h-5 w-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm font-medium text-error-600 dark:text-error-400">
                  -{deltaPercent}%
                </span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('progress.noChange') || 'Không thay đổi'}
                </span>
              </>
            )}
          </div>

          {delta !== 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t('progress.sinceLast') || 'kể từ lần cập nhật trước'}
            </span>
          )}
        </div>
      )}

      {/* Previous State */}
      {hasPrevious && history.previous && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t('progress.previousMastery') || 'Mức độ trước đó'}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {formatProbability(history.previous.pKnown)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>{history.previous.attemptCount} {t('progress.attempts') || 'lần thực hiện'}</span>
            <span>{formatTime(history.previous.timestamp)}</span>
          </div>
        </div>
      )}

      {/* No previous data */}
      {!hasPrevious && (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center dark:border-slate-600">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('progress.firstAttempt') || 'Đây là dữ liệu đầu tiên cho kỹ năng này'}
          </p>
        </div>
      )}
    </Card>
  );
}

// ============================================
// PROGRESS HISTORY LOADER
// ============================================

interface ProgressHistoryLoaderProps {
  studentId: string;
  skillId: string;
  skillName?: string;
  days?: number;
  className?: string;
}

/**
 * Progress History Loader Component
 *
 * Fetches and displays the progress history for a specific skill.
 * Handles loading, error, and empty states.
 */
export function ProgressHistoryLoader({ 
  studentId, 
  skillId, 
  skillName, 
  days = 30,
  className 
}: ProgressHistoryLoaderProps) {
  const { t } = useLanguage();
  const [history, setHistory] = React.useState<ProgressHistoryType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const { getProgressHistory } = await import('@/lib/api/classes');
        const data = await getProgressHistory(studentId, { skillId, days });
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch progress history:', err);
        setError(t('progress.fetchError') || 'Không thể tải lịch sử tiến bộ. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    }

    if (studentId && skillId) {
      fetchHistory();
    }
  }, [studentId, skillId, days, t]);

  if (isLoading) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('progress.loading') || 'Đang tải lịch sử...'}
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
              import('@/lib/api/classes').then(({ getProgressHistory }) => {
                getProgressHistory(studentId, { skillId, days })
                  .then(setHistory)
                  .catch(() => setError(t('progress.fetchError') || 'Không thể tải lịch sử'))
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

  if (!history) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
            {t('progress.noHistory') || 'Không có dữ liệu lịch sử'}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('progress.noHistoryDesc') || 'Chưa có đủ dữ liệu để hiển thị lịch sử tiến bộ.'}
          </p>
        </div>
      </Card>
    );
  }

  return <ProgressHistoryCard history={history} skillName={skillName} className={className} />;
}
