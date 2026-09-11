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
  MasteryRingIndicator,
  MasteryCard,
} from '@/components/ui'
import {
  mockStudentProfile,
  mockStudentDashboardStats,
  mockSubjectMasteries,
  mockTopicMasteries,
} from '@/data/student-mock-data'
import { getMasteryLevel, formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { UserRole, BreadcrumbItem, StudentTopicMastery, SubjectMastery } from '@/types'

/**
 * Subject Card Component
 */
interface SubjectCardProps {
  subject: SubjectMastery
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { t } = useLanguage()
  
  const levelColors = {
    mastered: 'text-success-600 dark:text-success-400',
    learning: 'text-amber-600 dark:text-amber-400',
    'needs-support': 'text-error-600 dark:text-error-400',
    unknown: 'text-slate-400',
  }

  const levelLabels = {
    mastered: t('mastery.mastered') || 'Đã thành thạo',
    learning: t('mastery.learning') || 'Đang học',
    'needs-support': t('mastery.needsSupport') || 'Cần luyện tập',
    unknown: t('common.unknown') || 'Chưa xác định',
  }

  return (
    <Link href={`/student/mastery?subject=${subject.subjectId}`}>
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {subject.subjectNameVi}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subject.topicCount} chủ đề
            </p>
          </div>
          <MasteryRingIndicator
            pKnown={subject.overallMastery}
            size="md"
            showLabel={false}
            showPercentage={true}
          />
        </div>

        <div className="mt-4">
          <MasteryBar pKnown={subject.overallMastery} size="sm" showLabel />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant={
              subject.masteryLevel === 'mastered' ? 'success' :
              subject.masteryLevel === 'learning' ? 'warning' :
              'error'
            }
            size="sm"
          >
            {levelLabels[subject.masteryLevel]}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {subject.masteredTopics}/{subject.topicCount} {t('mastery.topics') || 'đã thành thạo'}
          </span>
        </div>
      </Card>
    </Link>
  )
}

/**
 * Topic Card Component
 */
interface TopicCardProps {
  topic: StudentTopicMastery
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const trendIcons = {
    up: (
      <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="h-4 w-4 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    stable: (
      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  }

  return (
    <Link href={`/student/mastery/${topic.topicId}`}>
      <Card variant="interactive" padding="md" className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {topic.topicNameVi}
              </h4>
              {topic.trend && trendIcons[topic.trend]}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {topic.subjectVi}
            </p>
          </div>
          <div className="text-right">
            <p className={cn(
              'text-lg font-bold',
              topic.masteryLevel === 'mastered' ? 'text-success-600 dark:text-success-400' :
              topic.masteryLevel === 'learning' ? 'text-amber-600 dark:text-amber-400' :
              'text-error-600 dark:text-error-400'
            )}>
              {Math.round(topic.pKnown * 100)}%
            </p>
          </div>
        </div>

        <div className="mt-3">
          <MasteryBar pKnown={topic.pKnown} size="sm" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{topic.evidenceCount} bằng chứng</span>
          <span>{formatRelativeTime(topic.lastActivity)}</span>
        </div>
      </Card>
    </Link>
  )
}

/**
 * My Mastery Page
 */
export default function MyMasteryPage() {
  const router = useRouter()
  const [currentRole] = React.useState<UserRole>('student')
  const [activeTab, setActiveTab] = React.useState('all')
  const { t } = useLanguage()

  const student = mockStudentProfile
  const stats = mockStudentDashboardStats
  const subjects = mockSubjectMasteries
  const topics = mockTopicMasteries

  // Group topics by mastery level
  const masteredTopics = topics.filter(t => t.masteryLevel === 'mastered')
  const learningTopics = topics.filter(t => t.masteryLevel === 'learning')
  const needsSupportTopics = topics.filter(t => t.masteryLevel === 'needs-support')

  // Get topics for current tab
  const filteredTopics = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    switch (activeTab) {
      case 'mastered':
        return masteredTopics
      case 'learning':
        return learningTopics
      case 'needs-support':
        return needsSupportTopics
      default:
        return topics
    }
  }, [activeTab, masteredTopics, learningTopics, needsSupportTopics, topics])

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Mức độ thành thạo', labelVi: 'Mức độ thành thạo' },
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

  const masteryLevel = getMasteryLevel(stats.overallMastery)

  const levelLabels = {
    mastered: t('mastery.mastered') || 'Đã thành thạo',
    learning: t('mastery.learning') || 'Đang học',
    'needs-support': t('mastery.needsSupport') || 'Cần luyện tập thêm',
    unknown: t('common.unknown') || 'Chưa xác định',
  }

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
          title="My Mastery"
          titleVi="Mức độ Thành thạo"
          description="Track your learning progress across all topics"
          descriptionVi="Theo dõi tiến độ học tập của bạn trên tất cả các chủ đề"
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push('/student/evidence')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Xem bằng chứng
            </Button>
          }
        />

        {/* Overall Progress */}
        <div className="grid gap-6 lg:grid-cols-4">
          <Card variant="default" padding="lg" className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <MasteryRingIndicator
                pKnown={stats.overallMastery}
                size="xl"
                showLabel={false}
                showPercentage={true}
              />
              <div className="mt-4 text-center">
                <Badge
                  variant={
                    masteryLevel === 'mastered' ? 'success' :
                    masteryLevel === 'learning' ? 'warning' :
                    'error'
                  }
                >
                  {levelLabels[masteryLevel]}
                </Badge>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t('mastery.overall') || 'Mức độ thành thạo tổng thể'}
                </p>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-3">
            <PageGrid columns={3} gap="md">
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('mastery.mastered') || 'Đã thành thạo'}</p>
                    <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                      {masteredTopics.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center dark:bg-success-900/30">
                    <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('mastery.learning') || 'Đang học'}</p>
                    <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {learningTopics.length}
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('mastery.needsSupport') || 'Cần luyện tập'}</p>
                    <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
                      {needsSupportTopics.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center dark:bg-error-900/30">
                    <svg className="h-5 w-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </PageGrid>
          </div>
        </div>

        {/* Subjects Overview */}
        <PageSection title="Theo môn học" titleVi="Theo môn học">
          <PageGrid columns={3} gap="md">
            {subjects.map((subject) => (
              <SubjectCard key={subject.subjectId} subject={subject} />
            ))}
          </PageGrid>
        </PageSection>

        {/* Topics by Mastery Level */}
        <PageSection title="Theo mức độ thành thạo" titleVi="Theo mức độ thành thạo">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                {t('common.all') || 'Tất cả'} ({topics.length})
              </TabsTrigger>
              <TabsTrigger value="mastered">
                {t('mastery.mastered') || 'Đã thành thạo'} ({masteredTopics.length})
              </TabsTrigger>
              <TabsTrigger value="learning">
                {t('mastery.learning') || 'Đang học'} ({learningTopics.length})
              </TabsTrigger>
              <TabsTrigger value="needs-support">
                {t('mastery.needsSupport') || 'Cần luyện tập'} ({needsSupportTopics.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredTopics.length > 0 ? (
                <PageGrid columns={3} gap="md">
                  {filteredTopics.map((topic) => (
                    <TopicCard key={topic.topicId} topic={topic} />
                  ))}
                </PageGrid>
              ) : (
                <EmptyState
                  title="No topics found"
                  titleVi="Không tìm thấy chủ đề"
                  description={
                    activeTab === 'mastered'
                      ? "You haven't mastered any topics yet. Keep practicing!"
                      : activeTab === 'learning'
                        ? "You don't have any topics in progress."
                        : "Great! You don't need extra practice in any topics."
                  }
                  descriptionVi={
                    activeTab === 'mastered'
                      ? "Bạn chưa thành thạo chủ đề nào. Tiếp tục luyện tập!"
                      : activeTab === 'learning'
                        ? "Bạn không có chủ đề nào đang tiến hành."
                        : "Tuyệt vời! Bạn không cần luyện tập thêm chủ đề nào."
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
