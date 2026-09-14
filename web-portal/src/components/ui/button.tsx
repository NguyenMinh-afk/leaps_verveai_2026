'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button variants based on VERVE Design System
 * Brand-aligned: Crimson primary, Orange accent, Amber highlight
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - Crimson/Magenta (brand primary)
        primary:
          'bg-verve-500 text-white hover:bg-verve-600 focus-visible:ring-verve-500 active:bg-verve-700',
        // Secondary - Warm Orange (brand accent)
        secondary:
          'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500 active:bg-orange-700',
        // Success - Forest Green (positive outcomes)
        success:
          'bg-success-700 text-white hover:bg-success-600 focus-visible:ring-success-700 active:bg-success-800',
        // Warning - Amber (attention)
        warning:
          'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 active:bg-amber-700',
        // Error - Clear Red (destructive)
        destructive:
          'bg-error-600 text-white hover:bg-error-500 focus-visible:ring-error-600 active:bg-error-700',
        // Info - Teal (informational)
        info:
          'bg-info-700 text-white hover:bg-info-600 focus-visible:ring-info-700 active:bg-info-800',
        // Outline - Transparent with crimson border
        outline:
          'border-2 border-verve-500 text-verve-500 hover:bg-verve-50 focus-visible:ring-verve-500 active:bg-verve-100 dark:hover:bg-verve-900/20',
        // Ghost - Transparent, hover shows subtle background
        ghost:
          'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700',
        // Link - Text only with underline on hover
        link:
          'text-verve-500 underline-offset-4 hover:underline focus-visible:ring-verve-500',
      },
      size: {
        // Extra small
        xs: 'h-7 rounded-md px-2 text-xs',
        // Small
        sm: 'h-9 rounded-md px-3 text-sm',
        // Default (Medium)
        md: 'h-10 rounded-md px-4 text-sm',
        // Large
        lg: 'h-12 rounded-md px-8 text-base',
        // Icon only (square)
        icon: 'h-10 w-10 rounded-md',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
