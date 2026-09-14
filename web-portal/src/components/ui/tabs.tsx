'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Tabs context for state management
 */
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  variant: 'default' | 'pills' | 'underline'
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

/**
 * Tabs Root
 */
export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const tabsVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      pills: '',
      underline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'default', defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const currentValue = value ?? internalValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [value, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, variant: variant! }}>
        <div ref={ref} className={cn(tabsVariants({ variant }), className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

/**
 * Tabs List
 */
const tabsListVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: 'gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800',
      pills: 'flex flex-wrap gap-2',
      underline: 'gap-0 border-b border-slate-200 dark:border-slate-700',
    },
  },
})

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pills' | 'underline'
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant, children, ...props }, ref) => {
    const { variant: contextVariant } = useTabsContext()
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListVariants({ variant: variant || contextVariant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsList.displayName = 'TabsList'

/**
 * Tabs Trigger
 */
const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verve-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
          'data-[state=active]:bg-white data-[state=active]:text-verve-700 data-[state=active]:shadow-sm',
          'dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-verve-300',
        ],
        pills: [
          'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
          'data-[state=active]:bg-verve-600 data-[state=active]:text-white',
        ],
        underline: [
          'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
          'data-[state=active]:border-b-2 data-[state=active]:border-verve-600 data-[state=active]:text-verve-700 dark:data-[state=active]:border-verve-400 dark:data-[state=active]:text-verve-300',
          'rounded-none border-b-2 border-transparent -mb-px',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  value: string
  icon?: React.ReactNode
  badge?: string | number
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant, value, icon, badge, children, disabled, ...props }, ref) => {
    const { value: currentValue, onValueChange, variant: contextVariant } = useTabsContext()
    const isActive = currentValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        disabled={disabled}
        className={cn(
          tabsTriggerVariants({ variant: variant || contextVariant }),
          isActive && 'font-semibold',
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {badge !== undefined && (
          <span
            className={cn(
              'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
              isActive
                ? 'bg-verve-100 text-verve-700 dark:bg-verve-900/50 dark:text-verve-300'
                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            )}
          >
            {badge}
          </span>
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

/**
 * Tabs Content
 */
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: currentValue } = useTabsContext()
    const isActive = currentValue === value

    if (!isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(
          'mt-2 animate-in fade-in-0 duration-200',
          isActive && 'animate-in fade-in-0 slide-in-from-top-1 duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsVariants, tabsTriggerVariants }
