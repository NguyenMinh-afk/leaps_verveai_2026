'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Card variants based on VERVE Design System
 */
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-250',
  {
    variants: {
      variant: {
        // Default - Subtle shadow
        default: 'shadow-sm border-slate-200 dark:border-slate-700',
        // Elevated - More prominent shadow
        elevated: 'shadow-md border-slate-200 dark:border-slate-700',
        // Interactive - Hover effects
        interactive:
          'shadow-sm border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
        // Bordered - No shadow, just border
        bordered: 'border-slate-300 dark:border-slate-600',
        // Filled - Subtle background
        filled: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/**
 * Card Header
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * Card Title
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * Card Description
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * Card Content
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * Card Footer
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4 border-t border-slate-200 dark:border-slate-700',
      className
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

/**
 * Card Apex - For dashboard bento-style layouts
 */
const CardApex = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    span?: 1 | 2 | 3 | 4
  }
>(({ className, span = 1, ...props }, ref) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  }

  return (
    <Card
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        spanClasses[span],
        className
      )}
      {...props}
    />
  )
})
CardApex.displayName = 'CardApex'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardApex,
  cardVariants,
}
