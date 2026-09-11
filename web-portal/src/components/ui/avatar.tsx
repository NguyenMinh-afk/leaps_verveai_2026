'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Avatar variants based on VERVE Design System
 */
const avatarVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-20 w-20 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  initials?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, initials, status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const displayInitials = initials || (fallback ? getInitials(fallback) : '?')

    const statusColors = {
      online: 'bg-success-500',
      offline: 'bg-slate-400',
      busy: 'bg-error-500',
      away: 'bg-warning-500',
    }

    const statusSizes = {
      xs: 'h-1.5 w-1.5 border',
      sm: 'h-2 w-2 border',
      md: 'h-2.5 w-2.5 border-2',
      lg: 'h-3 w-3 border-2',
      xl: 'h-3.5 w-3.5 border-2',
      '2xl': 'h-4 w-4 border-2',
    }

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div className={cn(avatarVariants({ size }))}>
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || fallback || 'Avatar'}
              className="aspect-square h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="font-medium">{displayInitials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-white dark:border-slate-900',
              statusColors[status],
              statusSizes[size || 'md']
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

/**
 * Avatar Group - Display multiple avatars in a stack
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  avatars: Array<{
    src?: string
    alt?: string
    fallback?: string
  }>
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = 'md', avatars, ...props }, ref) => {
    const displayedAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    const overlapClasses = {
      xs: '-ml-2',
      sm: '-ml-2.5',
      md: '-ml-3',
      lg: '-ml-4',
      xl: '-ml-5',
      '2xl': '-ml-6',
    }

    const sizeClasses = {
      xs: 'h-6 w-6 text-[10px]',
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
      '2xl': 'h-20 w-20 text-xl',
    }

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {displayedAvatars.map((avatar, index) => (
          <div
            key={index}
            className={cn(
              'relative rounded-full border-2 border-white dark:border-slate-900',
              index > 0 && overlapClasses[size],
              sizeClasses[size]
            )}
          >
            <Avatar
              src={avatar.src}
              alt={avatar.alt}
              fallback={avatar.fallback}
              size={size}
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              'border-2 border-white dark:border-slate-900',
              overlapClasses[size],
              sizeClasses[size]
            )}
          >
            <span className="text-xs font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup, avatarVariants }
