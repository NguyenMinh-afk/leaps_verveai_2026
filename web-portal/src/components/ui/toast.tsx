// ============================================
// VERVE AI - Toast/Notification System
// ============================================

'use client'

import * as React from 'react'

/**
 * Toast types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast interface
 */
export interface Toast {
  id: string
  type: ToastType
  title: string
  titleVi?: string
  message?: string
  messageVi?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Toast context state
 */
interface ToastContextState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  success: (title: string, message?: string, titleVi?: string, messageVi?: string) => void
  error: (title: string, message?: string, titleVi?: string, messageVi?: string) => void
  warning: (title: string, message?: string, titleVi?: string, messageVi?: string) => void
  info: (title: string, message?: string, titleVi?: string, messageVi?: string) => void
}

/**
 * Toast context
 */
const ToastContext = React.createContext<ToastContextState | undefined>(undefined)

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: React.ReactNode
  defaultDuration?: number
}

/**
 * Toast Provider
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  /**
   * Add a toast
   */
  const addToast = React.useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, toast.duration || defaultDuration)
    }

    return id
  }, [defaultDuration])

  /**
   * Remove a toast
   */
  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  /**
   * Convenience methods
   */
  const success = React.useCallback((title: string, message?: string, titleVi?: string, messageVi?: string) => {
    addToast({ type: 'success', title, titleVi, message, messageVi })
  }, [addToast])

  const error = React.useCallback((title: string, message?: string, titleVi?: string, messageVi?: string) => {
    addToast({ type: 'error', title, titleVi, message, messageVi, duration: 8000 })
  }, [addToast])

  const warning = React.useCallback((title: string, message?: string, titleVi?: string, messageVi?: string) => {
    addToast({ type: 'warning', title, titleVi, message, messageVi })
  }, [addToast])

  const info = React.useCallback((title: string, message?: string, titleVi?: string, messageVi?: string) => {
    addToast({ type: 'info', title, titleVi, message, messageVi })
  }, [addToast])

  const value = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }), [toasts, addToast, removeToast, clearToasts, success, error, warning, info])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * Use Toast hook
 */
export const useToast = (): ToastContextState => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Toast Container Component
 */
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  )
}

/**
 * Toast Item Component
 */
interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const typeConfig = {
    success: {
      bg: 'bg-success-50 dark:bg-success-900/30 border-success-200 dark:border-success-800',
      icon: (
        <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800',
      icon: (
        <svg className="h-5 w-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800',
      icon: (
        <svg className="h-5 w-5 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-info-50 dark:bg-info-900/30 border-info-200 dark:border-info-800',
      icon: (
        <svg className="h-5 w-5 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const config = typeConfig[toast.type]

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right ${config.bg}`}
      role="alert"
    >
      <div className="shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {toast.titleVi || toast.title}
        </p>
        {(toast.message || toast.messageVi) && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {toast.messageVi || toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/**
 * Confirmation Dialog
 */
interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  titleVi?: string
  message: string
  messageVi?: string
  confirmLabel?: string
  confirmLabelVi?: string
  cancelLabel?: string
  cancelLabelVi?: string
  variant?: 'danger' | 'warning' | 'default'
  isLoading?: boolean
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  titleVi,
  message,
  messageVi,
  confirmLabel = 'Confirm',
  confirmLabelVi = 'Xác nhận',
  cancelLabel = 'Cancel',
  cancelLabelVi = 'Hủy',
  variant = 'default',
  isLoading = false,
}) => {
  if (!isOpen) return null

  const confirmButtonClass = variant === 'danger'
    ? 'bg-error-600 hover:bg-error-700 text-white'
    : variant === 'warning'
    ? 'bg-warning-600 hover:bg-warning-700 text-white'
    : 'bg-verve-600 hover:bg-verve-700 text-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {titleVi || title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {messageVi || message}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {cancelLabelVi || cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isLoading ? '...' : (confirmLabelVi || confirmLabel)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default {
  ToastProvider,
  useToast,
  ConfirmationDialog,
}
