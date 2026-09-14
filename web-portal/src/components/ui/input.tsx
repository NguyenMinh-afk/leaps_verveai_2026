'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Input variants based on VERVE Design System
 */
const inputVariants = cva(
  'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-verve-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400',
  {
    variants: {
      variant: {
        // Default - Neutral border
        default: 'border-slate-300 focus:ring-verve-600 dark:border-slate-600',
        // Error - Red border
        error: 'border-error-500 focus:ring-error-500 dark:border-error-400',
        // Success - Green border
        success: 'border-success-500 focus:ring-success-500 dark:border-success-400',
        // Warning - Amber border
        warning: 'border-warning-500 focus:ring-warning-500 dark:border-warning-400',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-xs',
        md: 'h-10 px-3 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  labelVi?: string
  error?: string
  errorVi?: string
  hint?: string
  hintVi?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      size,
      label,
      labelVi,
      error,
      errorVi,
      hint,
      hintVi,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const hasError = Boolean(error || errorVi)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {labelVi || label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant: hasError ? 'error' : variant, size }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {errorVi || error}
          </p>
        )}
        {hint && !hasError && (
          <p id={`${inputId}-hint`} className="text-sm text-slate-500 dark:text-slate-400">
            {hintVi || hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

/**
 * Textarea component
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<VariantProps<typeof inputVariants>, 'size'> {
  label?: string
  labelVi?: string
  error?: string
  errorVi?: string
  hint?: string
  hintVi?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      label,
      labelVi,
      error,
      errorVi,
      hint,
      hintVi,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const hasError = Boolean(error || errorVi)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {labelVi || label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(
            inputVariants({ variant: hasError ? 'error' : variant }),
            'min-h-[80px] resize-y',
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />
        {hasError && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {errorVi || error}
          </p>
        )}
        {hint && !hasError && (
          <p
            id={`${textareaId}-hint`}
            className="text-sm text-slate-500 dark:text-slate-400"
          >
            {hintVi || hint}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

/**
 * Form Field wrapper
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  labelVi?: string
  error?: string
  errorVi?: string
  hint?: string
  hintVi?: string
  required?: boolean
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { className, label, labelVi, error, errorVi, hint, hintVi, required, children, ...props },
    ref
  ) => {
    const hasError = Boolean(error || errorVi)

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            {labelVi || label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}
        {children}
        {hasError && (
          <p className="text-sm text-error-600 dark:text-error-400" role="alert">
            {errorVi || error}
          </p>
        )}
        {hint && !hasError && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {hintVi || hint}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export { Input, Textarea, FormField, inputVariants }
