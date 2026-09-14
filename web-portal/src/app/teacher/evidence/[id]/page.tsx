'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
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
} from '@/components/ui'
import { MasteryBar } from '@/components/ui'
import * as bktApi from '@/lib/api/bkt'
import type { Evidence, EvidenceChain, DiagnosisDto, BKTSkill } from '@/lib/api/bkt'
import { authService } from '@/services/auth'
import type { UserRole, BreadcrumbItem } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

/**
 * Evidence chain step component
 */
interface EvidenceStepProps {
  step: {
    evidenceId: string
    itemId: string
    correct: boolean | null
    pKnownBefore: number
    pKnownAfter: number
    confidenceBefore: number
    confidenceAfter: number
    quality: string
    createdAt: string
  }
  index: number
}

const EvidenceStep: React.FC<EvidenceStepProps> = ({ step, index }) => {
  const isVietnamese = useIsVietnamese()
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(isVietnamese ? 'vi-VN' : 'en-US')
  }

  return (
    <div className="flex gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
          step.correct === true 
            ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
            : step.correct === false
            ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
        )}>
          {step.correct === true ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : step.correct === false ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span>?</span>
          )}
        </div>
        {index < 999 && <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-700" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Câu hỏi' : 'Question'} #{index + 1}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ID: {step.itemId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={step.quality === 'HIGH' ? 'success' : step.quality === 'MEDIUM' ? 'warning' : 'default'}
              size="sm"
            >
              {step.quality}
            </Badge>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatDate(step.createdAt)}
            </span>
          </div>
        </div>

        {/* BKT State Change */}
        <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {isVietnamese ? 'Độ thành thạo trước' : 'Mastery before'}
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {Math.round(step.pKnownBefore * 100)}%
            </span>
          </div>
          <MasteryBar pKnown={step.pKnownBefore} size="sm" className="mt-1" />
          
          <div className="mt-2 flex items-center justify-center">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {isVietnamese ? 'Độ thành thạo sau' : 'Mastery after'}
            </span>
            <span className={cn(
              'font-medium',
              step.pKnownAfter > step.pKnownBefore ? 'text-success-600 dark:text-success-400' :
              step.pKnownAfter < step.pKnownBefore ? 'text-error-600 dark:text-error-400' :
              'text-slate-900 dark:text-slate-100'
            )}>
              {Math.round(step.pKnownAfter * 100)}%
              {step.pKnownAfter > step.pKnownBefore && ' ↑'}
              {step.pKnownAfter < step.pKnownBefore && ' ↓'}
            </span>
          </div>
          <MasteryBar pKnown={step.pKnownAfter} size="sm" className="mt-1" />
        </div>

        {/* Confidence change */}
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {isVietnamese ? 'Độ tin cậy trước' : 'Confidence before'}: {Math.round(step.confidenceBefore * 100)}%
          </span>
          <span>
            {isVietnamese ? 'Độ tin cậy sau' : 'Confidence after'}: {Math.round(step.confidenceAfter * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Teacher Evidence Detail Page
 */
export default function TeacherEvidenceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const evidenceId = params.id as string
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [evidence, setEvidence] = React.useState<Evidence | null>(null)
  const [evidenceChain, setEvidenceChain] = React.useState<EvidenceChain | null>(null)
  const [skill, setSkill] = React.useState<BKTSkill | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch evidence data
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

        if (!evidenceId) {
          setError('Evidence ID is required')
          return
        }

        // Fetch evidence detail and chain in parallel
        const [evidenceData, chainData] = await Promise.all([
          bktApi.getEvidence(evidenceId).catch(() => null),
          bktApi.getEvidenceChain(evidenceId).catch(() => null),
        ])

        if (!evidenceData) {
          setError('Evidence not found')
          return
        }

        setEvidence(evidenceData)
        setEvidenceChain(chainData)

        // Fetch skill details if we have a diagnosis
        if (chainData?.skillId) {
          const skillData = await bktApi.getSkill(chainData.skillId).catch(() => null)
          setSkill(skillData)
        }
      } catch (err) {
        console.error('Failed to load evidence:', err)
        setError(err instanceof Error ? err.message : 'Failed to load evidence')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router, evidenceId])

  // User display object for DashboardLayoutWrapper
  const userDisplay = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  } : { name: 'Teacher', email: '', role: 'teacher' as UserRole }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('common.dashboard') || 'Trang chủ', labelVi: t('common.dashboard') || 'Trang chủ', href: '/' },
    { label: isVietnamese ? 'Bằng chứng' : 'Evidence', labelVi: 'Bằng chứng', href: '/teacher/evidence' },
    { label: evidenceId ? evidenceId.substring(0, 8) + '...' : 'Detail', labelVi: 'Chi tiết' },
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
    router.push('/teacher/settings')
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

  if (error || !evidence) {
    return (
      <DashboardLayoutWrapper
        user={userDisplay}
        breadcrumbs={breadcrumbs}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
      >
        <EmptyState
          title="Error loading evidence"
          titleVi="Lỗi khi tải bằng chứng"
          description={error || 'Evidence not found'}
          descriptionVi={error || 'Không tìm thấy bằng chứng'}
          action={
            <Button variant="primary" onClick={() => router.back()}>
              {isVietnamese ? 'Quay lại' : 'Go back'}
            </Button>
          }
        />
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
          title="Evidence Detail"
          titleVi="Chi tiết bằng chứng"
          description="View the complete evidence chain for this diagnostic"
          descriptionVi="Xem chuỗi bằng chứng đầy đủ cho chẩn đoán này"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {isVietnamese ? 'Quay lại' : 'Go back'}
              </Button>
            </div>
          }
        />

        {/* Evidence Summary Card */}
        <Card variant="default" padding="md">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isVietnamese ? 'ID Bằng chứng' : 'Evidence ID'}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                {evidence.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isVietnamese ? 'ID Câu hỏi' : 'Item ID'}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                {evidence.itemId}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isVietnamese ? 'Chất lượng' : 'Quality'}
              </p>
              <div className="mt-1">
                <Badge 
                  variant={
                    evidence.quality === 'HIGH' ? 'success' : 
                    evidence.quality === 'MEDIUM' ? 'warning' : 
                    'default'
                  }
                >
                  {evidence.quality}
                </Badge>
              </div>
            </div>
          </div>

          {evidence.extractedAnswer && (
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isVietnamese ? 'Câu trả lời trích xuất' : 'Extracted Answer'}
              </p>
              <p className="mt-1 text-slate-900 dark:text-slate-100">
                {evidence.extractedAnswer}
              </p>
            </div>
          )}

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Kết quả' : 'Result'}
                </p>
                <div className="mt-1">
                  {evidence.correct === true && (
                    <Badge variant="success">{isVietnamese ? 'Đúng' : 'Correct'}</Badge>
                  )}
                  {evidence.correct === false && (
                    <Badge variant="error">{isVietnamese ? 'Sai' : 'Incorrect'}</Badge>
                  )}
                  {evidence.correct === null && (
                    <Badge variant="default">{isVietnamese ? 'Chưa đánh giá' : 'Pending'}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Độ tin cậy' : 'Confidence'}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {Math.round(evidence.confidence * 100)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Current BKT State */}
        {evidenceChain && (
          <Card variant="default" padding="md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Trạng thái BKT hiện tại' : 'Current BKT State'}
            </h3>
            
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Độ thành thạo hiện tại' : 'Current Mastery'}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(evidenceChain.currentPKnown * 100)}%
                </p>
                <MasteryBar pKnown={evidenceChain.currentPKnown} size="md" className="mt-2" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese ? 'Trạng thái hiện tại' : 'Current Status'}
                </p>
                <div className="mt-1">
                  <Badge 
                    variant={
                      evidenceChain.currentStatus === 'MASTERED' ? 'success' :
                      evidenceChain.currentStatus === 'DIAGNOSED' ? 'warning' :
                      evidenceChain.currentStatus === 'STRUGGLING' ? 'error' :
                      'default'
                    }
                  >
                    {evidenceChain.currentStatus}
                  </Badge>
                </div>
              </div>
              {skill && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isVietnamese ? 'Kỹ năng' : 'Skill'}
                  </p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                    {skill.name}
                  </p>
                  {skill.code && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {skill.code}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Evidence Chain */}
        {evidenceChain && evidenceChain.steps.length > 0 && (
          <PageSection 
            title="Evidence Chain" 
            titleVi="Chuỗi bằng chứng"
          >
            <Card variant="default" padding="md">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {isVietnamese 
                  ? 'Quá trình tích lũy bằng chứng và cập nhật độ thành thạo'
                  : 'Evidence accumulation process and mastery updates'}
              </p>
              
              <div className="mt-4">
                {evidenceChain.steps.map((step, index) => (
                  <EvidenceStep key={step.evidenceId} step={step} index={index} />
                ))}
              </div>
            </Card>
          </PageSection>
        )}

        {/* Related Actions */}
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/teacher/students/${evidenceChain?.studentId}`)}
          >
            {isVietnamese ? 'Xem học sinh' : 'View Student'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/teacher/interventions')}
          >
            {isVietnamese ? 'Xem can thiệp' : 'View Interventions'}
          </Button>
        </div>
      </div>
    </DashboardLayoutWrapper>
  )
}
