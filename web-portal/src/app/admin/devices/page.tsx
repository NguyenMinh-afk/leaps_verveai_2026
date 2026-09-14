'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
  EmptyState,
  LoadingState,
} from '@/components/layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { api } from '@/lib/api/apiClient'
import { authService } from '@/services/auth'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

// Types for device data
interface Device {
  id: string
  name: string
  type: 'STUDENT' | 'TEACHER' | 'HUB' | 'UNKNOWN'
  lastSeenAt: string | null
  syncStatus: 'SYNCED' | 'PENDING' | 'OFFLINE'
  createdAt: string
  updatedAt: string
}

interface DeviceListResponse {
  data: Device[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Device Card Component
 */
interface DeviceCardProps {
  device: Device
  onClick?: () => void
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const isVietnamese = useIsVietnamese()

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'STUDENT':
        return isVietnamese ? 'Máy học sinh' : 'Student Device'
      case 'TEACHER':
        return isVietnamese ? 'Máy giáo viên' : 'Teacher Device'
      case 'HUB':
        return isVietnamese ? 'Hub đồng bộ' : 'Sync Hub'
      default:
        return isVietnamese ? 'Thiết bị' : 'Device'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SYNCED':
        return isVietnamese ? 'Đã đồng bộ' : 'Synced'
      case 'PENDING':
        return isVietnamese ? 'Đang chờ' : 'Pending'
      case 'OFFLINE':
        return isVietnamese ? 'Ngoại tuyến' : 'Offline'
      default:
        return status
    }
  }

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'SYNCED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'OFFLINE':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatLastSeen = (dateStr: string | null) => {
    if (!dateStr) return isVietnamese ? 'Chưa bao giờ' : 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return isVietnamese ? 'Vừa xong' : 'Just now'
    if (diffMins < 60) return `${diffMins} ${isVietnamese ? 'phút trước' : 'mins ago'}`
    if (diffHours < 24) return `${diffHours} ${isVietnamese ? 'giờ trước' : 'hours ago'}`
    if (diffDays < 7) return `${diffDays} ${isVietnamese ? 'ngày trước' : 'days ago'}`
    return date.toLocaleDateString(isVietnamese ? 'vi-VN' : 'en-US')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'STUDENT':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case 'TEACHER':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'HUB':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  const isOnline = device.lastSeenAt && 
    (new Date().getTime() - new Date(device.lastSeenAt).getTime()) < 5 * 60 * 1000 // 5 minutes

  return (
    <Card variant="interactive" padding="md" className="h-full" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          isOnline 
            ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        )}>
          {getTypeIcon(device.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {device.name || device.id.substring(0, 8)}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {getTypeLabel(device.type)}
              </p>
            </div>
            <Badge variant={getStatusVariant(device.syncStatus)} size="sm">
              {getStatusLabel(device.syncStatus)}
            </Badge>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>
              {isVietnamese ? 'Hoạt động lần cuối' : 'Last seen'}: {formatLastSeen(device.lastSeenAt)}
            </span>
            {isOnline && (
              <span className="flex items-center gap-1 text-success-600 dark:text-success-400">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                {isVietnamese ? 'Trực tuyến' : 'Online'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Admin Devices Page
 */
export default function AdminDevicesPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [devices, setDevices] = React.useState<Device[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [totalDevices, setTotalDevices] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch devices data
  React.useEffect(() => {
    async function loadData() {
      try {
        // Get current session
        const session = await authService.getSession()
        if (!session?.user) {
          router.push('/login')
          return
        }
        
        setCurrentUser({
          id: session.user.id || '',
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        })

        // Check if user is admin
        if (session.user.role !== 'admin') {
          router.push('/')
          return
        }

        // Fetch devices from sync service
        try {
          const response = await api.get<DeviceListResponse | { data: Device[]; meta?: { total: number } }>('/api/sync/devices?pageSize=100')
          // Handle both wrapped and unwrapped responses
          if ('data' in response && Array.isArray((response as { data: Device[] }).data)) {
            const data = response as { data: Device[]; meta?: { total: number } }
            setDevices(data.data || [])
            setTotalDevices(data.meta?.total || 0)
          } else {
            setDevices([])
            setTotalDevices(0)
          }
        } catch {
          setDevices([])
          setTotalDevices(0)
        }
      } catch (err) {
        console.error('Failed to load devices:', err)
        // Don't show error - devices might not be implemented yet
        setDevices([])
        setTotalDevices(0)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // Filter devices by search query
  const filteredDevices = devices.filter(d =>
    (d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats
  const onlineDevices = devices.filter(d => {
    if (!d.lastSeenAt) return false
    const diffMs = new Date().getTime() - new Date(d.lastSeenAt).getTime()
    return diffMs < 5 * 60 * 1000 // 5 minutes
  }).length

  const pendingSync = devices.filter(d => d.syncStatus === 'PENDING').length

  // User display object for DashboardLayoutWrapper
  const userDisplay = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  } : { name: 'Admin', email: '', role: 'admin' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/admin' },
    { label: isVietnamese ? 'Quản lý thiết bị' : 'Device Management', labelVi: 'Quản lý thiết bị' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout errors
    }
    router.push('/login')
  }

  const handleSettings = () => {
    router.push('/admin/settings')
  }

  if (isLoading) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <LoadingState />
      </DashboardLayoutWrapper>
    )
  }

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
          title="Device Management"
          titleVi="Quản lý thiết bị"
          description="Monitor sync hub and student/teacher devices"
          descriptionVi="Giám sát hub đồng bộ và thiết bị học sinh/giáo viên"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isVietnamese ? 'Đồng bộ hóa' : 'Sync All'}
              </Button>
            </div>
          }
        />

        {/* Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card variant="default" padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Đang trực tuyến' : 'Online'}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {onlineDevices} / {totalDevices}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Đang chờ đồng bộ' : 'Pending Sync'}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {pendingSync}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Ngoại tuyến' : 'Offline'}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalDevices - onlineDevices}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder={isVietnamese ? 'Tìm kiếm thiết bị...' : 'Search devices...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredDevices.length} {isVietnamese ? 'thiết bị' : 'devices'}
          </span>
        </div>

        {/* Devices Grid */}
        {error ? (
          <EmptyState
            title="Error loading devices"
            titleVi="Lỗi khi tải thiết bị"
            description={error}
            descriptionVi={error}
            action={
              <Button variant="primary" onClick={() => window.location.reload()}>
                {isVietnamese ? 'Thử lại' : 'Retry'}
              </Button>
            }
          />
        ) : filteredDevices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? (isVietnamese ? 'Không tìm thấy thiết bị' : 'No devices found') : (isVietnamese ? 'Chưa có thiết bị nào' : 'No devices yet')}
            titleVi={searchQuery ? 'Không tìm thấy thiết bị' : 'Chưa có thiết bị nào'}
            description={searchQuery 
              ? (isVietnamese ? 'Thử tìm kiếm với từ khóa khác' : 'Try searching with a different keyword')
              : (isVietnamese ? 'Chưa có thiết bị nào được đăng ký' : 'No devices have been registered yet')
            }
            descriptionVi={searchQuery 
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Chưa có thiết bị nào được đăng ký'
            }
          />
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
