'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Tooltip component for showing additional information on hover/focus
 */
export interface TooltipProps {
  children: React.ReactNode
  content: string
  contentVi?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  disabled?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  contentVi,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setIsVisible(true), delayDuration)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const alignClasses = {
    start: '',
    center: '-translate-x-1/2 left-1/2',
    end: '-translate-x-full left-auto right-0',
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-slate-800',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            sideClasses[side],
            side === 'top' || side === 'bottom' ? alignClasses[align] : ''
          )}
        >
          {contentVi || content}
        </div>
      )}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'

/**
 * Tooltip with arrow props
 */
interface TooltipArrowProps extends Omit<TooltipProps, 'children'> {}

/**
 * Tooltip with arrow
 */
const TooltipArrow: React.FC<TooltipArrowProps> = ({ side = 'top', ...props }) => {
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent',
  }

  return (
    <Tooltip side={side} {...props}>
      <>
        <div
          className={cn(
            'absolute z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-slate-800',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
          style={{
            position: 'absolute',
            ...(side === 'top' && { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' }),
            ...(side === 'bottom' && { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }),
            ...(side === 'left' && { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' }),
            ...(side === 'right' && { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }),
          }}
        >
          {props.contentVi || props.content}
        </div>
        <div
          className={cn('absolute h-0 w-0 border-4', arrowClasses[side])}
          style={{
            ...(side === 'top' && { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }),
            ...(side === 'bottom' && { top: '-8px', left: '50%', transform: 'translateX(-50%)' }),
            ...(side === 'left' && { right: '-8px', top: '50%', transform: 'translateY(-50%)' }),
            ...(side === 'right' && { left: '-8px', top: '50%', transform: 'translateY(-50%)' }),
          }}
        />
      </>
    </Tooltip>
  )
}

TooltipArrow.displayName = 'TooltipArrow'

export { Tooltip, TooltipArrow }
