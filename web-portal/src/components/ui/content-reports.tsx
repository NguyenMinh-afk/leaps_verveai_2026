/**
 * VERVE AI - Content Reports Components
 *
 * Components for displaying content reports from the backend APIs:
 * - GET /api/content/reports/aggregate
 * - GET /api/content/reports/class/:id
 * - GET /api/content/reports/student/:id
 * - GET /api/content/reports/export/:type
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import type { 
  AggregateReport, 
  ClassReportData, 
  StudentReportData, 
  ExportResult 
} from '@/lib/api/content';

// ============================================
// AGGREGATE REPORT COMPONENT
// ============================================

interface AggregateReportCardProps {
  report: AggregateReport;
  className?: string;
}

/**
 * Aggregate Report Card Component
 *
 * Shows cross-service statistics including content, bundles, and reviews.
 */
export function AggregateReportCard({ report, className }: AggregateReportCardProps) {
  const { t } = useLanguage();

  const { content, bundles, reviews, upstream } = report.data;

  return (
    <Card variant="default" padding="md" className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            {t('reports.aggregate') || 'Báo cáo Tổng hợp'}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('reports.generatedAt') || 'Tạo lúc'}: {new Date(report.generatedAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <Badge variant="info" size="sm">
          {t('reports.live') || 'Dữ liệu thực'}
        </Badge>
      </div>

      {/* Content Stats */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('reports.content') || 'Nội dung'}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <StatItem label={t('reports.total') || 'Tổng'} value={content.total} />
          <StatItem label={t('reports.draft') || 'Bản nháp'} value={content.draft} />
          <StatItem label={t('reports.pendingReview') || 'Chờ duyệt'} value={content.pendingReview} variant="warning" />
          <StatItem label={t('reports.approved') || 'Đã duyệt'} value={content.approved} variant="success" />
          <StatItem label={t('reports.rejected') || 'Từ chối'} value={content.rejected} variant="error" />
        </div>
      </div>

      {/* Bundles Stats */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('reports.bundles') || 'Gói nội dung'}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatItem label={t('reports.total') || 'Tổng'} value={bundles.total} />
          <StatItem label={t('reports.built') || 'Đã xây dựng'} value={bundles.built} />
          <StatItem label={t('reports.signed') || 'Đã ký'} value={bundles.signed} />
          <StatItem label={t('reports.published') || 'Đã xuất bản'} value={bundles.published} variant="success" />
        </div>
      </div>

      {/* Reviews Stats */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('reports.reviews') || 'Đánh giá'}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatItem label={t('reports.total') || 'Tổng'} value={reviews.total} />
          <StatItem label={t('reports.pending') || 'Đang chờ'} value={reviews.pending} variant="warning" />
          <StatItem label={t('reports.approved') || 'Đã duyệt'} value={reviews.approved} variant="success" />
          <StatItem label={t('reports.rejected') || 'Từ chối'} value={reviews.rejected} variant="error" />
        </div>
      </div>

      {/* Service Status */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>{t('reports.serviceStatus') || 'Trạng thái dịch vụ'}:</span>
        <span className={cn(
          'flex items-center gap-1',
          upstream.svcClass === 'ok' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
        )}>
          <span className="h-2 w-2 rounded-full bg-current" />
          Class Service: {upstream.svcClass === 'ok' ? t('common.online') || 'Online' : t('common.offline') || 'Offline'}
        </span>
        <span className={cn(
          'flex items-center gap-1',
          upstream.svcBkt === 'ok' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
        )}>
          <span className="h-2 w-2 rounded-full bg-current" />
          BKT Service: {upstream.svcBkt === 'ok' ? t('common.online') || 'Online' : t('common.offline') || 'Offline'}
        </span>
      </div>
    </Card>
  );
}

// ============================================
// CLASS REPORT COMPONENT
// ============================================

interface ClassReportCardProps {
  report: ClassReportData;
  className?: string;
}

/**
 * Class Report Card Component
 *
 * Shows class-level content statistics.
 */
export function ClassReportCard({ report, className }: ClassReportCardProps) {
  const { t } = useLanguage();
  const { classInfo, contentStats, bundlesUsed } = report;

  return (
    <Card variant="default" padding="md" className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            {t('reports.classReport') || 'Báo cáo Lớp học'}
          </h4>
          {classInfo && typeof classInfo === 'object' && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {(classInfo as { name?: string }).name || report.classId}
            </p>
          )}
        </div>
        <Badge variant="info" size="sm">
          {t('reports.classLevel') || 'Cấp lớp'}
        </Badge>
      </div>

      {/* Content Stats */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('reports.contentStats') || 'Thống kê nội dung'}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatItem label={t('reports.total') || 'Tổng'} value={contentStats.total} />
          <StatItem label={t('reports.draft') || 'Bản nháp'} value={contentStats.draft} />
          <StatItem label={t('reports.approved') || 'Đã duyệt'} value={contentStats.approved} variant="success" />
          <StatItem label={t('reports.pendingReview') || 'Chờ duyệt'} value={contentStats.pendingReview} variant="warning" />
        </div>
      </div>

      {/* Bundles Used */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {t('reports.bundlesUsed') || 'Gói nội dung đã sử dụng'}
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {bundlesUsed}
        </span>
      </div>

      {/* Generated Time */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('reports.generatedAt') || 'Tạo lúc'}: {new Date(report.generatedAt).toLocaleString('vi-VN')}
      </p>
    </Card>
  );
}

// ============================================
// STAT ITEM HELPER
// ============================================

interface StatItemProps {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

function StatItem({ label, value, variant = 'default' }: StatItemProps) {
  const variantColors = {
    default: 'text-slate-900 dark:text-slate-100',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-error-600 dark:text-error-400',
  };

  return (
    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn('text-lg font-bold', variantColors[variant])}>{value}</p>
    </div>
  );
}

// ============================================
// REPORT LOADER COMPONENTS
// ============================================

interface AggregateReportLoaderProps {
  className?: string;
}

export function AggregateReportLoader({ className }: AggregateReportLoaderProps) {
  const { t } = useLanguage();
  const [report, setReport] = React.useState<AggregateReport | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);
      setError(null);
      try {
        const { getAggregateReport } = await import('@/lib/api/content');
        const data = await getAggregateReport();
        setReport(data);
      } catch (err) {
        console.error('Failed to fetch aggregate report:', err);
        setError(t('reports.fetchError') || 'Không thể tải báo cáo tổng hợp.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [t]);

  if (isLoading) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('reports.loading') || 'Đang tải báo cáo...'}
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
        </div>
      </Card>
    );
  }

  if (!report) return null;

  return <AggregateReportCard report={report} className={className} />;
}

interface ClassReportLoaderProps {
  classId: string;
  className?: string;
}

export function ClassReportLoader({ classId, className }: ClassReportLoaderProps) {
  const { t } = useLanguage();
  const [report, setReport] = React.useState<ClassReportData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);
      setError(null);
      try {
        const { getClassReport } = await import('@/lib/api/content');
        const data = await getClassReport(classId);
        setReport(data);
      } catch (err) {
        console.error('Failed to fetch class report:', err);
        setError(t('reports.fetchError') || 'Không thể tải báo cáo lớp học.');
      } finally {
        setIsLoading(false);
      }
    }
    if (classId) {
      fetchReport();
    }
  }, [classId, t]);

  if (isLoading) {
    return (
      <Card variant="default" padding="lg" className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('reports.loading') || 'Đang tải báo cáo...'}
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
        </div>
      </Card>
    );
  }

  if (!report) return null;

  return <ClassReportCard report={report} className={className} />;
}

// ============================================
// EXPORT REPORT COMPONENT
// ============================================

interface ExportReportButtonProps {
  type: 'aggregate' | 'classes' | 'bundles' | 'content' | 'reviews';
  format?: 'json' | 'csv';
  label?: string;
  className?: string;
}

export function ExportReportButton({ 
  type, 
  format = 'json', 
  label,
  className 
}: ExportReportButtonProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const { exportReport } = await import('@/lib/api/content');
      const result: ExportResult = await exportReport({ type, format });
      
      // Decode base64 and trigger download
      const decodedData = atob(result.data);
      const blob = new Blob([decodedData], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export report:', err);
      setError(t('reports.exportError') || 'Không thể xuất báo cáo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={cn(className)}
    >
      {isExporting ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('reports.exporting') || 'Đang xuất...'}
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {label || t('reports.export') || 'Xuất báo cáo'}
        </>
      )}
    </Button>
  );
}
