'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Select trigger variants
 */
const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-verve-600',
  {
    variants: {
      variant: {
        default: 'focus:ring-verve-600',
        error: 'border-error-500 focus:ring-error-500',
        success: 'border-success-500 focus:ring-success-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
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

export interface SelectOption {
  value: string
  label: string
  labelVi?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectTriggerVariants> {
  label?: string
  labelVi?: string
  options: SelectOption[]
  placeholder?: string
  placeholderVi?: string
  error?: string
  errorVi?: string
  hint?: string
  hintVi?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      label,
      labelVi,
      options,
      placeholder,
      placeholderVi,
      error,
      errorVi,
      hint,
      hintVi,
      disabled,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const selectId = id || generatedId
    const hasError = Boolean(error || errorVi)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {labelVi || label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              selectTriggerVariants({ variant: hasError ? 'error' : variant, size }),
              'appearance-none pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            value={value}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
            {...props}
          >
            {(placeholder || placeholderVi) && (
              <option value="" disabled>
                {placeholderVi || placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.labelVi || option.label}
              </option>
            ))}
          </select>
          {/* Dropdown icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {hasError && (
          <p
            id={`${selectId}-error`}
            className="text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {errorVi || error}
          </p>
        )}
        {hint && !hasError && (
          <p id={`${selectId}-hint`} className="text-sm text-slate-500 dark:text-slate-400">
            {hintVi || hint}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

/**
 * Combobox/Searchable Select (basic implementation)
 */
export interface ComboboxProps extends Omit<SelectProps, 'options'> {
  options: SelectOption[]
  searchable?: boolean
  onSearch?: (query: string) => void
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      options,
      searchable = false,
      onSearch,
      placeholder,
      placeholderVi,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    const filteredOptions = searchQuery
      ? options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (opt.labelVi && opt.labelVi.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : options

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string) => {
      const event = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange?.(event)
      setIsOpen(false)
      setSearchQuery('')
    }

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen && searchable) {
              setTimeout(() => inputRef.current?.focus(), 0)
            }
          }}
          className={cn(
            selectTriggerVariants({ size: 'md' }),
            'w-full justify-between text-left'
          )}
        >
          <span className={cn(!selectedOption && 'text-slate-400')}>
            {selectedOption?.labelVi ||
              selectedOption?.label ||
              placeholderVi ||
              placeholder ||
              'Select...'}
          </span>
          <svg
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="max-h-60 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {searchable && (
                <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      onSearch?.(e.target.value)
                    }}
                    placeholder="Search..."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              )}
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-500">No results found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                      'hover:bg-slate-100 dark:hover:bg-slate-800',
                      option.value === value && 'bg-verve-50 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300'
                    )}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span>{option.labelVi || option.label}</span>
                    {option.value === value && (
                      <svg
                        className="ml-auto h-4 w-4 text-verve-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Combobox.displayName = 'Combobox'

export { Select, Combobox, selectTriggerVariants }
