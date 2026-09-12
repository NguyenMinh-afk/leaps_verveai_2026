'use client'

import * as React from 'react'
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
  InterventionCard,
  InterventionCardCompact,
  InterventionCardGroup,
  InterventionSummary,
  InterventionFilter,
} from '@/components/ui'
import {
  DiagnosisCard,
  EvidenceChainView,
  TeacherOverrideModal,
  TeacherExplanationCard,
  DiagnosticInterventionCard,
} from '@/components/ui'
import { useLanguage } from '@/components/providers/language-provider'
import {
  mockInterventions,
  mockStudents,
} from '@/data/teacher-mock-data'
import {
  mockDiagnosticInterventions,
  mockDiagnoses,
  getEvidenceByIds,
} from '@/data/ai-diagnostic-mock-data'
import { formatRelativeTime } from '@/lib/utils'
import type { UserRole, BreadcrumbItem, SeverityLevel } from '@/types'
import type { InterventionGroup, Diagnosis, TeacherOverride, DiagnosticInterventionGroup } from '@/types'

/**
 * AI Diagnostic Intervention Detail Modal
 */
interface DiagnosticInterventionDetailModalProps {
  intervention: DiagnosticInterventionGroup | null
  isOpen: boolean
  onClose: () => void
  onViewEvidence: (diagnosis: Diagnosis) => void
  onOverride: (diagnosis: Diagnosis) => void
}

const DiagnosticInterventionDetailModal: React.FC<DiagnosticInterventionDetailModalProps> = ({
  intervention,
  isOpen,
  onClose,
  onViewEvidence,
  onOverride,
}) => {
  const { t } = useLanguage()
  const [selectedDiagnosisId, setSelectedDiagnosisId] = React.useState<string | null>(null)

  if (!isOpen || !intervention) return null

  const selectedDiagnosis = selectedDiagnosisId
    ? intervention.diagnoses.find(d => d.id === selectedDiagnosisId)
    : intervention.diagnoses[0]

  const severityColors = {
    high: 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800',
    medium: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    low: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800',
  }

  const severityLabels = {
    high: t('interventions.high'),
    medium: t('interventions.medium'),
    low: t('interventions.low'),
  }

  const statusLabels = {
    pending: t('interventions.pending'),
    'in-progress': t('interventions.active'),
    resolved: t('interventions.resolved'),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 my-8 w-full max-w-4xl rounded-xl bg-card shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-xl border-b border-slate-200 bg-card p-6 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('diagnosis.title')} - {t('interventions.viewDetails')}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatRelativeTime(intervention.createdAt)}
            </p>
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

        <div className="flex flex-col lg:flex-row">
          {/* Left column - Intervention Info */}
          <div className="w-full border-r border-slate-200 p-6 dark:border-slate-700 lg:w-1/2">
            <div className={cn('rounded-lg border p-4', severityColors[intervention.severity])}>
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  variant={
                    intervention.severity === 'high' ? 'error' :
                    intervention.severity === 'medium' ? 'warning' : 'info'
                  }
                >
                  {severityLabels[intervention.severity]}
                </Badge>
                <Badge
                  variant={
                    intervention.status === 'resolved' ? 'success' :
                    intervention.status === 'in-progress' ? 'info' : 'warning'
                  }
                >
                  {statusLabels[intervention.status]}
                </Badge>
                {/* AI badge */}
                <Badge variant="primary" size="sm" className="gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Diagnostic
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {intervention.rootCauseVi || intervention.rootCause}
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {intervention.evidenceSummaryVi || intervention.evidenceSummary}
              </p>

              {/* Confidence info */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Độ tin cậy trung bình:
                </span>
                <span className={cn(
                  'font-medium',
                  intervention.confidenceLevel === 'high' ? 'text-success-600 dark:text-success-400' :
                  intervention.confidenceLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                  'text-error-600 dark:text-error-400'
                )}>
                  {Math.round(intervention.averageConfidence * 100)}%
                </span>
              </div>

              {/* Non-knowledge flag */}
              {intervention.hasNonKnowledgeCases && (
                <div className="mt-3">
                  <Badge variant="warning" size="sm" className="gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {intervention.nonKnowledgeCount || 'Có'} trường hợp nghi ngờ không phải lỗ hổng kiến thức
                  </Badge>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kỹ năng liên quan
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {intervention.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Học sinh ({intervention.size})
                </h4>
                <div className="mt-2 space-y-1">
                  {intervention.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {student.name}
                      </span>
                      <span className="text-xs text-slate-500">{student.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Diagnosis Details */}
          <div className="w-full p-6 lg:w-1/2">
            {/* Diagnosis selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Chọn học sinh để xem chi tiết
              </label>
              <select
                value={selectedDiagnosis?.id || ''}
                onChange={(e) => setSelectedDiagnosisId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                {intervention.diagnoses.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.studentName || 'Unknown'} - {d.skillNameVi || d.skillName}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosis Card */}
            {selectedDiagnosis && (
              <div className="space-y-4">
                <DiagnosisCard
                  diagnosis={selectedDiagnosis}
                  showStudentInfo
                  showActions
                  onViewEvidence={onViewEvidence}
                  onOverride={onOverride}
                />

                {/* Teacher Explanation */}
                {selectedDiagnosis.explanation && (
                  <TeacherExplanationCard explanation={selectedDiagnosis.explanation} />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {intervention.status === 'pending' && (
            <Button variant="primary">
              Bắt đầu xử lý
            </Button>
          )}
          {intervention.status === 'in-progress' && (
            <Button variant="success">
              Hoàn tất can thiệp
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Evidence Detail Modal
 */
interface EvidenceDetailModalProps {
  diagnosis: Diagnosis | null
  isOpen: boolean
  onClose: () => void
}

const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  diagnosis,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !diagnosis) return null

  const evidenceItems = diagnosis.evidenceItems || getEvidenceByIds(diagnosis.evidenceIds)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chuỗi bằng chứng
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {diagnosis.studentName} - {diagnosis.skillNameVi || diagnosis.skillName}
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
 * Intervention Center Page
 */
export default function InterventionCenterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [severityFilter, setSeverityFilter] = React.useState<SeverityLevel | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState<'pending' | 'in-progress' | 'resolved' | 'all'>('all')
  const [activeTab, setActiveTab] = React.useState('ai')
  
  // Legacy intervention state
  const [selectedIntervention, setSelectedIntervention] = React.useState<InterventionGroup | null>(null)
  const [isLegacyModalOpen, setIsLegacyModalOpen] = React.useState(false)
  
  // AI diagnostic state
  const [selectedDiagnosticIntervention, setSelectedDiagnosticIntervention] = React.useState<DiagnosticInterventionGroup | null>(null)
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = React.useState(false)
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<Diagnosis | null>(null)
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = React.useState(false)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = React.useState(false)
  
  const [currentRole] = React.useState<UserRole>('teacher')

  // Filter legacy interventions
  const filteredLegacyInterventions = React.useMemo(() => {
    return mockInterventions.filter((intervention) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          intervention.rootCause.toLowerCase().includes(query) ||
          intervention.rootCauseVi.toLowerCase().includes(query) ||
          intervention.skills.some(s => s.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      if (severityFilter !== 'all' && intervention.severity !== severityFilter) return false
      if (statusFilter !== 'all' && intervention.status !== statusFilter) return false
      return true
    })
  }, [searchQuery, severityFilter, statusFilter])

  // Filter AI diagnostic interventions
  const filteredDiagnosticInterventions = React.useMemo(() => {
    return mockDiagnosticInterventions.filter((intervention) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          intervention.rootCause.toLowerCase().includes(query) ||
          intervention.rootCauseVi.toLowerCase().includes(query) ||
          intervention.skills.some(s => s.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      if (severityFilter !== 'all' && intervention.severity !== severityFilter) return false
      if (statusFilter !== 'all' && intervention.status !== statusFilter) return false
      return true
    })
  }, [searchQuery, severityFilter, statusFilter])

  // Group legacy interventions by severity
  const highPriority = filteredLegacyInterventions.filter(i => i.severity === 'high')
  const mediumPriority = filteredLegacyInterventions.filter(i => i.severity === 'medium')
  const lowPriority = filteredLegacyInterventions.filter(i => i.severity === 'low')

  // Stats
  const legacyStats = React.useMemo(() => ({
    total: mockInterventions.length,
    pending: mockInterventions.filter(i => i.status === 'pending').length,
    inProgress: mockInterventions.filter(i => i.status === 'in-progress').length,
    resolved: mockInterventions.filter(i => i.status === 'resolved').length,
  }), [])

  const diagnosticStats = React.useMemo(() => ({
    total: mockDiagnosticInterventions.length,
    pending: mockDiagnosticInterventions.filter(i => i.status === 'pending').length,
    inProgress: mockDiagnosticInterventions.filter(i => i.status === 'in-progress').length,
    resolved: mockDiagnosticInterventions.filter(i => i.status === 'resolved').length,
  }), [])

  const user = {
    name: 'Giáo viên Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: t('teacher.title'), labelVi: t('teacher.title'), href: '/teacher' },
    { label: t('interventions.title') || 'Can thiệp', labelVi: t('interventions.title') || 'Can thiệp' },
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

  // Legacy handlers
  const handleViewLegacyDetails = (intervention: InterventionGroup) => {
    setSelectedIntervention(intervention)
    setIsLegacyModalOpen(true)
  }

  // AI diagnostic handlers
  const handleViewDiagnosticDetails = (intervention: DiagnosticInterventionGroup) => {
    setSelectedDiagnosticIntervention(intervention)
    setIsDiagnosticModalOpen(true)
  }

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

  const closeDiagnosticModal = () => {
    setIsDiagnosticModalOpen(false)
    setSelectedDiagnosticIntervention(null)
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
          title="Intervention Center"
          titleVi={t('interventions.title') || 'Trung tâm Can thiệp'}
          description="Review and manage student interventions with AI diagnostics"
          descriptionVi={t('interventions.manageDescription') || 'Xem xét và quản lý các can thiệp học sinh với chẩn đoán AI'}
          actions={
            <Button variant="primary" size="sm" onClick={() => router.push('/teacher/interventions/create')}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('interventions.create') || 'Tạo can thiệp mới'}
            </Button>
          }
        />

        {/* Tab Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="ai">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Diagnostic
            </TabsTrigger>
            <TabsTrigger value="legacy">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Standard
            </TabsTrigger>
          </TabsList>

          {/* AI Diagnostic Tab */}
          <TabsContent value="ai" className="space-y-6">
            {/* Summary Stats */}
            <Card variant="default" padding="md">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{diagnosticStats.total}</p>
                  <p className="text-xs font-medium text-slate-500">{t('interventions.total') || 'Tổng cộng'}</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{diagnosticStats.pending}</p>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">{t('interventions.pending') || 'Chờ xử lý'}</p>
                </div>
                <div className="rounded-lg bg-info-100 p-3 dark:bg-info-900/30">
                  <p className="text-2xl font-bold text-info-700 dark:text-info-300">{diagnosticStats.inProgress}</p>
                  <p className="text-xs font-medium text-info-600 dark:text-info-400">{t('interventions.inProgress') || 'Đang xử lý'}</p>
                </div>
                <div className="rounded-lg bg-success-100 p-3 dark:bg-success-900/30">
                  <p className="text-2xl font-bold text-success-700 dark:text-success-300">{diagnosticStats.resolved}</p>
                  <p className="text-xs font-medium text-success-600 dark:text-success-400">{t('interventions.resolved') || 'Đã giải quyết'}</p>
                </div>
              </div>
            </Card>

            {/* Filters */}
            <Card variant="default" padding="md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  <Input
                    placeholder="Tìm kiếm can thiệp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                  <InterventionFilter
                    severity={severityFilter}
                    status={statusFilter}
                    onSeverityChange={setSeverityFilter}
                    onStatusChange={setStatusFilter}
                  />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredDiagnosticInterventions.length} kết quả
                </div>
              </div>
            </Card>

            {/* AI Diagnostic Interventions */}
            {filteredDiagnosticInterventions.length > 0 ? (
              <PageGrid columns={2} gap="md">
                {filteredDiagnosticInterventions.map((intervention) => (
                  <DiagnosticInterventionCard
                    key={intervention.id}
                    intervention={intervention}
                    onViewDetails={handleViewDiagnosticDetails}
                    onViewStudent={(studentId) => router.push(`/teacher/students/${studentId}`)}
                  />
                ))}
              </PageGrid>
            ) : (
              <EmptyState
                title="No AI diagnostic interventions"
                titleVi="Không có can thiệp chẩn đoán AI"
                description="AI diagnostic interventions will appear here when students have completed assessments"
                descriptionVi="Các can thiệp chẩn đoán AI sẽ xuất hiện ở đây khi học sinh hoàn thành đánh giá"
              />
            )}
          </TabsContent>

          {/* Legacy Tab */}
          <TabsContent value="legacy" className="space-y-6">
            {/* Summary Stats */}
            <Card variant="default" padding="md">
              <InterventionSummary stats={legacyStats} />
            </Card>

            {/* Filters */}
            <Card variant="default" padding="md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  <Input
                    placeholder="Tìm kiếm can thiệp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                  <InterventionFilter
                    severity={severityFilter}
                    status={statusFilter}
                    onSeverityChange={setSeverityFilter}
                    onStatusChange={setStatusFilter}
                  />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredLegacyInterventions.length} kết quả
                </div>
              </div>
            </Card>

            {/* High Priority Interventions */}
            {highPriority.length > 0 && (
              <PageSection title="Cần can thiệp ngay" titleVi="Cần can thiệp ngay">
                <PageGrid columns={2} gap="md">
                  {highPriority.map((intervention) => (
                    <InterventionCard
                      key={intervention.id}
                      intervention={intervention}
                      onViewDetails={() => handleViewLegacyDetails(intervention)}
                      onAssign={() => handleViewLegacyDetails(intervention)}
                    />
                  ))}
                </PageGrid>
              </PageSection>
            )}

            {/* Medium Priority Interventions */}
            {mediumPriority.length > 0 && (
              <PageSection title="Cần theo dõi" titleVi="Cần theo dõi">
                <PageGrid columns={2} gap="md">
                  {mediumPriority.map((intervention) => (
                    <InterventionCard
                      key={intervention.id}
                      intervention={intervention}
                      onViewDetails={() => handleViewLegacyDetails(intervention)}
                      onAssign={() => handleViewLegacyDetails(intervention)}
                    />
                  ))}
                </PageGrid>
              </PageSection>
            )}

            {/* Low Priority Interventions */}
            {lowPriority.length > 0 && (
              <PageSection title="Cần lưu ý" titleVi="Cần lưu ý">
                <PageGrid columns={2} gap="md">
                  {lowPriority.map((intervention) => (
                    <InterventionCard
                      key={intervention.id}
                      intervention={intervention}
                      onViewDetails={() => handleViewLegacyDetails(intervention)}
                      onAssign={() => handleViewLegacyDetails(intervention)}
                    />
                  ))}
                </PageGrid>
              </PageSection>
            )}

            {/* Empty State */}
            {filteredLegacyInterventions.length === 0 && (
              <EmptyState
                title="No interventions found"
                titleVi="Không tìm thấy can thiệp nào"
                description="Try adjusting your filters or search query"
                descriptionVi="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSeverityFilter('all')
                      setStatusFilter('all')
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Legacy Intervention Detail Modal */}
      <LegacyInterventionDetailModal
        intervention={selectedIntervention}
        isOpen={isLegacyModalOpen}
        onClose={() => {
          setIsLegacyModalOpen(false)
          setSelectedIntervention(null)
        }}
      />

      {/* AI Diagnostic Intervention Detail Modal */}
      <DiagnosticInterventionDetailModal
        intervention={selectedDiagnosticIntervention}
        isOpen={isDiagnosticModalOpen}
        onClose={closeDiagnosticModal}
        onViewEvidence={handleViewEvidence}
        onOverride={handleOverride}
      />

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
    </DashboardLayoutWrapper>
  )
}

/**
 * Legacy Intervention Detail Modal (kept for backward compatibility)
 */
interface LegacyInterventionDetailModalProps {
  intervention: InterventionGroup | null
  isOpen: boolean
  onClose: () => void
}

const LegacyInterventionDetailModal: React.FC<LegacyInterventionDetailModalProps> = ({
  intervention,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !intervention) return null

  const severityColors = {
    high: 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800',
    medium: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    low: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800',
  }

  const severityLabels = {
    high: 'Nghiêm trọng',
    medium: 'Trung bình',
    low: 'Nhẹ',
  }

  const statusLabels = {
    pending: 'Chờ xử lý',
    'in-progress': 'Đang xử lý',
    resolved: 'Đã giải quyết',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Chi tiết can thiệp
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatRelativeTime(intervention.createdAt)}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={cn('rounded-lg border p-4', severityColors[intervention.severity])}>
          <div className="mb-3 flex items-center gap-2">
            <Badge
              variant={
                intervention.severity === 'high' ? 'error' :
                intervention.severity === 'medium' ? 'warning' : 'info'
              }
            >
              {severityLabels[intervention.severity]}
            </Badge>
            <Badge
              variant={
                intervention.status === 'resolved' ? 'success' :
                intervention.status === 'in-progress' ? 'info' : 'warning'
              }
            >
              {statusLabels[intervention.status]}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {intervention.rootCauseVi || intervention.rootCause}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {intervention.evidenceSummaryVi || intervention.evidenceSummary}
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Kỹ năng liên quan
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {intervention.skills.map((skill, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Số học sinh cần can thiệp
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {intervention.size} học sinh
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Hành động được đề xuất
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tạo bài tập bổ sung cho kỹ năng yếu
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Gặp riêng từng học sinh để hỗ trợ
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Theo dõi tiến độ sau can thiệp
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {intervention.status === 'pending' && (
            <Button variant="primary">
              Bắt đầu xử lý
            </Button>
          )}
          {intervention.status === 'in-progress' && (
            <Button variant="success">
              Hoàn tất can thiệp
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
