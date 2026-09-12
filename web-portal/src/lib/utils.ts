import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for merging Tailwind classes with proper conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as percentage (0-100)
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Get mastery level from pKnown value
 */
export function getMasteryLevel(pKnown: number): 'mastered' | 'learning' | 'needs-support' | 'unknown' {
  if (pKnown >= 0.8) return 'mastered'
  if (pKnown >= 0.4) return 'learning'
  if (pKnown > 0) return 'needs-support'
  return 'unknown'
}

/**
 * Get severity level from intervention data
 */
export function getSeverityLevel(
  studentCount: number,
  classSize: number,
  threshold = 0.3
): 'high' | 'medium' | 'low' {
  const ratio = studentCount / classSize
  if (ratio >= threshold) return 'high'
  if (ratio >= threshold / 2) return 'medium'
  return 'low'
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('vi-VN', options)
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  return formatDate(d)
}
