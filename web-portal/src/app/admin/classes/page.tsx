'use client'

import * as React from 'react'
import Link from 'next/link'
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
import * as classApi from '@/lib/api/classes'
import type { ClassSummary, ClassDetail, CreateClassInput } from '@/lib/api/classes'
import { authService } from '@/services/auth'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

/**
 * Class Card Component
 */
interface ClassCardProps {
  classData: ClassSummary
  onClick?: () => void
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onClick }) => {
  const isVietnamese = useIsVietnamese()

  return (
    <Card variant="interactive" padding="md" className="h-full" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {classData.name}
          </h4>
          {classData.subject && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {classData.subject}
            </p>
          )}
        </div>
        <Badge variant="default" size="sm">
          {classData.studentCount ?? 0} {isVietnamese ? 'học sinh' : 'students'}
        </Badge>
      </div>
      
      {classData.averageMastery !== undefined && classData.averageMastery !== null && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isVietnamese ? 'Độ thành thạo TB' : 'Avg. Mastery'}</span>
            <span className="font-medium">{Math.round(classData.averageMastery * 100)}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                classData.averageMastery >= 0.8 ? 'bg-success-500' :
                classData.averageMastery >= 0.5 ? 'bg-amber-500' :
                'bg-error-500'
              )}
              style={{ width: `${Math.round(classData.averageMastery * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {isVietnamese ? 'GV: ' : 'Teacher: '}{classData.teacherId.substring(0, 8)}...
        </span>
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  )
}

/**
 * Admin Classes Page
 */
export default function AdminClassesPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [classes, setClasses] = React.useState<ClassSummary[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [newClassName, setNewClassName] = React.useState('')
  const [newClassSubject, setNewClassSubject] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch classes data
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

        // Fetch all classes (admin can see all)
        const classesData = await classApi.listClasses()
        setClasses(classesData || [])
      } catch (err) {
        console.error('Failed to load classes:', err)
        setError(err instanceof Error ? err.message : 'Failed to load classes')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // Filter classes by search query
  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  // Handle create class
  const handleCreateClass = async () => {
    if (!newClassName.trim()) return
    
    setIsCreating(true)
    try {
      const newClass = await classApi.createClass({
        name: newClassName.trim(),
        ...(newClassSubject.trim() ? { subject: newClassSubject.trim() } : {}),
      })
      setClasses(prev => [newClass, ...prev])
      setIsCreateModalOpen(false)
      setNewClassName('')
      setNewClassSubject('')
    } catch (err) {
      console.error('Failed to create class:', err)
      alert(err instanceof Error ? err.message : 'Failed to create class')
    } finally {
      setIsCreating(false)
    }
  }

  // User display object for DashboardLayoutWrapper
  const userDisplay = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  } : { name: 'Admin', email: '', role: 'admin' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/admin' },
    { label: isVietnamese ? 'Quản lý lớp học' : 'Class Management', labelVi: 'Quản lý lớp học' },
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
          title="Class Management"
          titleVi="Quản lý lớp học"
          description="View and manage all classes in the system"
          descriptionVi="Xem và quản lý tất cả lớp học trong hệ thống"
          actions={
            <div className="flex items-center gap-2">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {isVietnamese ? 'Tạo lớp mới' : 'Create Class'}
              </Button>
            </div>
          }
        />

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder={isVietnamese ? 'Tìm kiếm lớp học...' : 'Search classes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredClasses.length} {isVietnamese ? 'lớp học' : 'classes'}
          </span>
        </div>

        {/* Classes Grid */}
        {error ? (
          <EmptyState
            title="Error loading classes"
            titleVi="Lỗi khi tải lớp học"
            description={error}
            descriptionVi={error}
            action={
              <Button variant="primary" onClick={() => window.location.reload()}>
                {isVietnamese ? 'Thử lại' : 'Retry'}
              </Button>
            }
          />
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClasses.map((classData) => (
              <Link key={classData.id} href={`/admin/classes/${classData.id}`}>
                <ClassCard 
                  classData={classData}
                  onClick={() => router.push(`/admin/classes/${classData.id}`)}
                />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? (isVietnamese ? 'Không tìm thấy lớp học' : 'No classes found') : (isVietnamese ? 'Chưa có lớp học nào' : 'No classes yet')}
            titleVi={searchQuery ? 'Không tìm thấy lớp học' : 'Chưa có lớp học nào'}
            description={searchQuery 
              ? (isVietnamese ? 'Thử tìm kiếm với từ khóa khác' : 'Try searching with a different keyword')
              : (isVietnamese ? 'Tạo lớp học đầu tiên để bắt đầu' : 'Create your first class to get started')
            }
            descriptionVi={searchQuery 
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Tạo lớp học đầu tiên để bắt đầu'
            }
            action={
              !searchQuery && (
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                  {isVietnamese ? 'Tạo lớp học mới' : 'Create Class'}
                </Button>
              )
            }
          />
        )}
      </div>

      {/* Create Class Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Tạo lớp học mới' : 'Create New Class'}
            </h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isVietnamese ? 'Tên lớp học' : 'Class Name'} *
                </label>
                <Input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder={isVietnamese ? 'VD: Toán 6A' : 'e.g., Math 6A'}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isVietnamese ? 'Môn học' : 'Subject'}
                </label>
                <Input
                  type="text"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  placeholder={isVietnamese ? 'VD: Toán học' : 'e.g., Mathematics'}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setNewClassName('')
                  setNewClassSubject('')
                }}
                disabled={isCreating}
              >
                {isVietnamese ? 'Hủy' : 'Cancel'}
              </Button>
              <Button 
                variant="primary"
                onClick={handleCreateClass}
                disabled={!newClassName.trim() || isCreating}
              >
                {isCreating 
                  ? (isVietnamese ? 'Đang tạo...' : 'Creating...') 
                  : (isVietnamese ? 'Tạo lớp học' : 'Create Class')
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayoutWrapper>
  )
}
