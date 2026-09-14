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
  Avatar,
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
  DiagnosisCard,
  EvidenceChainView,
  TeacherOverrideModal,
  TeacherExplanationCard,
} from '@/components/ui'
import { useLanguage } from '@/components/providers/language-provider'
import { useAuth } from '@/lib/auth/AuthContext'
import { api } from '@/lib/api/apiClient'
import { getStudent, getClass } from '@/lib/api/classes'
import { getStudentDiagnoses, getStudentEvidence } from '@/lib/api/bkt'
import { bktService } from '@/services/bkt'
import { getMockInterventions, getMockDiagnoses, getEvidenceByIds, getStudentDiagnosisSummary } from '@/lib/teacher-helpers'
import { formatRelativeTime, getMasteryLevel } from '@/lib/utils'
import { listExams, getExamResults, getAttemptResults, type ExamRecord, type ExamResultSummary, type ExamResultDetail, type AttemptStatus } from '@/lib/api/exam'
import type { UserRole, BreadcrumbItem, TopicMastery, InterventionGroup } from '@/types'
import type { Diagnosis, TeacherOverride } from '@/types'

/**
 * Topic Mastery Card Component
 */
interface TopicMasteryCardProps {
  topic: {
    topicId: string
    topicNameVi: string
    pKnown: number
    masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
    evidenceCount: number
    lastActivity: Date | string
  }
}

const TopicMasteryCard: React.FC<TopicMasteryCardProps> = ({ topic }) => {
  const masteryLevel = getMasteryLevel(topic.pKnown)
  
  const levelColors = {
    mastered: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-700 dark:text-success-300',
      icon: '#059669',
    },
    learning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: '#D97706',
    },
    'needs-support': {
      bg: 'bg-error-50 dark:bg-error-900/20',
      border: 'border-error-200 dark:border-error-800',
      text: 'text-error-700 dark:text-error-300',
      icon: '#DC2626',
    },
    unknown: {
      bg: 'bg-slate-50 dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      text: 'text-slate-500 dark:text-slate-400',
      icon: '#64748B',
    },
  }

  const colors = levelColors[topic.masteryLevel]

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-shadow hover:shadow-md',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={cn('font-medium', colors.text)}>
            {topic.topicNameVi}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {topic.evidenceCount} bằng chứng
          </p>
        </div>
        <div className="text-right">
          <p className={cn('text-lg font-bold', colors.text)}>
            {Math.round(topic.pKnown * 100)}%
          </p>
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.icon }}
          />
        </div>
      </div>
      <div className="mt-3">
        <MasteryBar pKnown={topic.pKnown} size="sm" />
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Cập nhật: {formatRelativeTime(topic.lastActivity)}
      </p>
    </div>
  )
}

/**
 * Intervention Card for Student
 */
interface StudentInterventionCardProps {
  intervention: {
    id: string
    rootCauseVi: string
    severity: 'high' | 'medium' | 'low'
    skills: string[]
    status: 'pending' | 'in-progress' | 'resolved'
    createdAt: Date | string
  }
}

const StudentInterventionCard: React.FC<StudentInterventionCardProps> = ({ intervention }) => {
  const severityColors = {
    high: 'border-l-4 border-l-error-500 bg-error-50 dark:bg-error-900/20',
    medium: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
    low: 'border-l-4 border-l-info-500 bg-info-50 dark:bg-info-900/20',
  }

  const severityBadge = {
    high: 'error' as const,
    medium: 'warning' as const,
    low: 'info' as const,
  }

  const severityLabel = {
    high: 'Nghiêm trọng',
    medium: 'Trung bình',
    low: 'Nhẹ',
  }

  const statusLabel = {
    pending: 'Chờ xử lý',
    'in-progress': 'Đang xử lý',
    resolved: 'Đã giải quyết',
  }

  return (
    <div className={cn('rounded-lg border p-4', severityColors[intervention.severity])}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {intervention.rootCauseVi}
          </h4>
          <div className="mt-2 flex flex-wrap gap-1">
            {intervention.skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={severityBadge[intervention.severity]} size="sm">
            {severityLabel[intervention.severity]}
          </Badge>
          <Badge
            variant={
              intervention.status === 'resolved' ? 'success' :
              intervention.status === 'in-progress' ? 'info' : 'warning'
            }
            size="sm"
          >
            {statusLabel[intervention.status]}
          </Badge>
        </div>
      </div>
    </div>
  )
}

/**
 * Student Mastery View Page
 */

// Adapter type to map real API response to UI expectations
interface AdaptedStudentData {
  id: string
  name: string
  code: string
  classId: string | null
  overallMastery: number
  topicMasteries: Array<{
    topicId: string
    topicNameVi: string
    pKnown: number
    masteryLevel: 'mastered' | 'learning' | 'needs-support' | 'unknown'
    evidenceCount: number
    lastActivity: Date | string
  }>
  lastActive: Date | string
  assessmentCount: number
  interventionCount: number
}

export default function StudentMasteryPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string
  const { t } = useLanguage()
  const { user } = useAuth()

  // User display object with fallback for null user
  const userDisplay = {
    name: user?.name || 'Teacher',
    email: user?.email || '',
    role: 'teacher' as UserRole,
  }

  // State for student and class data
  const [studentData, setStudentData] = React.useState<{
    student: AdaptedStudentData | null
    classData: Awaited<ReturnType<typeof getClass>> | null
  }>({ student: null, classData: null })
  const [studentLoading, setStudentLoading] = React.useState(true)
  const [studentError, setStudentError] = React.useState<string | null>(null)

  // Get interventions for this student
  const [studentInterventions, setStudentInterventions] = React.useState<InterventionGroup[]>([])

  // AI Diagnostic state
  const [activeTab, setActiveTab] = React.useState('mastery')
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<Diagnosis | null>(null)
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = React.useState(false)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = React.useState(false)

  // Exam attempts state
  const [studentAttempts, setStudentAttempts] = React.useState<Array<{
    examId: string;
    examTitle: string;
    results: ExamResultSummary[];
  }>>([]);
  const [examsLoading, setExamsLoading] = React.useState(false);
  const [selectedAttempt, setSelectedAttempt] = React.useState<ExamResultSummary | null>(null);

  // Get AI diagnoses for this student
  const [studentDiagnoses, setStudentDiagnoses] = React.useState<Diagnosis[]>([])
  const [diagnosisSummary, setDiagnosisSummary] = React.useState({
    totalDiagnoses: 0,
    pendingReview: 0,
    highConfidence: 0,
    abstainCount: 0,
  })

  // Helper to get mastery level from pKnown
  const getMasteryFromPKnown = (pKnown: number): 'mastered' | 'learning' | 'needs-support' | 'unknown' => {
    if (pKnown >= 0.8) return 'mastered'
    if (pKnown >= 0.5) return 'learning'
    if (pKnown >= 0.2) return 'needs-support'
    return 'unknown'
  }

  // Fetch student data
  React.useEffect(() => {
    async function fetchStudentData() {
      setStudentLoading(true)
      setStudentError(null)
      try {
        const [student, diagnoses] = await Promise.all([
          getStudent(studentId).catch(() => null),
          getStudentDiagnoses(studentId).catch(() => getMockDiagnoses()),
        ])
        
        // Adapt student data to UI expectations
        const adaptedStudent: AdaptedStudentData | null = student ? {
          id: student.id,
          name: student.name,
          code: student.externalId || student.id.substring(0, 8),
          classId: student.classes?.[0]?.id || null,
          overallMastery: student.progressSummary?.averagePKnown || 0,
          topicMasteries: (student.progressSummary?.skills || []).map((skill) => ({
            topicId: skill.skillId,
            topicNameVi: skill.skillName || skill.skillId,
            pKnown: skill.pKnown || 0,
            masteryLevel: getMasteryFromPKnown(skill.pKnown || 0),
            evidenceCount: skill.evidenceCount || 0,
            lastActivity: new Date().toISOString(),
          })),
          lastActive: new Date().toISOString(),
          assessmentCount: student.progressSummary?.totalAttempts || 0,
          interventionCount: 0,
        } : null
        
        setStudentData({ student: adaptedStudent, classData: null })
        
        // Map diagnoses to UI type (DiagnosisDto -> Diagnosis)
        const adaptedDiagnoses: Diagnosis[] = (diagnoses || []).map((d) => ({
          id: d.id,
          studentId: d.studentId,
          skillId: d.skillId,
          skillName: d.skillName || d.skillId,
          skillNameVi: d.skillName || d.skillId,
          rootCause: 'AI Diagnosis',
          rootCauseVi: 'Chẩn đoán AI',
          confidence: d.confidence,
          abstain: d.status === 'PENDING' && d.evidenceCount === 0,
          status: d.status === 'PENDING' ? 'pending_review' : 'system_conclusion',
          evidenceIds: [],
          createdAt: d.createdAt,
        }))
        setStudentDiagnoses(adaptedDiagnoses)
        
        // Fetch class data if student exists
        if (adaptedStudent?.classId) {
          const classData = await getClass(adaptedStudent.classId).catch(() => null)
          setStudentData(prev => ({ ...prev, classData }))
          
          // Fetch interventions for this class
          const interventions = await bktService.getInterventions({ 
            studentId,
            pageSize: 100 
          }).catch(() => getMockInterventions())
          setStudentInterventions(interventions)
        }
        
        // Calculate diagnosis summary
        setDiagnosisSummary({
          totalDiagnoses: adaptedDiagnoses.length,
          pendingReview: adaptedDiagnoses.filter(d => d.status === 'pending_review').length,
          highConfidence: adaptedDiagnoses.filter(d => !d.abstain && d.confidence >= 0.7).length,
          abstainCount: adaptedDiagnoses.filter(d => d.abstain).length,
        })
      } catch (error) {
        console.error('Failed to fetch student data:', error)
        setStudentError('Không thể tải thông tin học sinh')
      } finally {
        setStudentLoading(false)
      }
    }
    fetchStudentData()
  }, [studentId])

  const student = studentData.student
  const classData = studentData.classData

  // Fetch student's exam attempts
  const fetchStudentExamAttempts = React.useCallback(async () => {
    if (!student?.classId) return;
    setExamsLoading(true);
    try {
      // Get exams for the student's class
      const exams = await listExams({ classId: student.classId });
      
      // Get results for each exam and filter by studentId
      const attemptsData = await Promise.all(
        exams.items.map(async (exam) => {
          try {
            const results = await getExamResults(exam.id);
            // Filter results for this student
            const studentResults = results.filter(r => r.studentId === studentId);
            return {
              examId: exam.id,
              examTitle: exam.title,
              results: studentResults,
            };
          } catch {
            return {
              examId: exam.id,
              examTitle: exam.title,
              results: [],
            };
          }
        })
      );
      
      setStudentAttempts(attemptsData.filter(a => a.results.length > 0));
    } catch (error) {
      console.error('Failed to fetch student exam attempts:', error);
      setStudentAttempts([]);
    } finally {
      setExamsLoading(false);
    }
  }, [student?.classId, studentId]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: classData?.name || t('class.title') || 'Lớp học', labelVi: classData?.name || t('class.title') || 'Lớp học', href: `/teacher/class/${student?.classId}` },
    { label: student?.name || t('teacher.studentDetail') || 'Học sinh', labelVi: student?.name || t('teacher.studentDetail') || 'Học sinh' },
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

  // AI Diagnostic handlers
  const handleViewEvidence = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis)
    setIsEvidenceModalOpen(true)
  }

  const handleOverride = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis)
    setIsOverrideModalOpen(true)
  }

  const handleOverrideSubmit = (override: TeacherOverride) => {
    console.log('Override submitted:', override)
    // In a real app, this would call an API
    setIsOverrideModalOpen(false)
    setSelectedDiagnosis(null)
  }

  // Loading state
  if (studentLoading) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-200 border-t-verve-600"></div>
          <p className="mt-4 text-sm text-slate-500">Đang tải thông tin học sinh...</p>
        </div>
      </DashboardLayoutWrapper>
    )
  }

  // Error or not found state
  if (!student || studentError) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Student not found"
          titleVi={t('errors.studentNotFound') || 'Không tìm thấy học sinh'}
          description="The student you're looking for doesn't exist"
          descriptionVi={t('errors.studentNotFoundDesc') || 'Học sinh bạn đang tìm kiếm không tồn tại'}
          action={
            <Button variant="primary" onClick={() => router.push('/teacher')}>
              {t('common.back') || 'Quay lại Dashboard'}
            </Button>
          }
        />
      </DashboardLayoutWrapper>
    )
  }

  const masteryLevel = getMasteryLevel(student.overallMastery)
  
  const levelLabels = {
    mastered: 'Đã thành thạo',
    learning: 'Đang học',
    'needs-support': 'Cần hỗ trợ',
    unknown: 'Chưa xác định',
  }

  const levelColors = {
    mastered: 'text-success-600 dark:text-success-400',
    learning: 'text-amber-600 dark:text-amber-400',
    'needs-support': 'text-error-600 dark:text-error-400',
    unknown: 'text-slate-400',
  }

  // Sort topics by mastery level (needs-support first)
  const sortedTopics = [...student.topicMasteries].sort((a, b) => {
    const order = { 'needs-support': 0, learning: 1, unknown: 2, mastered: 3 }
    return order[a.masteryLevel] - order[b.masteryLevel]
  })

  // Calculate mastery distribution for this student
  const masteryDistribution: Record<string, number> = {
    mastered: student.topicMasteries.filter((t) => t.masteryLevel === 'mastered').length,
    learning: student.topicMasteries.filter((t) => t.masteryLevel === 'learning').length,
    needsSupport: student.topicMasteries.filter((t) => t.masteryLevel === 'needs-support').length,
    unknown: student.topicMasteries.filter((t) => t.masteryLevel === 'unknown').length,
  }

  // AI Diagnostic stats
  const pendingReviewCount = studentDiagnoses.filter(d => d.status === 'pending_review').length
  const abstentionCount = studentDiagnoses.filter(d => d.abstain || d.status === 'abstained').length
  const highPriorityCount = studentDiagnoses.filter(d => !d.abstain && d.confidence >= 0.7).length

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
          title={student.name}
          titleVi={student.name}
          description={`${student.code} • ${classData?.name || 'Lớp chưa xác định'}`}
          descriptionVi={`${student.code} • ${classData?.name || 'Lớp chưa xác định'}`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Lịch sử học tập
              </Button>
              {(student.interventionCount > 0 || studentDiagnoses.length > 0) && (
                <Button variant="primary" size="sm">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Can thiệp
                </Button>
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'exams' && studentAttempts.length === 0) {
            fetchStudentExamAttempts();
          }
        }}>
          <TabsList>
            <TabsTrigger value="mastery">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Thành thạo
            </TabsTrigger>
            <TabsTrigger value="ai">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Chẩn đoán AI
              {pendingReviewCount > 0 && (
                <Badge variant="warning" size="sm" className="ml-1.5">
                  {pendingReviewCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="exams">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Bài kiểm tra
            </TabsTrigger>
          </TabsList>

          {/* Mastery Tab */}
          <TabsContent value="mastery" className="space-y-6">
            {/* Student Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Mastery Ring */}
              <Card variant="default" padding="lg">
                <div className="flex flex-col items-center">
                  <MasteryRingIndicator
                    pKnown={student.overallMastery}
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
                      Mức độ thành thạo tổng thể
                    </p>
                  </div>
                </div>
              </Card>

              {/* Student Stats */}
              <Card variant="default" padding="lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Thông tin học sinh
                </h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Lớp</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {classData?.name || 'Chưa phân lớp'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Mã học sinh</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{student.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Hoạt động cuối</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatRelativeTime(student.lastActive)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Số bài đánh giá</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{student.assessmentCount}</span>
                  </div>
                  {student.interventionCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Can thiệp</span>
                      <Badge variant="error" size="sm">{student.interventionCount}</Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Mastery Distribution */}
              <Card variant="default" padding="lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Phân bổ thành thạo theo chủ đề
                </h4>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-success-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Đã thành thạo</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {masteryDistribution.mastered}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Đang học</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {masteryDistribution.learning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-error-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Cần hỗ trợ</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {masteryDistribution.needsSupport}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Tổng chủ đề</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {student.topicMasteries.length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Topic Mastery Section */}
            <PageSection title="Mastery by Topic" titleVi="Mức độ thành thạo theo chủ đề">
              {sortedTopics.length > 0 ? (
                <PageGrid columns={3} gap="md">
                  {sortedTopics.map((topic) => (
                    <TopicMasteryCard key={topic.topicId} topic={topic} />
                  ))}
                </PageGrid>
              ) : (
                <EmptyState
                  title="No topic data"
                  titleVi="Chưa có dữ liệu chủ đề"
                  description="Start assessments to see topic mastery"
                  descriptionVi="Bắt đầu đánh giá để xem mức độ thành thạo theo chủ đề"
                />
              )}
            </PageSection>

            {/* Interventions Section */}
            {studentInterventions.length > 0 && (
              <PageSection title="Interventions" titleVi="Can thiệp cần thiết">
                <div className="space-y-4">
                  {studentInterventions.map((intervention) => (
                    <StudentInterventionCard
                      key={intervention.id}
                      intervention={intervention}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/teacher/interventions')}
                    className="w-full"
                  >
                    Xem tất cả can thiệp
                  </Button>
                </div>
              </PageSection>
            )}

            {/* Recent Activity - Redirect to Exams Tab */}
            <PageSection title="Recent Assessments" titleVi="Bài đánh giá gần đây">
              <Card variant="default" padding="md">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                    Xem kết quả bài kiểm tra
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Chuyển sang tab "Bài kiểm tra" để xem chi tiết kết quả và tiến độ học tập
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setActiveTab('exams')}
                  >
                    Đi đến Bài kiểm tra
                  </Button>
                </div>
              </Card>
            </PageSection>
          </TabsContent>

          {/* AI Diagnostic Tab */}
          <TabsContent value="ai" className="space-y-6">
            {/* AI Diagnostic Overview */}
            <div className="grid gap-4 lg:grid-cols-4">
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tổng chẩn đoán</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {studentDiagnoses.length}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </Card>
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chờ duyệt</p>
                    <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {pendingReviewCount}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chưa đủ dữ liệu</p>
                    <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-400">
                      {abstentionCount}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Độ tin cậy cao</p>
                    <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                      {highPriorityCount}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
                    <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Badge Info */}
            <Card variant="default" padding="md" className="border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-primary-700 dark:text-primary-300">
                    Chẩn đoán AI là gì?
                  </h4>
                  <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">
                    Hệ thống phân tích các bài làm của học sinh để xác định nguyên nhân gốc rễ của các lỗi sai. 
                    Bạn có thể xem chi tiết bằng chứng, duyệt hoặc điều chỉnh kết luận của hệ thống.
                  </p>
                </div>
              </div>
            </Card>

            {/* Diagnoses List */}
            {studentDiagnoses.length > 0 ? (
              <div className="space-y-4">
                {studentDiagnoses.map((diagnosis) => (
                  <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    showActions
                    onViewEvidence={handleViewEvidence}
                    onOverride={handleOverride}
                  />
                ))}
              </div>
            ) : (
              <Card variant="default" padding="lg">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                    Chưa có chẩn đoán AI
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Hệ thống sẽ tự động phân tích khi học sinh hoàn thành đủ bài đánh giá
                  </p>
                </div>
              </Card>
            )}

            {/* Evidence Detail Modal */}
            <EvidenceDetailModal
              diagnosis={selectedDiagnosis}
              isOpen={isEvidenceModalOpen}
              onClose={() => {
                setIsEvidenceModalOpen(false)
                setSelectedDiagnosis(null)
              }}
            />

            {/* Teacher Override Modal */}
            <TeacherOverrideModal
              isOpen={isOverrideModalOpen}
              onClose={() => {
                setIsOverrideModalOpen(false)
                setSelectedDiagnosis(null)
              }}
              diagnosis={selectedDiagnosis}
              onOverride={handleOverrideSubmit}
            />

            {/* Exam Attempt Detail Modal */}
            <AttemptDetailModal
              attempt={selectedAttempt}
              isOpen={!!selectedAttempt}
              onClose={() => setSelectedAttempt(null)}
            />
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            {examsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : studentAttempts.length === 0 ? (
              <Card variant="default" padding="lg">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                    Chưa có kết quả bài kiểm tra
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Học sinh chưa hoàn thành bài kiểm tra nào trong lớp này
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {studentAttempts.map(({ examId, examTitle, results }) => (
                  <Card key={examId} variant="default" padding="none">
                    <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {examTitle}
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/50">
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Điểm
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                              Trạng thái
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                              Nộp lúc
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result) => {
                            const statusConfig: Record<AttemptStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
                              IN_PROGRESS: { label: 'Đang làm', variant: 'info' },
                              SUBMITTED: { label: 'Đã nộp', variant: 'warning' },
                              GRADED: { label: 'Đã chấm', variant: 'success' },
                              MANUAL_REVIEW: { label: 'Cần duyệt', variant: 'error' },
                              COMPLETED: { label: 'Hoàn thành', variant: 'success' },
                            };
                            const status = statusConfig[result.status];
                            return (
                              <tr key={result.attemptId} className="border-b border-slate-200 dark:border-slate-700">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      'font-semibold',
                                      result.passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                                    )}>
                                      {result.score}/{result.maxScore}
                                    </span>
                                    <Badge variant={result.passed ? 'success' : 'error'} size="sm">
                                      {result.percentage.toFixed(0)}%
                                    </Badge>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  <Badge variant={status.variant} size="sm">
                                    {status.label}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                  <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {result.submittedAt ? formatRelativeTime(result.submittedAt) : '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedAttempt(result)}>
                                    Chi tiết
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWrapper>
  )
}

/**
 * Evidence Detail Modal for Student Page
 */
interface EvidenceDetailModalProps {
  diagnosis: Diagnosis | null
  isOpen: boolean
  onClose: () => void
}

function EvidenceDetailModal({ diagnosis, isOpen, onClose }: EvidenceDetailModalProps) {
  if (!isOpen || !diagnosis) return null

  const evidenceItems = diagnosis.evidenceItems || getEvidenceByIds(diagnosis.evidenceIds)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chi tiết bằng chứng
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {diagnosis.skillNameVi || diagnosis.skillName}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <EvidenceChainView evidenceItems={evidenceItems} diagnosisId={diagnosis.id} />

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Exam Attempt Detail Modal for Student Page
 */
interface AttemptDetailModalProps {
  attempt: ExamResultSummary | null
  isOpen: boolean
  onClose: () => void
}

function AttemptDetailModal({ attempt, isOpen, onClose }: AttemptDetailModalProps) {
  const [result, setResult] = React.useState<ExamResultDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !attempt) return;
    
    const attemptId = attempt.attemptId;
    
    async function fetchAttemptResult() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttemptResults(attemptId);
        setResult(data);
      } catch (err) {
        console.error('Failed to fetch attempt results:', err);
        setError('Không thể tải kết quả bài làm');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAttemptResult();
  }, [attempt]);

  if (!isOpen || !attempt) return null;

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chi tiết kết quả bài kiểm tra
            </h2>
            {result && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {result.examTitle}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )}
          
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-center text-error-700 dark:border-error-800 dark:bg-error-900/20 dark:text-error-300">
              {error}
            </div>
          )}
          
          {result && !loading && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-4">
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Điểm</p>
                  <p className={cn(
                    'mt-1 text-2xl font-bold',
                    result.passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                  )}>
                    {result.score}/{result.maxScore}
                  </p>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Phần trăm</p>
                  <p className={cn(
                    'mt-1 text-2xl font-bold',
                    result.passed ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                  )}>
                    {result.percentage.toFixed(0)}%
                  </p>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Trạng thái</p>
                  <div className="mt-1">
                    <Badge variant={result.passed ? 'success' : 'error'} size="sm">
                      {result.passed ? 'Đạt' : 'Không đạt'}
                    </Badge>
                  </div>
                </Card>
                <Card variant="default" padding="md">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Số câu</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {result.answers.length}
                  </p>
                </Card>
              </div>
              
              {/* Time Info */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bắt đầu</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.startedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nộp lúc</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chấm điểm</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(result.gradedAt)}
                  </p>
                </div>
              </div>
              
              {/* Question Results */}
              {result.answers && result.answers.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Chi tiết câu hỏi
                  </h3>
                  <div className="space-y-3">
                    {result.answers.map((answer, index) => (
                      <div
                        key={answer.questionId}
                        className={cn(
                          'rounded-lg border p-4',
                          answer.isCorrect 
                            ? 'border-success-200 bg-success-50/50 dark:border-success-800 dark:bg-success-900/10'
                            : 'border-error-200 bg-error-50/50 dark:border-error-800 dark:bg-error-900/10'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Câu {index + 1}
                              </span>
                              <Badge variant={answer.isCorrect ? 'success' : 'error'} size="sm">
                                {answer.isCorrect ? 'Đúng' : 'Sai'}
                              </Badge>
                            </div>
                            
                            {/* Selected options */}
                            {answer.selectedOptions && answer.selectedOptions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Đáp án đã chọn:</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                  {answer.selectedOptions.join(', ')}
                                </p>
                              </div>
                            )}

                            {/* Text answer */}
                            {answer.textAnswer && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Câu trả lời:</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                  {answer.textAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <span className={cn(
                              'text-lg font-bold',
                              answer.isCorrect ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                            )}>
                              {answer.pointsEarned ?? 0}/1
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                  Chưa có dữ liệu chi tiết câu hỏi
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
