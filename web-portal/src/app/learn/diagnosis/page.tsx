'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Card, Button, Badge } from '@/components/ui'
import { MasteryBar } from '@/components/ui'
import * as diagnosisApi from '@/lib/api/diagnosis'
import * as bktApi from '@/lib/api/bkt'
import { authService } from '@/services/auth'
import type { UserRole } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

// Helper to check if current language is Vietnamese
function useIsVietnamese() {
  const { language } = useLanguage()
  return language === 'vi'
}

// Diagnosis session types (re-export from API)
type DiagnosisStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
type MasteryLevel = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING'

interface DiagnosisResult {
  pKnown: number
  status: MasteryLevel
  confidence: number
  recommendations: string[]
}

interface DiagnosisSession {
  id: string
  skillId: string
  skillName: string
  status: DiagnosisStatus
  questionsAnswered: number
  totalQuestions: number
  currentPKnown: number
  result: DiagnosisResult | null
}

interface DiagnosisQuestion {
  id: string
  content: string
  options?: Array<{ id: string; text: string }>
}

interface Skill {
  id: string
  code: string
  name: string
  difficulty: number
}

/**
 * Learn Diagnosis Page
 * Student diagnostic assessment flow using real API
 */
export default function LearnDiagnosisPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const isVietnamese = useIsVietnamese()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; name: string; email: string; role: UserRole } | null>(null)
  const [sessions, setSessions] = React.useState<DiagnosisSession[]>([])
  const [availableSkills, setAvailableSkills] = React.useState<Skill[]>([])
  const [selectedSession, setSelectedSession] = React.useState<DiagnosisSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [questions, setQuestions] = React.useState<DiagnosisQuestion[]>([])
  const [answer, setAnswer] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Check session and load diagnosis sessions
  React.useEffect(() => {
    async function loadData() {
      try {
        const session = await authService.getSession()
        
        if (!session?.user) {
          router.push('/learn/login')
          return
        }
        
        setCurrentUser({
          id: session.user.id || '',
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        })

        // Load student's existing diagnosis sessions
        try {
          const existingSessions = await diagnosisApi.getStudentDiagnosisSessions()
          setSessions(existingSessions)
        } catch (err) {
          console.warn('Failed to load diagnosis sessions:', err)
          // Continue with empty sessions
          setSessions([])
        }

        // Load available skills for new diagnosis
        try {
          const skillsResponse = await bktApi.listSkills(1, 50)
          setAvailableSkills(skillsResponse.data)
        } catch (err) {
          console.warn('Failed to load skills:', err)
          // Continue with empty skills
          setAvailableSkills([])
        }
      } catch (err) {
        console.error('Failed to load diagnosis:', err)
        setError(err instanceof Error ? err.message : 'Failed to load diagnosis')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  // Handle starting a new diagnosis session
  const handleStartNewDiagnosis = async (skill: Skill) => {
    if (!currentUser) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      // Start a new diagnosis session
      // Get questions from the content service based on skill
      const skillQuestions = await diagnosisApi.getDiagnosisQuestions(skill.id, 5)
      
      // If no questions available, we can't start the diagnosis
      if (skillQuestions.length === 0) {
        setError(isVietnamese 
          ? 'Không có câu hỏi chẩn đoán cho kỹ năng này.' 
          : 'No diagnostic questions available for this skill.')
        return
      }
      
      const questionIds = skillQuestions.map(q => q.id)
      
      const newSession = await diagnosisApi.startDiagnosisSession({
        skillId: skill.id,
        skillName: skill.name,
        questionIds,
        totalQuestions: skillQuestions.length,
      })
      
      // Get questions for this skill
      try {
        const skillQuestions = await diagnosisApi.getDiagnosisQuestions(skill.id, 5)
        setQuestions(skillQuestions)
      } catch {
        // If no questions available, we'll show a message
        setQuestions([])
      }

      setSelectedSession(newSession)
      setSessions(prev => [newSession, ...prev.filter(s => s.skillId !== skill.id)])
      setCurrentQuestion(newSession.questionsAnswered)
      setAnswer('')
    } catch (err) {
      console.error('Failed to start diagnosis:', err)
      setError(err instanceof Error ? err.message : 'Failed to start diagnosis')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resuming an existing session
  const handleResumeSession = async (session: DiagnosisSession) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Refresh session from API
      const refreshedSession = await diagnosisApi.getDiagnosisSession(session.id)
      setSelectedSession(refreshedSession)
      setCurrentQuestion(refreshedSession.questionsAnswered)
      setAnswer('')
      
      // Load questions
      try {
        const skillQuestions = await diagnosisApi.getDiagnosisQuestions(refreshedSession.skillId, 5)
        setQuestions(skillQuestions)
      } catch {
        setQuestions([])
      }
    } catch (err) {
      console.error('Failed to resume session:', err)
      setError(err instanceof Error ? err.message : 'Failed to resume session')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle submitting an answer
  const handleSubmitAnswer = async () => {
    if (!selectedSession || !answer.trim()) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Get question from the current session
      const questionId = questions[currentQuestion]?.id || `q-${currentQuestion}`
      
      // SECURITY: The server determines correctness server-side.
      // Client only sends questionId and answer.
      const updatedSession = await diagnosisApi.submitDiagnosisAnswer(selectedSession.id, {
        questionId,
        answer: answer.trim(),
        // SECURITY: isCorrect is NOT sent - server determines correctness
      })
      
      setSelectedSession(updatedSession)
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s))
      setAnswer('')
      
      // Move to next question or complete
      if (updatedSession.questionsAnswered >= updatedSession.totalQuestions) {
        // Session complete, finalize it
        const completedSession = await diagnosisApi.completeDiagnosisSession(selectedSession.id)
        setSelectedSession(completedSession)
        setSessions(prev => prev.map(s => s.id === completedSession.id ? completedSession : s))
      } else {
        setCurrentQuestion(prev => prev + 1)
      }
    } catch (err) {
      console.error('Failed to submit answer:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle completing a session manually
  const handleCompleteSession = async () => {
    if (!selectedSession) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const completedSession = await diagnosisApi.completeDiagnosisSession(selectedSession.id)
      setSelectedSession(completedSession)
      setSessions(prev => prev.map(s => s.id === completedSession.id ? completedSession : s))
    } catch (err) {
      console.error('Failed to complete session:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete session')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle exiting a session
  const handleExitSession = () => {
    setSelectedSession(null)
    setCurrentQuestion(0)
    setAnswer('')
    setQuestions([])
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-verve-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">{isVietnamese ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  // Session active - show diagnosis flow
  if (selectedSession) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl">
          {/* Session Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedSession.skillName}
              </h2>
              <Button variant="outline" size="sm" onClick={handleExitSession}>
                {isVietnamese ? 'Thoát' : 'Exit'}
              </Button>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{isVietnamese ? 'Tiến độ' : 'Progress'}</span>
                <span>{selectedSession.questionsAnswered} / {selectedSession.totalQuestions}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div 
                  className="h-full rounded-full bg-verve-600 transition-all"
                  style={{ width: `${(selectedSession.questionsAnswered / selectedSession.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Mastery */}
            <div className="mt-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {isVietnamese ? 'Độ thành thạo hiện tại' : 'Current Mastery'}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(selectedSession.currentPKnown * 100)}%
                </span>
              </div>
              <MasteryBar pKnown={selectedSession.currentPKnown} size="md" className="mt-2" />
            </div>
          </div>

          {/* Result or Question */}
          {selectedSession.status === 'COMPLETED' && selectedSession.result ? (
            // Show result
            <Card variant="default" padding="lg">
              <div className="text-center">
                <div className={cn(
                  'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
                  selectedSession.result.status === 'MASTERED'
                    ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                    : selectedSession.result.status === 'DIAGNOSED'
                    ? 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400'
                )}>
                  {selectedSession.result.status === 'MASTERED' ? (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : selectedSession.result.status === 'DIAGNOSED' ? (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedSession.result.status === 'MASTERED'
                    ? (isVietnamese ? 'Chúc mừng!' : 'Congratulations!')
                    : selectedSession.result.status === 'DIAGNOSED'
                    ? (isVietnamese ? 'Đã chẩn đoán' : 'Diagnosed')
                    : (isVietnamese ? 'Cần ôn luyện thêm' : 'Needs More Practice')
                  }
                </h3>

                <div className="mt-4">
                  <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(selectedSession.result.pKnown * 100)}%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isVietnamese ? 'Độ thành thạo' : 'Mastery Level'}
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isVietnamese ? 'Độ tin cậy' : 'Confidence'}: {Math.round(selectedSession.result.confidence * 100)}%
                  </p>
                </div>

                {selectedSession.result.recommendations.map((rec, idx) => (
                  <div key={idx} className="mt-4 rounded-lg bg-verve-50 p-4 text-left dark:bg-verve-900/20">
                    <p className="text-sm text-verve-800 dark:text-verve-200">{rec}</p>
                  </div>
                ))}

                <div className="mt-6 flex justify-center gap-4">
                  <Button variant="outline" onClick={handleExitSession}>
                    {isVietnamese ? 'Quay lại' : 'Back'}
                  </Button>
                  <Button variant="primary" onClick={() => router.push('/student')}>
                    {isVietnamese ? 'Tiếp tục học' : 'Continue Learning'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : questions.length === 0 ? (
            // No questions available
            <Card variant="default" padding="lg">
              <div className="text-center py-8">
                <svg className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                  {isVietnamese ? 'Chưa có câu hỏi' : 'No Questions Available'}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {isVietnamese 
                    ? 'Câu hỏi chẩn đoán cho kỹ năng này chưa được thiết lập.'
                    : 'Diagnostic questions for this skill have not been set up yet.'}
                </p>
                <Button variant="outline" className="mt-4" onClick={handleExitSession}>
                  {isVietnamese ? 'Quay lại' : 'Go Back'}
                </Button>
              </div>
            </Card>
          ) : (
            // Show question
            <Card variant="default" padding="lg">
              <div className="mb-4">
                <Badge variant="default">
                  {isVietnamese ? 'Câu' : 'Question'} {currentQuestion + 1} / {selectedSession.totalQuestions}
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {questions[currentQuestion]?.content || (isVietnamese ? 'Câu hỏi không có sẵn' : 'Question not available')}
                </h3>
              </div>

              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={isVietnamese ? 'Nhập câu trả lời của bạn...' : 'Enter your answer...'}
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-verve-500 focus:outline-none focus:ring-2 focus:ring-verve-500"
                  rows={3}
                />

                {error && (
                  <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                )}

                <div className="flex gap-3">
                  {selectedSession.questionsAnswered > 0 && currentQuestion === 0 && (
                    <Button 
                      variant="outline"
                      onClick={handleCompleteSession}
                      disabled={isSubmitting}
                    >
                      {isVietnamese ? 'Kết thúc sớm' : 'End Early'}
                    </Button>
                  )}
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || isSubmitting}
                  >
                    {isSubmitting 
                      ? (isVietnamese ? 'Đang chấm...' : 'Grading...') 
                      : (isVietnamese ? 'Nộp câu trả lời' : 'Submit Answer')
                    }
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Show session list
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isVietnamese ? 'Chẩn đoán kỹ năng' : 'Skill Diagnosis'}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {isVietnamese 
              ? 'Hoàn thành các bài chẩn đoán để xác định kỹ năng cần ôn luyện'
              : 'Complete diagnostic assessments to identify skills that need practice'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-4 text-error-600 dark:bg-error-900/20 dark:text-error-400">
            {error}
          </div>
        )}

        {/* Existing Sessions */}
        {sessions.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Phiên chẩn đoán của bạn' : 'Your Diagnosis Sessions'}
            </h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  variant="interactive" 
                  padding="md"
                  onClick={() => session.status !== 'COMPLETED' && handleResumeSession(session)}
                  className={cn(
                    session.status === 'COMPLETED' && 'opacity-75'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {session.skillName}
                      </h3>
                      
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              session.status === 'COMPLETED' ? 'success' :
                              session.status === 'IN_PROGRESS' ? 'warning' :
                              'default'
                            }
                            size="sm"
                          >
                            {session.status === 'COMPLETED'
                              ? (isVietnamese ? 'Hoàn thành' : 'Completed')
                              : session.status === 'IN_PROGRESS'
                              ? (isVietnamese ? 'Đang làm' : 'In Progress')
                              : (isVietnamese ? 'Chưa bắt đầu' : 'Not Started')
                            }
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {session.questionsAnswered} / {session.totalQuestions}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {isVietnamese ? 'Độ thành thạo' : 'Mastery'}: {Math.round(session.currentPKnown * 100)}%
                        </span>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div 
                            className={cn(
                              'h-full rounded-full',
                              session.currentPKnown >= 0.8 ? 'bg-success-500' :
                              session.currentPKnown >= 0.5 ? 'bg-amber-500' :
                              'bg-error-500'
                            )}
                            style={{ width: `${session.currentPKnown * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant={session.status === 'NOT_STARTED' ? 'primary' : 'outline'} 
                      size="sm"
                      disabled={session.status === 'COMPLETED'}
                      onClick={() => handleResumeSession(session)}
                    >
                      {session.status === 'NOT_STARTED'
                        ? (isVietnamese ? 'Bắt đầu' : 'Start')
                        : session.status === 'IN_PROGRESS'
                        ? (isVietnamese ? 'Tiếp tục' : 'Continue')
                        : (isVietnamese ? 'Xem lại' : 'Review')
                      }
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Skills for New Diagnosis */}
        {availableSkills.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Bắt đầu chẩn đoán mới' : 'Start New Diagnosis'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableSkills.slice(0, 6).map((skill) => {
                // Don't show skills that already have a session
                const hasSession = sessions.some(s => s.skillId === skill.id)
                if (hasSession) return null
                
                return (
                  <Card 
                    key={skill.id} 
                    variant="interactive" 
                    padding="md"
                    onClick={isSubmitting ? undefined : () => handleStartNewDiagnosis(skill)}
                    className={cn(isSubmitting && 'opacity-50 cursor-not-allowed')}
                  >
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {skill.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {skill.code}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        {isVietnamese ? 'Độ khó' : 'Difficulty'}: {skill.difficulty}
                      </Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* No sessions and no skills */}
        {sessions.length === 0 && availableSkills.length === 0 && !error && (
          <Card variant="default" padding="lg" className="text-center">
            <svg className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
              {isVietnamese ? 'Chưa có phiên chẩn đoán' : 'No Diagnosis Sessions'}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isVietnamese 
                ? 'Liên hệ quản trị viên để thiết lập các kỹ năng và câu hỏi chẩn đoán.'
                : 'Contact an administrator to set up diagnostic skills and questions.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
