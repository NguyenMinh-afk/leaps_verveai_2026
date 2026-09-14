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
import { getMasteryLevel, formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import type { UserRole, BreadcrumbItem, StudentTopicMastery, SubjectMastery, TopicMastery } from '@/types'
import { classService } from '@/services/class'
import * as bktApi from '@/lib/api/bkt'
import { ProgressHistoryLoader } from '@/components/ui/progress-history'

/**
 * Map backend skill to StudentTopicMastery
 */
function mapSkillToTopicMastery(
  skill: bktApi.BKTSkill,
  pKnown: number,
  attemptCount: number
): StudentTopicMastery {
  return {
    topicId: skill.id,
    topicName: skill.name,
    topicNameVi: skill.name,
    subject: 'Mathematics', // Backend doesn't provide subject
    subjectVi: 'Toán học',
    pKnown,
    masteryLevel: getMasteryLevel(pKnown),
    evidenceCount: attemptCount,
    lastActivity: new Date(),
    trend: undefined, // Backend doesn't provide trend
  }
}

/**
 * Map backend skills to SubjectMastery
 * Groups skills by subject (simplified - using single subject for now)
 */
function mapSkillsToSubjects(skills: TopicMastery[]): SubjectMastery[] {
  // For now, create a single "General" subject with all skills
  // Backend doesn't provide subject breakdown
  const totalPKnown = skills.reduce((sum, s) => sum + s.pKnown, 0)
  const avgPKnown = skills.length > 0 ? totalPKnown / skills.length : 0
  const masteredCount = skills.filter(s => s.masteryLevel === 'mastered').length
  const learningCount = skills.filter(s => s.masteryLevel === 'learning').length
  const needsSupportCount = skills.filter(s => s.masteryLevel === 'needs-support').length

  return [{
    subjectId: 'general',
    subjectName: 'Mathematics',
    subjectNameVi: 'Toán học',
    overallMastery: avgPKnown,
    masteryLevel: getMasteryLevel(avgPKnown),
    topicCount: skills.length,
    masteredTopics: masteredCount,
    learningTopics: learningCount,
    needsSupportTopics: needsSupportCount,
  }]
}

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
  onViewHistory?: (topic: StudentTopicMastery) => void
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onViewHistory }) => {
  const { t } = useLanguage()
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

      {/* View Progress History Button */}
      {onViewHistory && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onViewHistory(topic)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t('progress.viewHistory') || 'Xem lịch sử tiến bộ'}
          </button>
        </div>
      )}
    </Card>
  )
}

/**
 * My Mastery Page
 */
export default function MyMasteryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentRole] = React.useState<UserRole>('student')
  const [activeTab, setActiveTab] = React.useState('all')
  const { t } = useLanguage()

  // Real API state
  const [topics, setTopics] = React.useState<StudentTopicMastery[]>([])
  const [subjects, setSubjects] = React.useState<SubjectMastery[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Progress history state
  const [selectedTopic, setSelectedTopic] = React.useState<StudentTopicMastery | null>(null)
  const [showHistory, setShowHistory] = React.useState(false)

  // Fetch mastery data from API
  React.useEffect(() => {
    async function fetchMasteryData() {
      // Get current student's ID from auth context
      const studentId = user?.id
      if (!studentId) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.')
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      setError(null)
      try {
        // Get skills from BKT service and skill summaries from class service
        const [skillSummaries, skillsData] = await Promise.all([
          classService.getStudentSkillSummaries(studentId),
          bktApi.listSkills(1, 100),
        ])

        // Build a map of skillId -> mastery data
        const masteryMap = new Map<string, { pKnown: number; attemptCount: number }>()
        skillSummaries.forEach(s => masteryMap.set(s.skillId, { pKnown: s.pKnown, attemptCount: s.attemptCount }))

        // Map skills with mastery data
        const mappedTopics: StudentTopicMastery[] = skillsData.data.map(skill => {
          const mastery = masteryMap.get(skill.id) || { pKnown: 0.5, attemptCount: 0 }
          return mapSkillToTopicMastery(skill, mastery.pKnown, mastery.attemptCount)
        })

        const mappedSubjects = mapSkillsToSubjects(mappedTopics)
        setTopics(mappedTopics)
        setSubjects(mappedSubjects)
      } catch (err) {
        console.error('Failed to fetch mastery data:', err)
        setError('Không thể tải dữ liệu mức độ thành thạo. Vui lòng thử lại.')
        setTopics([])
        setSubjects([])
      } finally {
        setIsLoading(false)
      }
    }
    
    // Only fetch if user is available
    if (user) {
      fetchMasteryData()
    }
  }, [user])

  // Calculate overall stats
  const stats = React.useMemo(() => {
    const masteredTopics = topics.filter(t => t.masteryLevel === 'mastered')
    const learningTopics = topics.filter(t => t.masteryLevel === 'learning')
    const totalPKnown = topics.reduce((sum, t) => sum + t.pKnown, 0)
    const avgPKnown = topics.length > 0 ? totalPKnown / topics.length : 0
    
    return {
      overallMastery: avgPKnown,
      masteryLevel: getMasteryLevel(avgPKnown),
      masteredCount: masteredTopics.length,
      learningCount: learningTopics.length,
      needsSupportCount: topics.filter(t => t.masteryLevel === 'needs-support').length,
    }
  }, [topics])

  // Group topics by mastery level
  const masteredTopics = topics.filter(t => t.masteryLevel === 'mastered')
  const learningTopics = topics.filter(t => t.masteryLevel === 'learning')
  const needsSupportTopics = topics.filter(t => t.masteryLevel === 'needs-support')

  // Get topics for current tab
  const filteredTopics = React.useMemo(() => {
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

  const student = {
    id: user?.id || '',
    name: user?.name || 'Student',
    email: user?.email || '',
  }

  const userData = {
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

  const handleViewProgressHistory = (topic: StudentTopicMastery) => {
    setSelectedTopic(topic)
    setShowHistory(true)
  }

  const handleCloseProgressHistory = () => {
    setShowHistory(false)
    setSelectedTopic(null)
  }

  const masteryLevel = stats.masteryLevel

  const levelLabels = {
    mastered: t('mastery.mastered') || 'Đã thành thạo',
    learning: t('mastery.learning') || 'Đang học',
    'needs-support': t('mastery.needsSupport') || 'Cần luyện tập thêm',
    unknown: t('common.unknown') || 'Chưa xác định',
  }

  return (
    <DashboardLayoutWrapper
      user={userData}
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

        {/* Loading State */}
        {isLoading && (
          <Card variant="default" padding="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Đang tải dữ liệu mức độ thành thạo...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <Card variant="default" padding="lg" className="border-error-200 dark:border-error-800">
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="h-8 w-8 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-sm text-error-600 dark:text-error-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  const studentId = user?.id
                  if (!studentId) {
                    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.')
                    return
                  }
                  setIsLoading(true)
                  setError(null)
                  Promise.all([
                    classService.getStudentSkillSummaries(studentId),
                    bktApi.listSkills(1, 100),
                  ])
                    .then(([skillSummaries, skillsData]) => {
                      const masteryMap = new Map<string, { pKnown: number; attemptCount: number }>()
                      skillSummaries.forEach(s => masteryMap.set(s.skillId, { pKnown: s.pKnown, attemptCount: s.attemptCount }))
                      const mappedTopics: StudentTopicMastery[] = skillsData.data.map(skill => {
                        const mastery = masteryMap.get(skill.id) || { pKnown: 0.5, attemptCount: 0 }
                        return mapSkillToTopicMastery(skill, mastery.pKnown, mastery.attemptCount)
                      })
                      setTopics(mappedTopics)
                      setSubjects(mapSkillsToSubjects(mappedTopics))
                    })
                    .catch(err => {
                      console.error('Retry failed:', err)
                      setError('Không thể tải dữ liệu. Vui lòng thử lại.')
                    })
                    .finally(() => setIsLoading(false))
                }}
              >
                Thử lại
              </Button>
            </div>
          </Card>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
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
                          {stats.masteredCount}
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
                          {stats.learningCount}
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
                          {stats.needsSupportCount}
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
                    <TopicCard 
                      key={topic.topicId} 
                      topic={topic} 
                      onViewHistory={handleViewProgressHistory}
                    />
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

        {/* Progress History Section */}
        {showHistory && selectedTopic && (
          <PageSection 
            title={t('progress.title') || 'Lịch sử tiến bộ'} 
            titleVi={t('progress.title') || 'Lịch sử tiến bộ'}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedTopic.topicNameVi}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedTopic.subjectVi}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCloseProgressHistory}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('common.close') || 'Đóng'}
              </Button>
            </div>
            <ProgressHistoryLoader
              studentId={student.id}
              skillId={selectedTopic.topicId}
              skillName={selectedTopic.topicNameVi}
              days={30}
            />
          </PageSection>
        )}
          </>
        )}
      </div>
    </DashboardLayoutWrapper>
  )
}
