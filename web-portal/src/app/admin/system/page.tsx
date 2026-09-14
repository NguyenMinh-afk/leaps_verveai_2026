'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
} from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { SystemHealthStatus } from '@/types'
import { api } from '@/lib/api/apiClient'

// Backend health response type
interface BackendHealthResponse {
  service: string
  serviceVi: string
  status: 'healthy' | 'degraded' | 'offline' | 'unknown'
  message?: string
  uptime?: string
  timestamp: string
}

/**
 * Health Card Component
 */
interface HealthCardProps {
  health: SystemHealthStatus
}

const HealthCard: React.FC<HealthCardProps> = ({ health }) => {
  const { t } = useLanguage()
  const statusConfig = {
    healthy: {
      label: t('admin.healthy'),
      variant: 'success' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-success-100 dark:bg-success-900/30',
      textColor: 'text-success-600 dark:text-success-400',
    },
    degraded: {
      label: t('admin.degraded'),
      variant: 'warning' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    offline: {
      label: t('admin.offline'),
      variant: 'error' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      ),
      bgColor: 'bg-error-100 dark:bg-error-900/30',
      textColor: 'text-error-600 dark:text-error-400',
    },
    unknown: {
      label: t('admin.unknown'),
      variant: 'default' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
    },
  }

  const config = statusConfig[health.status]

  return (
    <Card variant="default" padding="lg" className={cn('border-l-4', 
      health.status === 'healthy' ? 'border-l-success-500' :
      health.status === 'degraded' ? 'border-l-amber-500' :
      health.status === 'offline' ? 'border-l-error-500' :
      'border-l-slate-500'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', config.bgColor, config.textColor)}>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {health.serviceVi}
            </h3>
            <Badge variant={config.variant} size="sm">
              {config.label}
            </Badge>
          </div>
          {health.message && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {health.messageVi || health.message}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            {health.uptime && (
              <span>Uptime: {health.uptime}</span>
            )}
            <span>{t('admin.lastCheck')}: {formatRelativeTime(new Date(health.lastCheck))}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * System Page
 */
export default function SystemPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [lastRefresh, setLastRefresh] = React.useState(new Date())
  const [healthStatuses, setHealthStatuses] = React.useState<SystemHealthStatus[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  // Fetch health status from real API
  const fetchHealthStatus = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const services: Array<BackendHealthResponse & { lastCheck: Date }> = []
      
      // Try to fetch health from various endpoints
      const healthEndpoints = [
        { path: '/api/auth/health', service: 'Gateway', serviceVi: 'Cổng API' },
        { path: '/api/health', service: 'Gateway', serviceVi: 'Cổng API' },
      ]
      
      for (const endpoint of healthEndpoints) {
        try {
          const response = await api.get<BackendHealthResponse>(endpoint.path)
          services.push({
            service: endpoint.service,
            serviceVi: endpoint.serviceVi,
            status: response.status || 'healthy',
            message: response.message,
            uptime: response.uptime,
            timestamp: response.timestamp || new Date().toISOString(),
            lastCheck: new Date(response.timestamp || Date.now()),
          })
          break // If we got a response, stop trying
        } catch {
          // Continue to next endpoint
        }
      }
      
      // Add placeholder entries for services we can't directly check
      // These would normally be fetched from a dedicated health endpoint
      const allServices: SystemHealthStatus[] = services.length > 0 ? services.map(s => ({
        service: s.service,
        serviceVi: s.service,
        status: s.status,
        lastCheck: new Date(),
        message: s.message,
        messageVi: s.message,
        uptime: s.uptime,
      })) : [
        {
          service: 'Gateway',
          serviceVi: 'Cổng API',
          status: 'unknown',
          lastCheck: new Date(),
          message: 'Không thể kết nối',
          messageVi: 'Không thể kết nối đến cổng API',
        },
      ]
      
      setHealthStatuses(allServices)
    } catch (err) {
      setLoadError('Không thể tải trạng thái hệ thống')
      setHealthStatuses([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchHealthStatus()
  }, [fetchHealthStatus])

  const userDisplay = {
    name: user?.name || 'Admin',
    email: user?.email || '',
    role: 'admin' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', labelVi: 'Trang chủ', href: '/' },
    { label: 'Admin', labelVi: 'Quản trị', href: '/admin' },
    { label: 'System', labelVi: 'Hệ thống' },
  ]

  const handleRoleChange = () => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    router.push('/admin/settings')
  }

  const handleRefresh = () => {
    setLastRefresh(new Date())
    fetchHealthStatus()
  }

  // Overall status
  const overallStatus = healthStatuses.length === 0
    ? 'unknown'
    : healthStatuses.every(h => h.status === 'healthy')
      ? 'healthy'
      : healthStatuses.some(h => h.status === 'offline')
        ? 'offline'
        : 'degraded'

  return (
    <DashboardLayoutWrapper
      user={userDisplay}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="System Health"
          titleVi="Tình trạng Hệ thống"
          description="Monitor platform health and status"
          descriptionVi="Giám sát tình trạng và sức khỏe nền tảng"
          actions={
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {t('admin.lastRefresh')}: {formatRelativeTime(lastRefresh)}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('admin.refresh')}
              </Button>
            </div>
          }
        />

        {/* Overall Status Banner */}
        <Card variant="default" padding="lg" className={cn('border-l-4', 
          overallStatus === 'healthy' ? 'border-l-success-500' :
          overallStatus === 'degraded' ? 'border-l-amber-500' :
          'border-l-error-500'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn('flex h-16 w-16 items-center justify-center rounded-xl text-3xl',
                overallStatus === 'healthy' ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400' :
                overallStatus === 'degraded' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                'bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400'
              )}>
                {overallStatus === 'healthy' ? '✓' : overallStatus === 'degraded' ? '!' : '✗'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {overallStatus === 'healthy' ? t('admin.allSystemsOperational') :
                   overallStatus === 'degraded' ? t('admin.someServicesDegraded') :
                   t('admin.someServicesUnavailable')}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {healthStatuses.filter(h => h.status === 'healthy').length}/{healthStatuses.length} {t('admin.servicesOperational')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
              <p className="text-sm text-slate-500">Đang tải trạng thái hệ thống...</p>
            </div>
          </div>
        ) : loadError ? (
          <Card variant="default" padding="lg" className="border-l-4 border-error-500">
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <svg className="h-12 w-12 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{loadError}</h4>
                <p className="mt-1 text-sm text-slate-500">Vui lòng thử tải lại trang</p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchHealthStatus}>
                Thử lại
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {healthStatuses.map((health) => (
              <HealthCard key={health.service} health={health} />
            ))}
          </div>
        )}

        {/* Empty State when no services configured */}
        {!isLoading && !loadError && healthStatuses.length === 0 && (
          <Card variant="default" padding="lg">
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                Không có thông tin trạng thái
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Hệ thống không có thông tin trạng thái để hiển thị
              </p>
            </div>
          </Card>
        )}

        {/* Info Notice */}
        <Card variant="default" padding="md" className="border-l-4 border-slate-500">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Thông tin hệ thống
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Trạng thái hệ thống được cập nhật tự động. Thời gian phản hồi có thể thay đổi tùy theo tải.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayoutWrapper>
  )
}
