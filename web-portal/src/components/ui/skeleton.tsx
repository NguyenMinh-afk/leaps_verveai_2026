'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Skeleton variants
 */
const skeletonVariants = cva(
  'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
  {
    variants: {
      variant: {
        default: '',
        rounded: 'rounded-full',
        glow: 'animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

/**
 * Base Skeleton component
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(skeletonVariants({ variant }), className)} {...props} />
  )
)
Skeleton.displayName = 'Skeleton'

/**
 * Text skeleton
 */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonProps & { lines?: number }>(
  ({ className, lines = 3, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = 'SkeletonText'

/**
 * Avatar skeleton
 */
const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonProps & { size?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    }

    return (
      <Skeleton
        ref={ref}
        variant="rounded"
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
SkeletonAvatar.displayName = 'SkeletonAvatar'

/**
 * Card skeleton for loading states
 */
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900',
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    )
  }
)
SkeletonCard.displayName = 'SkeletonCard'

/**
 * Table row skeleton
 */
const SkeletonTableRow = React.forwardRef<HTMLDivElement, SkeletonProps & { columns?: number }>(
  ({ className, columns = 4, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4 border-b border-slate-200 py-3 dark:border-slate-700', className)}
        {...props}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
    )
  }
)
SkeletonTableRow.displayName = 'SkeletonTableRow'

/**
 * Dashboard card skeleton (Bento style)
 */
const SkeletonBentoCard = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & { span?: 1 | 2; header?: boolean }
>(({ className, span = 1, header = true, ...props }, ref) => {
  const spanClasses = {
    1: '',
    2: 'col-span-2',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900',
        spanClasses[span],
        className
      )}
      {...props}
    >
      {header && (
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton variant="rounded" className="h-8 w-8" />
        </div>
      )}
      <div className="space-y-3">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
})
SkeletonBentoCard.displayName = 'SkeletonBentoCard'

/**
 * Stat card skeleton
 */
const SkeletonStat = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton variant="rounded" className="h-10 w-10" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }
)
SkeletonStat.displayName = 'SkeletonStat'

/**
 * Intervention card skeleton
 */
const SkeletonInterventionCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-l-4 border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900',
          'border-l-warning-500', // Simulating severity color
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="h-6 w-6" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="h-6 w-6" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    )
  }
)
SkeletonInterventionCard.displayName = 'SkeletonInterventionCard'

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonBentoCard,
  SkeletonStat,
  SkeletonInterventionCard,
  skeletonVariants,
}
