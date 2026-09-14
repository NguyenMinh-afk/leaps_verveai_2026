'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getMasteryLevel, formatPercent } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'

/**
 * Mastery Level Colors
 */
const masteryColors = {
  mastered: {
    bg: 'bg-success-100 dark:bg-success-900/30',
    text: 'text-success-700 dark:text-success-300',
    border: 'border-success-300 dark:border-success-700',
    ring: 'ring-success-500/20',
    progress: 'bg-success-600 dark:bg-success-500',
    icon: '#059669',
  },
  learning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    ring: 'ring-amber-500/20',
    progress: 'bg-amber-500 dark:bg-amber-400',
    icon: '#D97706',
  },
  'needs-support': {
    bg: 'bg-error-100 dark:bg-error-900/30',
    text: 'text-error-700 dark:text-error-300',
    border: 'border-error-300 dark:border-error-700',
    ring: 'ring-error-500/20',
    progress: 'bg-error-500 dark:bg-error-400',
    icon: '#DC2626',
  },
  unknown: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-500 dark:text-slate-400',
    border: 'border-slate-300 dark:border-slate-600',
    ring: 'ring-slate-500/20',
    progress: 'bg-slate-400 dark:bg-slate-500',
    icon: '#64748B',
  },
}

/**
 * Mastery level labels (Vietnamese)
 */
const masteryLabels = {
  mastered: 'Đã thành thạo',
  learning: 'Đang học',
  'needs-support': 'Cần hỗ trợ',
  unknown: 'Chưa xác định',
}

/**
 * Mastery level short labels
 */
const masteryLabelsShort = {
  mastered: 'Thành thạo',
  learning: 'Học',
  'needs-support': 'Cần hỗ trợ',
  unknown: '?',
}

/**
 * Mastery Bar - Simple progress bar showing mastery level
 */
export interface MasteryBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof masteryBarVariants> {
  pKnown: number // 0 to 1
  showLabel?: boolean
  showPercentage?: boolean
}

const masteryBarVariants = cva('w-full', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const MasteryBar = React.forwardRef<HTMLDivElement, MasteryBarProps>(
  ({ className, size = 'md', pKnown, showLabel, showPercentage, ...props }, ref) => {
    const masteryLevel = getMasteryLevel(pKnown)
    const colors = masteryColors[masteryLevel]
    const percentage = Math.round(pKnown * 100)

    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        <div className="flex items-center justify-between">
          {showLabel && (
            <span className={cn('text-sm font-medium', colors.text)}>
              {masteryLabelsShort[masteryLevel]}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {percentage}%
            </span>
          )}
        </div>
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700',
            masteryBarVariants({ size })
          )}
        >
          <div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', colors.progress)}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    )
  }
)
MasteryBar.displayName = 'MasteryBar'

/**
 * Mastery Badge - Compact badge showing mastery status
 */
export interface MasteryBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  pKnown: number
  size?: 'sm' | 'md' | 'lg'
}

const MasteryBadge = React.forwardRef<HTMLSpanElement, MasteryBadgeProps>(
  ({ className, pKnown, size = 'md', ...props }, ref) => {
    const masteryLevel = getMasteryLevel(pKnown)
    const colors = masteryColors[masteryLevel]
    const percentage = Math.round(pKnown * 100)

    const sizeClasses = {
      sm: 'px-1.5 py-0.5 text-[10px]',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          colors.bg,
          colors.text,
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: colors.icon }}
        />
        {percentage}%
      </span>
    )
  }
)
MasteryBadge.displayName = 'MasteryBadge'

/**
 * Mastery Ring Indicator - Circular progress indicator for mastery visualization
 */
export interface MasteryRingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  pKnown: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  showLabel?: boolean
  showPercentage?: boolean
}

const MasteryRingIndicator = React.forwardRef<HTMLDivElement, MasteryRingIndicatorProps>(
  (
    {
      className,
      pKnown,
      size = 'md',
      strokeWidth,
      showLabel = true,
      showPercentage = true,
      ...props
    },
    ref
  ) => {
    const masteryLevel = getMasteryLevel(pKnown)
    const colors = masteryColors[masteryLevel]
    const percentage = Math.round(pKnown * 100)

    const sizeConfig = {
      sm: { outer: 40, inner: 32, stroke: 4, text: 'text-[10px]' },
      md: { outer: 56, inner: 46, stroke: 5, text: 'text-xs' },
      lg: { outer: 80, inner: 68, stroke: 6, text: 'text-sm' },
      xl: { outer: 112, inner: 96, stroke: 8, text: 'text-xl' },
    }

    const config = sizeConfig[size]
    const customStroke = strokeWidth || config.stroke

    const radius = (config.outer - customStroke) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (pKnown * circumference)

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-1.5', className)}
        {...props}
      >
        <div className="relative" style={{ width: config.outer, height: config.outer }}>
          <svg
            className="transform -rotate-90"
            width={config.outer}
            height={config.outer}
          >
            {/* Background circle */}
            <circle
              cx={config.outer / 2}
              cy={config.outer / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={customStroke}
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx={config.outer / 2}
              cy={config.outer / 2}
              r={radius}
              stroke={colors.icon}
              strokeWidth={customStroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('font-bold', colors.text, config.text)}>
                {percentage}%
              </span>
            </div>
          )}
        </div>
        {showLabel && (
          <span className={cn('text-xs font-medium', colors.text)}>
            {masteryLabels[masteryLevel]}
          </span>
        )}
      </div>
    )
  }
)
MasteryRingIndicator.displayName = 'MasteryRingIndicator'

/**
 * Mastery Card - Card showing mastery details
 */
export interface MasteryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  skillName: string
  skillNameVi?: string
  pKnown: number
  studentName?: string
  studentNameVi?: string
  lastActivity?: Date | string
  trend?: 'up' | 'down' | 'stable'
}

const MasteryCard = React.forwardRef<HTMLDivElement, MasteryCardProps>(
  (
    {
      className,
      skillName,
      skillNameVi,
      pKnown,
      studentName,
      studentNameVi,
      lastActivity,
      trend,
      ...props
    },
    ref
  ) => {
    const { t } = useLanguage()
    const masteryLevel = getMasteryLevel(pKnown)
    const colors = masteryColors[masteryLevel]
    const percentage = Math.round(pKnown * 100)

    const trendIcons = {
      up: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      down: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      stable: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      ),
    }

    const trendColors = {
      up: 'text-success-600 dark:text-success-400',
      down: 'text-error-600 dark:text-error-400',
      stable: 'text-slate-500 dark:text-slate-400',
    }

    const getTrendTitle = (trend: 'up' | 'down' | 'stable') => {
      if (trend === 'up') return t('mastery.trendUp') || 'Tăng';
      if (trend === 'down') return t('mastery.trendDown') || 'Giảm';
      return t('mastery.trendStable') || 'Ổn định';
    };

    const formatLastActivity = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffHour = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDay = Math.floor(diffHour / 24)

      if (diffHour < 1) return t('mastery.justNow') || 'Vừa xong'
      if (diffHour < 24) return `${diffHour} ${t('mastery.hoursAgo') || 'giờ trước'}`
      if (diffDay < 7) return `${diffDay} ${t('mastery.daysAgo') || 'ngày trước'}`
      return d.toLocaleDateString('vi-VN')
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
          colors.border,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {skillNameVi || skillName}
            </h4>
            {studentName && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {studentNameVi || studentName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {trend && (
              <span className={cn(trendColors[trend])} title={getTrendTitle(trend)}>
                {trendIcons[trend]}
              </span>
            )}
            <MasteryBadge pKnown={pKnown} size="md" />
          </div>
        </div>

        <div className="mt-3">
          <MasteryBar pKnown={pKnown} size="sm" />
        </div>

        {lastActivity && (
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {t('mastery.lastActivity') || 'Hoạt động cuối'}: {formatLastActivity(lastActivity)}
          </p>
        )}
      </div>
    )
  }
)
MasteryCard.displayName = 'MasteryCard'

/**
 * Mastery Grid - Grid of mastery indicators
 */
export interface MasteryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    id: string
    skillName: string
    skillNameVi?: string
    pKnown: number
  }>
  columns?: 2 | 3 | 4
}

const MasteryGrid = React.forwardRef<HTMLDivElement, MasteryGridProps>(
  ({ className, items, columns = 3, ...props }, ref) => {
    const gridCols = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }

    return (
      <div
        ref={ref}
        className={cn('grid gap-4', gridCols[columns], className)}
        {...props}
      >
        {items.map((item) => (
          <MasteryCard
            key={item.id}
            skillName={item.skillName}
            skillNameVi={item.skillNameVi}
            pKnown={item.pKnown}
          />
        ))}
      </div>
    )
  }
)
MasteryGrid.displayName = 'MasteryGrid'

/**
 * Mastery Legend - Legend showing what each mastery level means
 */
export interface MasteryLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  showDescriptions?: boolean
}

const MasteryLegend = React.forwardRef<HTMLDivElement, MasteryLegendProps>(
  ({ className, showDescriptions = true, ...props }, ref) => {
    const { t } = useLanguage()
    const levels = [
      { level: 'mastered' as const, threshold: '≥ 80%' },
      { level: 'learning' as const, threshold: '40% - 79%' },
      { level: 'needs-support' as const, threshold: '1% - 39%' },
      { level: 'unknown' as const, threshold: t('mastery.noData') || 'Không có dữ liệu' },
    ]

    const descriptions = {
      mastered: t('mastery.masteredDesc') || 'Học sinh đã thể hiện sự thành thạo vững chắc và có thể áp dụng kiến thức này một cách nhất quán.',
      learning: t('mastery.learningDesc') || 'Học sinh đang tiến bộ nhưng cần thêm thực hành để đạt được sự thành thạo đầy đủ.',
      'needs-support': t('mastery.needsSupportDesc') || 'Học sinh gặp khó khăn với kỹ năng này và cần sự hỗ trợ bổ sung từ giáo viên.',
      unknown: t('mastery.unknownDesc') || 'Chưa có đủ dữ liệu để xác định mức độ thành thạo của học sinh.',
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t('mastery.legendTitle') || 'Chú thích mức độ thành thạo'}
        </h4>
        <div className="space-y-2">
          {levels.map(({ level, threshold }) => {
            const colors = masteryColors[level]
            return (
              <div key={level} className="flex items-start gap-3">
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: colors.icon }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-medium', colors.text)}>
                      {masteryLabels[level]}
                    </span>
                    <span className="text-xs text-slate-400">({threshold})</span>
                  </div>
                  {showDescriptions && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {descriptions[level]}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
MasteryLegend.displayName = 'MasteryLegend'

export {
  MasteryBar,
  MasteryBadge,
  MasteryRingIndicator,
  MasteryCard,
  MasteryGrid,
  MasteryLegend,
  masteryColors,
  masteryLabels,
  masteryLabelsShort,
}
