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
  Avatar,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui'
import {
  MasteryBar,
  MasteryBadge,
  InterventionCard,
} from '@/components/ui'
import {
  getClassById,
  getStudentsByClass,
  mockInterventions,
} from '@/data/teacher-mock-data'
import { formatRelativeTime, getMasteryLevel } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, TeacherStudent, TopicMastery } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

/**
 * Student Row Component
 */
interface StudentRowProps {
  student: TeacherStudent
  onViewDetails: (studentId: string) => void
}

const StudentRow: React.FC<StudentRowProps> = ({ student, onViewDetails }) => {
  const { t } = useLanguage()
  const masteryLevel = getMasteryLevel(student.overallMastery)

  const levelColors = {
    mastered: 'text-success-600 dark:text-success-400',
    learning: 'text-amber-600 dark:text-amber-400',
    'needs-support': 'text-error-600 dark:text-error-400',
    unknown: 'text-slate-400',
  }

  const levelLabels = {
    mastered: t('mastery.mastered') || 'Đã thành thạo',
    learning: t('mastery.learning') || 'Đang học',
    'needs-support': t('mastery.needsSupport') || 'Cần hỗ trợ',
    unknown: t('mastery.unknown') || 'Chưa xác định',
  }

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={student.avatar}
            fallback={student.name}
            size="sm"
          />
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{student.code}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium', levelColors[masteryLevel])}>
            {Math.round(student.overallMastery * 100)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Badge
          variant={
            masteryLevel === 'mastered' ? 'success' :
            masteryLevel === 'learning' ? 'warning' :
            'error'
          }
          size="sm"
        >
          {levelLabels[masteryLevel]}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="w-24">
          <MasteryBar pKnown={student.overallMastery} size="sm" />
        </div>
      </td>
      <td className="px-4 py-3">
        {student.interventionCount > 0 ? (
          <Badge variant="error" size="sm">
            {student.interventionCount}
          </Badge>
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatRelativeTime(student.lastActive)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(student.id)}
          >
            {t('common.view') || 'Xem'}
          </Button>
          <Button variant="ghost" size="icon-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
        </div>
      </td>
    </tr>
  )
}

/**
 * Topic Mastery Row Component
 */
interface TopicMasteryRowProps {
  topic: {
    topicId: string
    topicNameVi: string
    pKnown: number
    masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
    evidenceCount: number
  }
}

const TopicMasteryRow: React.FC<TopicMasteryRowProps> = ({ topic }) => {
  const { t } = useLanguage()
  const masteryLevel = getMasteryLevel(topic.pKnown)

  const levelLabels = {
    mastered: t('mastery.mastered') || 'Đã thành thạo',
    learning: t('mastery.learning') || 'Đang học',
    'needs-support': t('mastery.needsSupport') || 'Cần hỗ trợ',
    unknown: t('mastery.unknown') || 'Chưa xác định',
  }

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700">
      <td className="px-4 py-3">
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {topic.topicNameVi}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-24">
            <MasteryBar pKnown={topic.pKnown} size="sm" />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {Math.round(topic.pKnown * 100)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Badge
          variant={
            masteryLevel === 'mastered' ? 'success' :
            masteryLevel === 'learning' ? 'warning' :
            'error'
          }
          size="sm"
        >
          {levelLabels[masteryLevel]}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {topic.evidenceCount} {t('diagnosis.evidence') || 'bằng chứng'}
        </span>
      </td>
    </tr>
  )
}

/**
 * Class Detail Page
 */
export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentRole] = React.useState<UserRole>('teacher')

  const classData = getClassById(classId)
  const students = getStudentsByClass(classId)
  const interventions = mockInterventions.filter(
    (i) => i.studentIds.some((sid) => students.some((s) => s.id === sid)))
  const classInterventions = interventions.filter(i => i.status !== 'resolved').slice(0, 3)

  // Mock topic data aggregated from students
  const aggregatedTopics = React.useMemo(() => {
    const topicMap = new Map<string, { sum: number; count: number; name: string }>()
    students.forEach((student) => {
      student.topicMasteries.forEach((topic) => {
        const existing = topicMap.get(topic.topicId) || { sum: 0, count: 0, name: topic.topicNameVi }
        existing.sum += topic.pKnown
        existing.count += 1
        existing.name = topic.topicNameVi
        topicMap.set(topic.topicId, existing)
      })
    })
    return Array.from(topicMap.entries()).map(([id, data]) => ({
      topicId: id,
      topicNameVi: data.name,
      pKnown: data.sum / data.count,
      masteryLevel: getMasteryLevel(data.sum / data.count),
      evidenceCount: students.reduce((acc, s) => {
        const tm = s.topicMasteries.find((t: TopicMastery) => t.topicId === id)
        return acc + (tm?.evidenceCount || 0)
      }, 0),
    }))
  }, [students])

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const user = {
    name: 'Giáo viên Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: classData?.name || t('class.title') || 'Lớp học', labelVi: classData?.name || t('class.title') || 'Lớp học' },
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

  const handleViewStudent = (studentId: string) => {
    router.push(`/teacher/students/${studentId}`)
  }

  if (!classData) {
    return (
      <DashboardLayoutWrapper
        user={user}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Class not found"
          titleVi={t('class.notFound') || 'Không tìm thấy lớp học'}
          description="The class you're looking for doesn't exist"
          descriptionVi={t('class.notFoundDesc') || 'Lớp học bạn đang tìm kiếm không tồn tại'}
          action={
            <Button variant="primary" onClick={() => router.push('/teacher')}>
              {t('common.back') || 'Quay lại Dashboard'}
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const masteryLevel = classData.averageMastery >= 0.8 ? 'mastered'
    : classData.averageMastery >= 0.5 ? 'learning'
    : 'needs-support'

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
          title={classData.name}
          titleVi={classData.name}
          description={`${classData.studentCount} ${t('class.students') || 'học sinh'} • ${t('class.grade') || 'Lớp'} ${classData.grade}`}
          descriptionVi={`${classData.studentCount} ${t('class.students') || 'học sinh'} • ${t('class.grade') || 'Lớp'} ${classData.grade}`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('common.edit') || 'Chỉnh sửa'}
              </Button>
              <Button variant="primary" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('exam.create') || 'Tạo bài kiểm tra'}
              </Button>
            </div>
          }
        />

        {/* Class Stats */}
        <PageGrid columns={4} gap="md">
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.studentCount') || 'Số học sinh'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {classData.studentCount}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.avgMastery') || 'Mức độ thành thạo TB'}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {Math.round(classData.averageMastery * 100)}%
            </p>
            <div className="mt-2">
              <MasteryBar pKnown={classData.averageMastery} size="sm" />
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('interventions.needsIntervention') || 'Cần can thiệp'}</p>
            <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">
              {classInterventions.length}
            </p>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('class.lastActivity') || 'Hoạt động cuối'}</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
              {formatRelativeTime(classData.lastActivity)}
            </p>
          </Card>
        </PageGrid>

        {/* Tabs */}
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {t('class.students') || 'Học sinh'}
            </TabsTrigger>
            <TabsTrigger value="topics">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('mastery.topics') || 'Chủ đề'}
            </TabsTrigger>
            <TabsTrigger value="interventions">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t('interventions.title') || 'Can thiệp'}
              {classInterventions.length > 0 && (
                <Badge variant="error" size="sm" className="ml-2">
                  {classInterventions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card variant="default" padding="none">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <Input
                  placeholder={t('common.searchStudents') || 'Tìm kiếm học sinh...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('class.student') || 'Học sinh'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('mastery.level') || 'Mức độ'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                          {t('common.status') || 'Trạng thái'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                          {t('mastery.progress') || 'Tiến độ'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('interventions.title') || 'Can thiệp'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {t('common.activity') || 'Hoạt động'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('common.actions') || 'Thao tác'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <StudentRow
                          key={student.id}
                          student={student}
                          onViewDetails={handleViewStudent}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    {searchQuery ? (t('common.noStudentFound') || 'Không tìm thấy học sinh nào') : (t('class.noStudentsInClass') || 'Chưa có học sinh trong lớp này')}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics">
            <Card variant="default" padding="none">
              {aggregatedTopics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('mastery.topic') || 'Chủ đề'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('mastery.avgLevel') || 'Mức độ TB'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                          {t('common.status') || 'Trạng thái'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                          {t('diagnosis.evidence') || 'Bằng chứng'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregatedTopics.map((topic) => (
                        <TopicMasteryRow key={topic.topicId} topic={topic} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    {t('class.noTopicData') || 'Chưa có dữ liệu chủ đề'}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Interventions Tab */}
          <TabsContent value="interventions">
            {classInterventions.length > 0 ? (
              <div className="space-y-4">
                {classInterventions.map((intervention) => (
                  <InterventionCard
                    key={intervention.id}
                    intervention={intervention}
                    onViewDetails={() => router.push('/teacher/interventions')}
                    onAssign={() => router.push('/teacher/interventions')}
                  />
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/teacher/interventions')}
                  className="w-full"
                >
                  {t('interventions.viewAll') || 'Xem tất cả can thiệp'}
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No interventions needed"
                titleVi={t('class.noInterventions') || 'Không có can thiệp nào'}
                description="All students in this class are doing well"
                descriptionVi={t('class.studentsDoingWell') || 'Tất cả học sinh trong lớp này đều đang tiến bộ tốt'}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWrapper>
  )
}
