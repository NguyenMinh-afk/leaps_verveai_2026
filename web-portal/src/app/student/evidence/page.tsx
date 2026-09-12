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
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui'
import {
  MasteryBadge,
} from '@/components/ui'
import {
  mockStudentProfile,
  mockEvidenceItems,
  mockTopicMasteries,
} from '@/data/student-mock-data'
import { formatRelativeTime, getMasteryLevel } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem } from '@/types'
import type { EvidenceItem } from '@/types'

/**
 * Evidence Card Component
 */
interface EvidenceCardProps {
  evidence: EvidenceItem
  topic?: { topicNameVi: string; masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown' }
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, topic }) => {
  const { t } = useLanguage()
  
  const typeConfig = {
    assessment: { label: t('exam.title') || 'Kiểm tra', color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' },
    assignment: { label: t('assignment.title') || 'Bài tập', color: 'bg-verve-100 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300' },
    practice: { label: t('common.practice') || 'Luyện tập', color: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300' },
    'topic-complete': { label: t('common.completed') || 'Hoàn thành', color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' },
  }

  const config = typeConfig[evidence.type]

  const impactIcons = {
    positive: (
      <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    neutral: (
      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
    negative: (
      <svg className="h-5 w-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  }

  const impactLabels = {
    positive: t('common.positive') || 'Tiến bộ',
    neutral: t('common.neutral') || 'Bình thường',
    negative: t('common.negative') || 'Cần cải thiện',
  }

  return (
    <Card variant="default" padding="md">
      <div className="flex items-start gap-4">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg', config.color)}>
          {impactIcons[evidence.impact]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {evidence.titleVi}
              </h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {evidence.descriptionVi}
              </p>
            </div>
            <div className="text-right">
              {evidence.percentage !== undefined && (
                <p className={cn(
                  'text-lg font-bold',
                  evidence.percentage >= 80 ? 'text-success-600 dark:text-success-400' :
                  evidence.percentage >= 60 ? 'text-amber-600 dark:text-amber-400' :
                  'text-error-600 dark:text-error-400'
                )}>
                  {evidence.percentage}%
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" size="sm">
              {config.label}
            </Badge>
            {topic && (
              <Link href={`/student/mastery/${evidence.topicId}`}>
                <Badge variant="primary" size="sm" className="hover:opacity-80">
                  {evidence.topicNameVi}
                </Badge>
              </Link>
            )}
            <span className="text-xs text-slate-400">
              {formatRelativeTime(evidence.completedAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Evidence Chain Page
 */
export default function EvidenceChainPage() {
  const router = useRouter()
  const [currentRole] = React.useState<UserRole>('student')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all')
  const { t } = useLanguage()

  const student = mockStudentProfile
  const evidenceItems = mockEvidenceItems
  const topics = mockTopicMasteries

  // Create topic lookup
  const topicMap = React.useMemo(() => {
    const map = new Map<string, typeof topics[0]>()
    topics.forEach(t => map.set(t.topicId, t))
    return map
  }, [topics])

  // Filter evidence
  const filteredEvidence = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let items = [...evidenceItems]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(e =>
        e.titleVi.toLowerCase().includes(query) ||
        e.descriptionVi.toLowerCase().includes(query) ||
        e.topicNameVi.toLowerCase().includes(query)
      )
    }

    // Filter by tab
    if (activeTab === 'positive') {
      items = items.filter(e => e.impact === 'positive')
    } else if (activeTab === 'neutral') {
      items = items.filter(e => e.impact === 'neutral')
    } else if (activeTab === 'negative') {
      items = items.filter(e => e.impact === 'negative')
    }

    // Sort by date (most recent first)
    items.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    return items
  }, [evidenceItems, searchQuery, activeTab])

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Bằng chứng', labelVi: 'Bằng chứng' },
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
    total: evidenceItems.length,
    positive: evidenceItems.filter(e => e.impact === 'positive').length,
    neutral: evidenceItems.filter(e => e.impact === 'neutral').length,
    negative: evidenceItems.filter(e => e.impact === 'negative').length,
  }), [evidenceItems])

  return (
    <DashboardLayoutWrapper
      user={user}
      breadcrumbs={breadcrumbs}
      onRoleChange={handleRoleChange}
      onSignOut={handleSignOut}
      onSettings={handleSettings}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Evidence Chain"
          titleVi="Chuỗi Bằng chứng"
          description="See why your mastery levels are what they are"
          descriptionVi="Xem tại sao mức độ thành thạo của bạn như vậy"
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push('/student/mastery')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Xem mức độ thành thạo
            </Button>
          }
        />

        {/* Info Banner */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info-100 dark:bg-info-900/30">
              <svg className="h-5 w-5 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {t('common.whatIsEvidence') || 'Bằng chứng học tập là gì?'}
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t('common.evidenceDescription') || 'Mỗi khi bạn hoàn thành một bài tập, kiểm tra, hoặc luyện tập, hệ thống sẽ ghi lại kết quả của bạn như một "bằng chứng". Những bằng chứng này giúp VERVE AI hiểu bạn đã hiểu những gì và cần hỗ trợ ở đâu.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <PageGrid columns={4} gap="md">
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.totalEvidence') || 'Tổng bằng chứng'}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.total}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center dark:bg-slate-800">
                <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.positive') || 'Tiến bộ'}</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {stats.positive}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center dark:bg-success-900/30">
                <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.neutral') || 'Bình thường'}</p>
                <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">
                  {stats.neutral}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center dark:bg-slate-800">
                <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
              </div>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.needsImprovement') || 'Cần cải thiện'}</p>
                <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
                  {stats.negative}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center dark:bg-error-900/30">
                <svg className="h-5 w-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </Card>
        </PageGrid>

        {/* Filters */}
        <Card variant="default" padding="md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder="Tìm kiếm bằng chứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  {t('common.all') || 'Tất cả'} ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="positive">
                  {t('common.positive') || 'Tiến bộ'} ({stats.positive})
                </TabsTrigger>
                <TabsTrigger value="neutral">
                  {t('common.neutral') || 'Bình thường'} ({stats.neutral})
                </TabsTrigger>
                <TabsTrigger value="negative">
                  {t('common.needsImprovement') || 'Cần cải thiện'} ({stats.negative})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Evidence List */}
        <PageSection title="Lịch sử bằng chứng" titleVi="Lịch sử bằng chứng">
          {filteredEvidence.length > 0 ? (
            <div className="space-y-3">
              {filteredEvidence.map((evidence) => (
                <EvidenceCard
                  key={evidence.id}
                  evidence={evidence}
                  topic={topicMap.get(evidence.topicId)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No evidence found"
              titleVi="Không tìm thấy bằng chứng"
              description="Try adjusting your search or filters"
              descriptionVi="Thử điều chỉnh tìm kiếm hoặc bộ lọc"
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('all')
                  }}
                >
                  {t('common.clearFilters') || 'Xóa bộ lọc'}
                </Button>
              }
            />
          )}
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
