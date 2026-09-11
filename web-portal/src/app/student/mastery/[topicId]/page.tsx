'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
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
} from '@/components/ui'
import {
  MasteryBar,
  MasteryBadge,
  MasteryRingIndicator,
} from '@/components/ui'
import {
  mockStudentProfile,
  getTopicById,
  getEvidenceByTopic,
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
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const { t } = useLanguage()
  
  const typeConfig = {
    assessment: { label: t('exam.title') || 'Kiểm tra', icon: 'M' },
    assignment: { label: t('assignment.title') || 'Bài tập', icon: 'A' },
    practice: { label: t('common.practice') || 'Luyện tập', icon: 'P' },
    'topic-complete': { label: t('common.completed') || 'Hoàn thành', icon: 'C' },
  }

  const config = typeConfig[evidence.type]

  const impactColors = {
    positive: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    negative: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  }

  return (
    <Card variant="default" padding="md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verve-100 text-verve-700 dark:bg-verve-900/30 dark:text-verve-300 font-semibold">
            {config.icon}
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              {evidence.titleVi}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatRelativeTime(evidence.completedAt)}
            </p>
          </div>
        </div>
        {evidence.percentage !== undefined && (
          <Badge
            variant={
              evidence.percentage >= 80 ? 'success' :
              evidence.percentage >= 60 ? 'warning' : 'error'
            }
            size="sm"
          >
            {evidence.percentage}%
          </Badge>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        {evidence.descriptionVi}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="outline" size="sm">
          {config.label}
        </Badge>
        <span className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          impactColors[evidence.impact]
        )}>
          {evidence.impact === 'positive' ? (t('common.positive') || 'Tiến bộ') :
           evidence.impact === 'neutral' ? (t('common.neutral') || 'Bình thường') : (t('common.negative') || 'Cần cải thiện')}
        </span>
      </div>
    </Card>
  )
}

/**
 * Topic Mastery Detail Page
 */
export default function TopicMasteryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const topicId = params.topicId as string
  const [currentRole] = React.useState<UserRole>('student')
  const { t } = useLanguage()

  const student = mockStudentProfile
  const topic = getTopicById(topicId)
  const evidence = getEvidenceByTopic(topicId)

  const user = {
    name: student.name,
    email: student.email,
    role: 'student' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', labelVi: 'Trang chủ', href: '/' },
    { label: 'Học sinh', labelVi: 'Học sinh', href: '/student' },
    { label: 'Mức độ thành thạo', labelVi: 'Mức độ thành thạo', href: '/student/mastery' },
    { label: topic?.topicNameVi || 'Chủ đề', labelVi: topic?.topicNameVi || 'Chủ đề' },
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

  if (!topic) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Topic not found"
          titleVi="Không tìm thấy chủ đề"
          description="The topic you're looking for doesn't exist"
          descriptionVi="Chủ đề bạn đang tìm kiếm không tồn tại"
          action={
            <Button variant="primary" onClick={() => router.push('/student/mastery')}>
              Quay lại Mức độ thành thạo
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const masteryLevel = topic.masteryLevel

  const levelMessages = {
    mastered: {
      title: t('mastery.youMastered') || 'Bạn đã thành thạo chủ đề này!',
      description: t('mastery.demonstratedUnderstanding') || 'Bạn đã thể hiện sự hiểu biết vững chắc và có thể áp dụng kiến thức này một cách nhất quán.',
      nextStep: t('mastery.keepReviewing') || 'Tiếp tục ôn tập để duy trì và mở rộng kiến thức.',
    },
    learning: {
      title: t('mastery.youAreImproving') || 'Bạn đang tiến bộ!',
      description: t('mastery.understandingBasics') || 'Bạn đang hiểu những khái niệm cơ bản và đang phát triển kỹ năng của mình.',
      nextStep: t('mastery.keepPracticing') || 'Tiếp tục luyện tập để đạt được sự thành thạo đầy đủ.',
    },
    'needs-support': {
      title: t('mastery.needsMorePractice') || 'Bạn cần luyện tập thêm!',
      description: t('mastery.stillDifficult') || 'Chủ đề này vẫn còn khó khăn. Đừng lo lắng - với sự luyện tập, bạn sẽ tiến bộ!',
      nextStep: t('mastery.startBasics') || 'Bắt đầu với các bài tập cơ bản và dần dần tăng độ khó.',
    },
    unknown: {
      title: t('common.noDataYet') || 'Chưa có đủ dữ liệu',
      description: t('mastery.notEnoughInfo') || 'Hệ thống chưa có đủ thông tin để đánh giá mức độ thành thạo của bạn.',
      nextStep: t('mastery.startLearning') || 'Bắt đầu học và làm bài tập để hệ thống có thể đánh giá.',
    },
  }

  const message = levelMessages[masteryLevel]

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
          title={topic.topicNameVi}
          titleVi={topic.topicNameVi}
          description={topic.subjectVi}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/student/evidence')}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Xem bằng chứng
              </Button>
              <Button variant="primary" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bắt đầu luyện tập
              </Button>
            </div>
          }
        />

        {/* Mastery Status */}
        <Card variant="default" padding="lg" className={cn(
          'border-l-4',
          masteryLevel === 'mastered' ? 'border-l-success-500' :
          masteryLevel === 'learning' ? 'border-l-amber-500' :
          masteryLevel === 'needs-support' ? 'border-l-error-500' :
          'border-l-slate-500'
        )}>
          <div className="flex items-start gap-6">
            <MasteryRingIndicator
              pKnown={topic.pKnown}
              size="xl"
              showLabel={false}
              showPercentage={true}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {message.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {message.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant={
                    masteryLevel === 'mastered' ? 'success' :
                    masteryLevel === 'learning' ? 'warning' :
                    'error'
                  }
                >
                  {masteryLevel === 'mastered' ? t('mastery.mastered') || 'Đã thành thạo' :
                   masteryLevel === 'learning' ? t('mastery.learning') || 'Đang học' :
                   masteryLevel === 'needs-support' ? t('mastery.needsSupport') || 'Cần luyện tập' : t('common.unknown') || 'Chưa xác định'}
                </Badge>
                {topic.trend && (
                  <Badge variant="outline" size="sm">
                    {topic.trend === 'up' ? `↑ ${t('common.improving') || 'Đang tiến bộ'}` :
                     topic.trend === 'down' ? `↓ ${t('common.needAttention') || 'Cần chú ý'}` : `→ ${t('common.stable') || 'Ổn định'}`}
                  </Badge>
                )}
              </div>
              <p className="mt-3 text-sm text-verve-600 dark:text-verve-400 font-medium">
                💡 {message.nextStep}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <PageGrid columns={4} gap="md">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.evidence') || 'Bằng chứng'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {topic.evidenceCount}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('mastery.topics') || 'Chủ đề'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {topic.subjectVi}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.lastActivity') || 'Hoạt động cuối'}</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
              {formatRelativeTime(topic.lastActivity)}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.trend') || 'Xu hướng'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {topic.trend === 'up' ? '↑' : topic.trend === 'down' ? '↓' : '→'}
            </p>
          </Card>
        </PageGrid>

        {/* Evidence Section */}
        <PageSection title={t('common.evidenceChain') || 'Bằng chứng học tập'} titleVi={t('common.evidenceChain') || 'Bằng chứng học tập'}>
          {evidence.length > 0 ? (
            <div className="space-y-3">
              {evidence.map((item) => (
                <EvidenceCard key={item.id} evidence={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No evidence yet"
              titleVi="Chưa có bằng chứng"
              description="Start practicing to build your evidence chain"
              descriptionVi="Bắt đầu luyện tập để xây dựng chuỗi bằng chứng của bạn"
              action={
                <Button variant="primary" size="sm">
                  Bắt đầu luyện tập
                </Button>
              }
            />
          )}
        </PageSection>

        {/* Recommended Actions */}
        <PageSection title={t('common.nextActions') || 'Hành động tiếp theo'} titleVi={t('common.nextActions') || 'Hành động tiếp theo'}>
          <PageGrid columns={3} gap="md">
            <Card variant="default" padding="md" className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verve-100 dark:bg-verve-900/30">
                <svg className="h-6 w-6 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h4 className="mt-3 font-medium text-slate-900 dark:text-slate-100">{t('common.practice') || 'Luyện tập'}</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('mastery.practiceToImprove') || 'Làm các bài tập để cải thiện'}
              </p>
              <Button variant="primary" size="sm" className="mt-3">
                {t('common.start') || 'Bắt đầu'}
              </Button>
            </Card>
            <Card variant="default" padding="md" className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.896 1.464 16 5.568 16 12s-5.104 10.536-12 10.536S4 18.432 4 12 9.104 1.464 12 1.464z" />
                </svg>
              </div>
              <h4 className="mt-3 font-medium text-slate-900 dark:text-slate-100">{t('common.reviewTheory') || 'Ôn tập lý thuyết'}</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('mastery.reviewBasics') || 'Xem lại các khái niệm cơ bản'}
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                {t('common.learnNow') || 'Học ngay'}
              </Button>
            </Card>
            <Card variant="default" padding="md" className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
                <svg className="h-6 w-6 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="mt-3 font-medium text-slate-900 dark:text-slate-100">{t('common.takeExam') || 'Làm bài kiểm tra'}</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('mastery.testKnowledge') || 'Kiểm tra kiến thức của bạn'}
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                {t('common.start') || 'Bắt đầu'}
              </Button>
            </Card>
          </PageGrid>
        </PageSection>
      </div>
    </DashboardLayoutWrapper>
  )
}
