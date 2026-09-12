'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge variants based on VERVE Design System
 * Brand-aligned: Crimson primary, Orange accent, Amber highlight
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150',
  {
    variants: {
      variant: {
        // Default - Neutral
        default:
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        // Primary - Crimson/Magenta
        primary:
          'bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-300',
        // Secondary - Orange
        secondary:
          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        // Success - Forest Green (mastery/success - MUST stay green)
        success:
          'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
        // Warning - Amber
        warning:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        // Error - Clear Red
        error:
          'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
        // Info - Teal (informational - MUST stay teal)
        info:
          'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
        // Outline - Border only
        outline:
          'border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300',
        // Mastery - Mastered (green - semantic)
        masteryMastered:
          'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
        // Mastery - Learning (amber - semantic)
        masteryLearning:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        // Mastery - Needs Support (red - semantic)
        masteryNeedsSupport:
          'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
        // Mastery - Unknown (gray)
        masteryUnknown:
          'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        // Severity - High (red - semantic)
        severityHigh:
          'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
        // Severity - Medium (amber - semantic)
        severityMedium:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        // Severity - Low (teal - semantic)
        severityLow:
          'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
      },
      size: {
        sm: 'px-2 py-px text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn('h-1.5 w-1.5 rounded-full', {
              'bg-slate-500 dark:bg-slate-400': variant === 'default',
              'bg-verve-500 dark:bg-verve-400': variant === 'primary',
              'bg-orange-500 dark:bg-orange-400': variant === 'secondary',
              'bg-success-600 dark:bg-success-400': variant === 'success',
              'bg-amber-500 dark:bg-amber-400': variant === 'warning',
              'bg-error-500 dark:bg-error-400': variant === 'error',
              'bg-info-600 dark:bg-info-400': variant === 'info',
            })}
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

/**
 * Badge with dot indicator
 */
const StatusBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, 'dot'> & {
    status: 'online' | 'offline' | 'pending' | 'synced' | 'conflict'
  }
>(({ className, status, ...props }, ref) => {
  const statusConfig = {
    online: { variant: 'success' as const, label: 'Online', dot: true },
    offline: { variant: 'error' as const, label: 'Offline', dot: true },
    pending: { variant: 'warning' as const, label: 'Pending', dot: true },
    synced: { variant: 'info' as const, label: 'Synced', dot: true },
    conflict: { variant: 'error' as const, label: 'Conflict', dot: true },
  }

  const config = statusConfig[status]

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      dot
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
})
StatusBadge.displayName = 'StatusBadge'

export { Badge, StatusBadge, badgeVariants }
