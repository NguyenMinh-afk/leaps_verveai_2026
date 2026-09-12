'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from './button'
import { Badge } from './badge'
import { Avatar, AvatarGroup } from './avatar'
import type { SeverityLevel, InterventionGroup } from '@/types'

/**
 * Severity Colors
 */
const severityColors = {
  high: {
    bg: 'bg-error-50 dark:bg-error-900/20',
    border: 'border-l-4 border-l-error-500',
    text: 'text-error-700 dark:text-error-300',
    badge: 'error' as const,
    icon: '#DC2626',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-l-4 border-l-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'warning' as const,
    icon: '#D97706',
  },
  low: {
    bg: 'bg-info-50 dark:bg-info-900/20',      // Teal for low severity (informational)
    border: 'border-l-4 border-l-info-600',
    text: 'text-info-700 dark:text-info-300',
    badge: 'info' as const,
    icon: '#0D6B6E',
  },
}

/**
 * Severity Labels
 */
const severityLabels: Record<SeverityLevel, string> = {
  high: 'Nghiêm trọng',
  medium: 'Trung bình',
  low: 'Nhẹ',
}

/**
 * Intervention Status Config
 */
const statusConfig = {
  pending: {
    label: 'Chờ xử lý',
    badge: 'warning' as const,
  },
  'in-progress': {
    label: 'Đang xử lý',
    badge: 'info' as const,
  },
  resolved: {
    label: 'Đã giải quyết',
    badge: 'success' as const,
  },
}

/**
 * Intervention Card - Main card component
 */
export interface InterventionCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof interventionCardVariants> {
  intervention: InterventionGroup
  className?: string
  onViewDetails?: () => void
  onAssign?: () => void
  onResolve?: () => void
}

const interventionCardVariants = cva('rounded-lg bg-card shadow-sm transition-shadow', {
  variants: {
    severity: {
      high: 'border border-error-200 dark:border-error-800 hover:shadow-md',
      medium: 'border border-amber-200 dark:border-amber-800 hover:shadow-md',
      low: 'border border-info-200 dark:border-info-800 hover:shadow-md',
    },
  },
  defaultVariants: {
    severity: 'medium',
  },
})

const InterventionCard = React.forwardRef<HTMLDivElement, InterventionCardProps>(
  (
    {
      className,
      severity,
      intervention,
      onViewDetails,
      onAssign,
      onResolve,
      ...props
    },
    ref
  ) => {
    const { t } = useLanguage()
    const colors = severityColors[intervention.severity]
    const status = statusConfig[intervention.status]

    const formatDate = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }

    return (
      <div
        ref={ref}
        className={cn(
          interventionCardVariants({ severity: intervention.severity }),
          'overflow-hidden',
          className
        )}
        {...props}
      >
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
              {severityLabels[intervention.severity]}
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
            <Badge variant="outline" size="sm">
              {status.label}
            </Badge>
          </div>

          {/* Skills */}
          {intervention.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {intervention.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  {skill}
                </span>
              ))}
              {intervention.skills.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-500">
                  +{intervention.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Date */}
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            {t('diagnosis.detected') || 'Phát hiện'}: {formatDate(intervention.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDetails}
            className="flex-1"
          >
            {t('interventions.viewDetails')}
          </Button>
          {intervention.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAssign}
              className="flex-1"
            >
              {t('interventions.process') || 'Xử lý'}
            </Button>
          )}
          {intervention.status === 'in-progress' && (
            <Button
              variant="success"
              size="sm"
              onClick={onResolve}
              className="flex-1"
            >
              {t('interventions.complete') || 'Hoàn tất'}
            </Button>
          )}
        </div>
      </div>
    )
  }
)
InterventionCard.displayName = 'InterventionCard'

/**
 * Intervention Card Compact - Compact version for lists
 */
export interface InterventionCardCompactProps
  extends React.HTMLAttributes<HTMLDivElement> {
  intervention: InterventionGroup
  onClick?: () => void
}

const InterventionCardCompact = React.forwardRef<HTMLDivElement, InterventionCardCompactProps>(
  ({ className, intervention, onClick, ...props }, ref) => {
    const { t } = useLanguage()

    const severityColors = {
      high: '#ef4444', // error-500
      medium: '#f59e0b', // amber-500
      low: '#3b82f6', // info-500
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:bg-slate-50 hover:shadow-sm dark:hover:bg-slate-800/50',
          intervention.severity === 'high' && 'border-error-200 dark:border-error-800',
          intervention.severity === 'medium' && 'border-amber-200 dark:border-amber-800',
          intervention.severity === 'low' && 'border-info-200 dark:border-info-800',
          className
        )}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {/* Severity indicator */}
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: severityColors[intervention.severity] }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {intervention.rootCauseVi || intervention.rootCause}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {intervention.size} {t('interventions.students') || 'học sinh'}
          </p>
        </div>

        {/* Status badge */}
        <Badge
          variant={
            intervention.status === 'resolved'
              ? 'success'
              : intervention.status === 'in-progress'
                ? 'info'
                : 'warning'
          }
          size="sm"
        >
          {statusConfig[intervention.status].label}
        </Badge>

        {/* Arrow */}
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }
)
InterventionCardCompact.displayName = 'InterventionCardCompact'

/**
 * Intervention Card Group - Group of intervention cards
 */
export interface InterventionCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  titleVi?: string
  interventions: InterventionGroup[]
  onViewDetails?: (intervention: InterventionGroup) => void
  onAssign?: (intervention: InterventionGroup) => void
  onResolve?: (intervention: InterventionGroup) => void
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
}

const InterventionCardGroup = React.forwardRef<HTMLDivElement, InterventionCardGroupProps>(
  (
    {
      className,
      title,
      titleVi,
      interventions,
      onViewDetails,
      onAssign,
      onResolve,
      maxItems,
      showViewAll = true,
      onViewAll,
      ...props
    },
    ref
  ) => {
    const { t } = useLanguage()
    const displayInterventions = maxItems
      ? interventions.slice(0, maxItems)
      : interventions

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {(title || titleVi) && (
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {titleVi || title}
            </h3>
            <Badge variant="default" size="sm">
              {interventions.length}
            </Badge>
          </div>
        )}

        <div className="space-y-3">
          {displayInterventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              onViewDetails={() => onViewDetails?.(intervention)}
              onAssign={() => onAssign?.(intervention)}
              onResolve={() => onResolve?.(intervention)}
            />
          ))}
        </div>

        {showViewAll && maxItems && interventions.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="w-full"
          >
            {t('interventions.viewAll') || 'Xem tất cả'} ({interventions.length})
          </Button>
        )}
      </div>
    )
  }
)
InterventionCardGroup.displayName = 'InterventionCardGroup'

/**
 * Intervention Summary - Summary stats for dashboard
 */
export interface InterventionSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: {
    total: number
    pending: number
    inProgress: number
    resolved: number
  }
}

const InterventionSummary = React.forwardRef<HTMLDivElement, InterventionSummaryProps>(
  ({ className, stats, ...props }, ref) => {
    const { t } = useLanguage()
    const items = [
      {
        label: t('interventions.total') || 'Tổng cộng',
        value: stats.total,
        color: 'text-slate-700 dark:text-slate-300',
        bg: 'bg-slate-100 dark:bg-slate-800',
      },
      {
        label: t('interventions.pending'),
        value: stats.pending,
        color: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
      },
      {
        label: t('interventions.inProgress') || 'Đang xử lý',
        value: stats.inProgress,
        color: 'text-info-700 dark:text-info-300',
        bg: 'bg-info-100 dark:bg-info-900/30',
      },
      {
        label: t('interventions.resolved'),
        value: stats.resolved,
        color: 'text-success-700 dark:text-success-300',
        bg: 'bg-success-100 dark:bg-success-900/30',
      },
    ]

    return (
      <div
        ref={ref}
        className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}
        {...props}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={cn('rounded-lg p-3', item.bg)}
          >
            <p className="text-2xl font-bold" style={{ color: 'inherit' }}>
              {item.value}
            </p>
            <p className={cn('text-xs font-medium', item.color)}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    )
  }
)
InterventionSummary.displayName = 'InterventionSummary'

/**
 * Intervention Filter - Filter controls for interventions
 */
export interface InterventionFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: SeverityLevel | 'all'
  status?: 'pending' | 'in-progress' | 'resolved' | 'all'
  onSeverityChange?: (severity: SeverityLevel | 'all') => void
  onStatusChange?: (status: 'pending' | 'in-progress' | 'resolved' | 'all') => void
}

const InterventionFilter = React.forwardRef<HTMLDivElement, InterventionFilterProps>(
  (
    { className, severity = 'all', status = 'all', onSeverityChange, onStatusChange, ...props },
    ref
  ) => {
    const { t } = useLanguage()
    const severityOptions: Array<{ value: SeverityLevel | 'all'; label: string }> = [
      { value: 'all', label: t('common.all') },
      { value: 'high', label: t('interventions.highSeverity') || 'Nghiêm trọng' },
      { value: 'medium', label: t('interventions.mediumSeverity') || 'Trung bình' },
      { value: 'low', label: t('interventions.lowSeverity') || 'Nhẹ' },
    ]

    const statusOptions: Array<{ value: 'pending' | 'in-progress' | 'resolved' | 'all'; label: string }> = [
      { value: 'all', label: t('common.all') },
      { value: 'pending', label: t('interventions.pending') },
      { value: 'in-progress', label: t('interventions.inProgress') || 'Đang xử lý' },
      { value: 'resolved', label: t('interventions.resolved') },
    ]

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center gap-3', className)}
        {...props}
      >
        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('interventions.severity') || 'Mức độ'}:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {severityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSeverityChange?.(option.value)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  severity === option.value
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('interventions.status')}:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusChange?.(option.value)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  status === option.value
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
InterventionFilter.displayName = 'InterventionFilter'

export {
  InterventionCard,
  InterventionCardCompact,
  InterventionCardGroup,
  InterventionSummary,
  InterventionFilter,
  severityColors,
  severityLabels,
  statusConfig,
}
