'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardLayoutWrapper,
  PageHeader,
  PageSection,
  PageGrid,
  EmptyState,
} from '@/components/layout'
import {
  Card,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui'
import {
  MasteryBar,
  MasteryBadge,
} from '@/components/ui'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { LearningRecommendation } from '@/types'
import { getRecommendations } from '@/services/recommendation/recommendation.service'

/**
 * Recommendation Card Component
 */
interface RecommendationCardProps {
  recommendation: LearningRecommendation
  onStart: () => void
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onStart }) => {
  const { t } = useLanguage()
  
  const priorityColors = {
    high: {
      border: 'border-l-4 border-l-error-500',
      bg: 'bg-error-50 dark:bg-error-900/20',
      badge: 'error' as const,
      label: t('diagnosis.highPriority') || 'Ưu tiên cao',
    },
    medium: {
      border: 'border-l-4 border-l-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      badge: 'warning' as const,
      label: t('diagnosis.mediumPriority') || 'Ưu tiên trung bình',
    },
    low: {
      border: 'border-l-4 border-l-info-500',
      bg: 'bg-info-50 dark:bg-info-900/20',
      badge: 'info' as const,
      label: t('diagnosis.lowPriority') || 'Ưu tiên thấp',
    },
  }

  const config = priorityColors[recommendation.priority]

  const actionConfig = {
    practice: {
      label: t('common.practice') || 'Luyện tập',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    review: {
      label: t('common.review') || 'Ôn tập',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.896 1.464 16 5.568 16 12s-5.104 10.536-12 10.536S4 18.432 4 12 9.104 1.464 12 1.464z" />
        </svg>
      ),
    },
    assessment: {
      label: t('exam.title') || 'Kiểm tra',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    continue: {
      label: t('common.continue') || 'Tiếp tục',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const action = actionConfig[recommendation.recommendedAction]

  const statusConfig = {
    pending: { label: t('common.notStarted') || 'Chưa bắt đầu', badge: 'default' as const },
    'in-progress': { label: t('common.inProgress') || 'Đang tiến hành', badge: 'info' as const },
    completed: { label: t('common.completed') || 'Hoàn thành', badge: 'success' as const },
  }

  const status = statusConfig[recommendation.status]

  return (
    <Card variant="default" padding="lg" className={cn('transition-shadow hover:shadow-md', config.border)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/student/mastery/${recommendation.topicId}`}>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 hover:text-verve-600 dark:hover:text-verve-400">
                {recommendation.topicNameVi}
              </h4>
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {recommendation.reasonVi}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={config.badge} size="sm">
            {config.label}
          </Badge>
          <Badge variant={status.badge} size="sm">
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">Mức độ hiện tại</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {Math.round(recommendation.currentMastery * 100)}%
          </span>
        </div>
        <MasteryBar pKnown={recommendation.currentMastery} size="sm" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            {action.icon}
            <span>{action.label}</span>
          </div>
          {recommendation.estimatedMinutes && (
            <span className="text-xs text-slate-400">
              ~{recommendation.estimatedMinutes} {t('mastery.minutes') || 'phút'}
            </span>
          )}
        </div>
        {recommendation.status !== 'completed' && (
          <Button variant="primary" size="sm" onClick={onStart}>
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  )
}

/**
 * Recommendations Page
 */
export default function RecommendationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('student')
  const [activeTab, setActiveTab] = React.useState('all')
  const [recommendations, setRecommendations] = React.useState<LearningRecommendation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { t } = useLanguage()

  // Fetch recommendations on mount
  React.useEffect(() => {
    async function fetchRecommendations() {
      if (!user?.id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const recs = await getRecommendations(user.id, {
          limit: 20,
          language: 'vi',
        })
        setRecommendations(recs)
      } catch (err) {
        console.error('Failed to fetch recommendations:', err)
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRecommendations()
  }, [user?.id])

  // Filter recommendations by tab
  const filteredRecommendations = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    switch (activeTab) {
      case 'high':
        return recommendations.filter(r => r.priority === 'high')
      case 'medium':
        return recommendations.filter(r => r.priority === 'medium')
      case 'low':
        return recommendations.filter(r => r.priority === 'low')
      case 'in-progress':
        return recommendations.filter(r => r.status === 'in-progress')
      default:
        return recommendations
    }
  }, [activeTab, recommendations])

  // Sort by priority
  const sortedRecommendations = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sorted = [...filteredRecommendations].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    return sorted
  }, [filteredRecommendations])

  // Use user from auth context
  const currentUser = {
    name: user?.name || 'Student',
    email: user?.email || '',
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Đề xuất', labelVi: 'Đề xuất' },
  ]

  const handleRoleChange = (newRole: UserRole) => {
    router.push('/')
  }

  const handleSignOut = () => {
    router.push('/')
  }

  const handleSettings = () => {
    // Navigate to settings
  }

  // Stats
  const stats = React.useMemo(() => ({
    // eslint-disable-next-line react-hooks/exhaustive-deps
    total: recommendations.length,
    high: recommendations.filter(r => r.priority === 'high').length,
    medium: recommendations.filter(r => r.priority === 'medium').length,
    inProgress: recommendations.filter(r => r.status === 'in-progress').length,
  }), [recommendations])

  return (
    <DashboardLayoutWrapper
      user={currentUser}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Recommended Learning"
          titleVi="Đề xuất Học tập"
          description="Personalized recommendations to help you improve"
          descriptionVi="Những đề xuất cá nhân hóa để giúp bạn cải thiện"
          actions={
            <Button variant="primary" size="sm" onClick={() => router.push('/student/mastery')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Xem tất cả chủ đề
            </Button>
          }
        />

        {/* Info Banner */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verve-100 dark:bg-verve-900/30">
              <svg className="h-5 w-5 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {t('common.personalizedForYou') || 'Đề xuất được cá nhân hóa cho bạn'}
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t('common.recommendationBasedOn') || 'Dựa trên kết quả học tập của bạn, chúng tôi đề xuất những chủ đề bạn nên tập trung. Ưu tiên những đề xuất có mức độ cao để đạt được kết quả tốt nhất.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <PageGrid columns={4} gap="md">
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.totalRecommendations') || 'Tổng đề xuất'}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.total}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-verve-100 flex items-center justify-center dark:bg-verve-900/30">
                <svg className="h-5 w-5 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('diagnosis.highPriority') || 'Ưu tiên cao'}</p>
                <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
                  {stats.high}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center dark:bg-error-900/30">
                <svg className="h-5 w-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('diagnosis.mediumPriority') || 'Ưu tiên TB'}</p>
                <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.medium}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center dark:bg-amber-900/30">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.inProgress') || 'Đang tiến hành'}</p>
                <p className="mt-1 text-2xl font-bold text-info-600 dark:text-info-400">
                  {stats.inProgress}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center dark:bg-info-900/30">
                <svg className="h-5 w-5 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </Card>
        </PageGrid>

        {/* Filters */}
        <Card variant="default" padding="md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                Tất cả ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="high">
                Ưu tiên cao ({stats.high})
              </TabsTrigger>
              <TabsTrigger value="medium">
                Ưu tiên TB ({stats.medium})
              </TabsTrigger>
              <TabsTrigger value="low">
                Ưu tiên thấp
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                Đang tiến hành ({stats.inProgress})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Recommendations List */}
        <PageSection title="Đề xuất của bạn" titleVi="Đề xuất của bạn">
          {isLoading ? (
            <Card variant="default" padding="lg">
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
                  <p className="text-sm text-slate-500">Đang tải đề xuất...</p>
                </div>
              </div>
            </Card>
          ) : error ? (
            <Card variant="default" padding="lg">
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/30">
                  <svg className="h-6 w-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Không thể tải đề xuất</h4>
                  <p className="mt-1 text-sm text-slate-500">{error}</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            </Card>
          ) : sortedRecommendations.length > 0 ? (
            <div className="space-y-4">
              {sortedRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onStart={() => router.push(`/student/mastery/${rec.topicId}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations"
              titleVi="Không có đề xuất"
              description="Great job! You don't have any pending recommendations."
              descriptionVi="Tuyệt vời! Bạn không có đề xuất nào đang chờ."
            />
          )}
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
