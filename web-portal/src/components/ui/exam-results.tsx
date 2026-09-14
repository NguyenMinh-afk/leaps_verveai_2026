/**
 * VERVE AI — Exam Results View for Teacher Portal
 * Displays exam results with question-level detail
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import {
  getExamResults,
  getAttemptResults,
  getExam,
  type ExamResultSummary,
  type ExamResultDetail,
  type AttemptStatus,
} from '@/lib/api/exam';

// ============================================
// Types
// ============================================

interface ExamResultsViewProps {
  /** Exam ID to show results for */
  examId: string;
  /** Optional class name for display */
  className?: string;
  /** Callback when viewing student details */
  onViewStudent?: (studentId: string) => void;
}

interface ExamResultsTableProps {
  results: ExamResultSummary[];
  onViewDetails: (attemptId: string) => void;
  isLoading?: boolean;
}

interface AttemptResultModalProps {
  attemptId: string;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// Status Badge Helper
// ============================================

interface StatusConfigItem {
  label: string;
  labelVi: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
}

const statusConfig: Record<AttemptStatus, StatusConfigItem> = {
  IN_PROGRESS: { label: 'In Progress', labelVi: 'Đang làm', variant: 'info' },
  SUBMITTED: { label: 'Submitted', labelVi: 'Đã nộp', variant: 'warning' },
  GRADED: { label: 'Graded', labelVi: 'Đã chấm', variant: 'success' },
  MANUAL_REVIEW: { label: 'Needs Review', labelVi: 'Cần duyệt', variant: 'error' },
  COMPLETED: { label: 'Completed', labelVi: 'Hoàn thành', variant: 'success' },
};

function getStatusBadge(status: AttemptStatus, variantMap?: Record<AttemptStatus, StatusConfigItem>): { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' } {
  const config = variantMap?.[status] || statusConfig[status];
  return {
    label: config.labelVi,
    variant: config.variant,
  };
}

// ============================================
// Date Formatting
// ============================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return formatDate(dateStr);
  } catch {
    return '-';
  }
}

// ============================================
// Score Badge
// ============================================

function ScoreBadge({ score, maxScore, percentage }: { score: number; maxScore: number; percentage: number }) {
  const passed = percentage >= 60;
  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'font-semibold',
        passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
      )}>
        {score}/{maxScore}
      </span>
      <Badge variant={passed ? 'success' : 'error'} size="sm">
        {percentage.toFixed(0)}%
      </Badge>
    </div>
  );
}

// ============================================
// Results Table Row
// ============================================

interface ResultRowProps {
  result: ExamResultSummary;
  onViewDetails: () => void;
}

function ResultRow({ result, onViewDetails }: ResultRowProps) {
  const statusBadge = getStatusBadge(result.status);

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
          {result.studentId.slice(0, 8)}...
        </span>
      </td>
      <td className="px-4 py-3">
        <ScoreBadge score={result.score} maxScore={result.maxScore} percentage={result.percentage} />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Badge variant={statusBadge.variant} size="sm">
          {statusBadge.label}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {result.submittedAt ? formatRelativeTime(result.submittedAt) : '-'}
        </span>
      </td>
      <td className="px-4 py-3">
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          Chi tiết
        </Button>
      </td>
    </tr>
  );
}

// ============================================
// Results Table
// ============================================

function ExamResultsTable({ results, onViewDetails, isLoading }: ExamResultsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
          Chưa có kết quả
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Học sinh chưa hoàn thành bài kiểm tra nào
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mã HS
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Điểm
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
              Nộp lúc
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <ResultRow
              key={result.attemptId}
              result={result}
              onViewDetails={() => onViewDetails(result.attemptId)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Question-Level Results View
// ============================================

interface QuestionResultItemProps {
  questionIndex: number;
  answer: ExamResultDetail['answers'][number];
}

function QuestionResultItem({ questionIndex, answer }: QuestionResultItemProps) {
  const isCorrect = answer.isCorrect ?? false;
  const pointsEarned = answer.pointsEarned ?? 0;
  const maxPoints = 1; // Default, would need to fetch from exam questions

  return (
    <div className={cn(
      'rounded-lg border p-4',
      isCorrect 
        ? 'border-success-200 bg-success-50/50 dark:border-success-800 dark:bg-success-900/10'
        : 'border-error-200 bg-error-50/50 dark:border-error-800 dark:bg-error-900/10'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Câu {questionIndex + 1}
            </span>
            <Badge variant={isCorrect ? 'success' : 'error'} size="sm">
              {isCorrect ? 'Đúng' : 'Sai'}
            </Badge>
          </div>
          
          {/* Selected options */}
          {answer.selectedOptions && answer.selectedOptions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Đáp án đã chọn:</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {answer.selectedOptions.join(', ')}
              </p>
            </div>
          )}

          {/* Text answer */}
          {answer.textAnswer && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Câu trả lời:</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {answer.textAnswer}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <span className={cn(
            'text-lg font-bold',
            isCorrect ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
          )}>
            {pointsEarned}/{maxPoints}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Attempt Result Modal
// ============================================

function AttemptResultModal({ attemptId, isOpen, onClose }: AttemptResultModalProps) {
  const [result, setResult] = React.useState<ExamResultDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !attemptId) return;
    
    async function fetchAttemptResult() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttemptResults(attemptId);
        setResult(data);
      } catch (err) {
        console.error('Failed to fetch attempt results:', err);
        setError('Không thể tải kết quả bài làm');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAttemptResult();
  }, [attemptId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chi tiết kết quả
            </h2>
            {result && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {result.examTitle}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )}
          
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-center text-error-700 dark:border-error-800 dark:bg-error-900/20 dark:text-error-300">
              {error}
            </div>
          )}
          
          {result && !loading && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-4">
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Điểm</p>
                  <p className={cn(
                    'mt-1 text-2xl font-bold',
                    result.passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                  )}>
                    {result.score}/{result.maxScore}
                  </p>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Phần trăm</p>
                  <p className={cn(
                    'mt-1 text-2xl font-bold',
                    result.passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                  )}>
                    {result.percentage.toFixed(0)}%
                  </p>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Trạng thái</p>
                  <div className="mt-1">
                    <Badge variant={result.passed ? 'success' : 'error'} size="sm">
                      {result.passed ? 'Đạt' : 'Không đạt'}
                    </Badge>
                  </div>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Mã HS</p>
                  <p className="mt-1 font-mono text-sm text-slate-600 dark:text-slate-400">
                    {result.studentId.slice(0, 8)}...
                  </p>
                </Card>
              </div>
              
              {/* Time Info */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bắt đầu</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.startedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nộp lúc</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chấm điểm</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.gradedAt)}
                  </p>
                </div>
              </div>
              
              {/* Question Results */}
              {result.answers && result.answers.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Chi tiết câu hỏi
                  </h3>
                  <div className="space-y-3">
                    {result.answers.map((answer, index) => (
                      <QuestionResultItem
                        key={answer.questionId}
                        questionIndex={index}
                        answer={answer}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                  Chưa có dữ liệu chi tiết câu hỏi
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Exam Results View Component
// ============================================

export function ExamResultsView({ examId, className, onViewStudent }: ExamResultsViewProps) {
  const [results, setResults] = React.useState<ExamResultSummary[]>([]);
  const [examInfo, setExamInfo] = React.useState<{ title: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch exam info and results in parallel
        const [examData, resultsData] = await Promise.all([
          getExam(examId).catch(() => null),
          getExamResults(examId).catch(() => []),
        ]);
        
        setExamInfo(examData ? { title: examData.title } : null);
        setResults(resultsData);
      } catch (err) {
        console.error('Failed to fetch exam results:', err);
        setError('Không thể tải kết quả bài kiểm tra');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [examId]);

  const handleViewDetails = (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttemptId(null);
  };

  // Calculate summary stats
  const totalAttempts = results.length;
  const gradedAttempts = results.filter(r => r.status === 'GRADED' || r.status === 'COMPLETED').length;
  const avgScore = totalAttempts > 0 
    ? results.reduce((acc, r) => acc + r.percentage, 0) / totalAttempts 
    : 0;
  const passedCount = results.filter(r => r.passed).length;
  const passRate = gradedAttempts > 0 ? (passedCount / gradedAttempts) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {examInfo && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Kết quả bài kiểm tra
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {examInfo.title}
            </p>
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      {!loading && !error && totalAttempts > 0 && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card variant="default" padding="md">
            <p className="text-xs text-slate-500 dark:text-slate-400">Tổng lượt</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalAttempts}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-xs text-slate-500 dark:text-slate-400">Đã chấm</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {gradedAttempts}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-xs text-slate-500 dark:text-slate-400">Điểm TB</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {avgScore.toFixed(0)}%
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-xs text-slate-500 dark:text-slate-400">Tỷ lệ đạt</p>
            <p className={cn(
              'mt-1 text-2xl font-bold',
              passRate >= 60 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
            )}>
              {passRate.toFixed(0)}%
            </p>
          </Card>
        </div>
      )}
      
      {/* Results Table */}
      <Card variant="default" padding="none">
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            Danh sách kết quả
          </h4>
        </div>
        
        {error && (
          <div className="m-4 rounded-lg border border-error-200 bg-error-50 p-4 text-center text-sm text-error-700 dark:border-error-800 dark:bg-error-900/20 dark:text-error-300">
            {error}
          </div>
        )}
        
        <ExamResultsTable
          results={results}
          onViewDetails={handleViewDetails}
          isLoading={loading}
        />
      </Card>
      
      {/* Attempt Detail Modal */}
      {selectedAttemptId && (
        <AttemptResultModal
          attemptId={selectedAttemptId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// ============================================
// Export types for external use
// ============================================

export type { ExamResultsViewProps };
