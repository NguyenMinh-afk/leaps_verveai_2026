'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Progress bar variants
 */
const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

/**
 * Progress indicator variants (the colored bar)
 */
const indicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-verve-500 dark:bg-verve-400',  // Crimson brand primary
        success: 'bg-success-600 dark:bg-success-500',
        warning: 'bg-amber-500 dark:bg-amber-400',
        error: 'bg-error-600 dark:bg-error-500',
        info: 'bg-info-700 dark:bg-info-600',        // Teal info
        mastery: 'bg-gradient-to-r from-success-600 via-amber-500 to-success-600',
      },
      animated: {
        true: 'animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  showValue?: boolean
  label?: string
  labelVi?: string
  indicatorVariant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'mastery'
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      variant,
      size,
      value = 0,
      max = 100,
      showValue = false,
      label,
      labelVi,
      indicatorVariant,
      animated = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    // Auto-determine variant based on percentage if not specified
    const getAutoVariant = () => {
      if (percentage >= 80) return 'success'
      if (percentage >= 50) return 'warning'
      if (percentage >= 25) return 'info'
      return 'error'
    }

    const finalIndicatorVariant = indicatorVariant || (variant === 'default' ? getAutoVariant() : variant)

    return (
      <div className="w-full space-y-1.5" ref={ref} {...props}>
        {(label || labelVi || showValue) && (
          <div className="flex items-center justify-between text-sm">
            {label && (
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {labelVi || label}
              </span>
            )}
            {showValue && (
              <span className="text-slate-500 dark:text-slate-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className={cn(progressVariants({ variant, size }), className)}>
          <div
            className={cn(
              indicatorVariants({ variant: finalIndicatorVariant, animated }),
              !animated && 'transition-all duration-300'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'

/**
 * Mastery Ring - Circular progress indicator for pKnown
 */
export interface MasteryRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 1
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  showValue?: boolean
  label?: string
  labelVi?: string
}

const MasteryRing = React.forwardRef<HTMLDivElement, MasteryRingProps>(
  (
    {
      className,
      value,
      size = 'md',
      strokeWidth,
      showValue = true,
      label,
      labelVi,
      ...props
    },
    ref
  ) => {
    const sizeConfig = {
      sm: { outer: 48, inner: 40, stroke: 4, text: 'text-xs' },
      md: { outer: 64, inner: 52, stroke: 6, text: 'text-sm' },
      lg: { outer: 96, inner: 80, stroke: 8, text: 'text-lg' },
      xl: { outer: 128, inner: 108, stroke: 10, text: 'text-2xl' },
    }

    const config = sizeConfig[size]
    const customStroke = strokeWidth || config.stroke

    const radius = (config.outer - customStroke) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value * circumference) / 1

    // Get color based on mastery level
    const getColor = () => {
      if (value >= 0.8) return { stroke: '#059669', text: 'text-success-600' }  // Green - mastery
      if (value >= 0.4) return { stroke: '#F59E0B', text: 'text-amber-600' }    // Amber - learning
      if (value > 0) return { stroke: '#DC2626', text: 'text-error-600' }     // Red - needs support
      return { stroke: '#64748B', text: 'text-slate-500' }                       // Gray - unknown
    }

    const colors = getColor()

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-1', className)}
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
              stroke={colors.stroke}
              strokeWidth={customStroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('font-semibold', colors.text, config.text)}>
                {Math.round(value * 100)}%
              </span>
            </div>
          )}
        </div>
        {(label || labelVi) && (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {labelVi || label}
          </span>
        )}
      </div>
    )
  }
)
MasteryRing.displayName = 'MasteryRing'

/**
 * Step Progress - For multi-step processes
 */
export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[]
  currentStep: number
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, steps, currentStep, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    isCompleted && 'bg-success-600 text-white',
                    isCurrent && 'bg-verve-500 text-white',  // Crimson brand primary
                    !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-slate-900 dark:text-slate-100',
                    !isCurrent && 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-12 flex-1',
                    isCompleted ? 'bg-success-600' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)
StepProgress.displayName = 'StepProgress'

export { Progress, MasteryRing, StepProgress, progressVariants, indicatorVariants }
