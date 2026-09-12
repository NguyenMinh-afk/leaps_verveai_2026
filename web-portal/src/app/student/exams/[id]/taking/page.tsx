'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Card,
  Button,
  Badge,
} from '@/components/ui'
import { useToast, ConfirmationDialog } from '@/components/ui/toast'
import { examService } from '@/services/exam'
import { mockStudentProfile, getExamById } from '@/data/student-mock-data'
import { useLanguage } from '@/components/providers/language-provider'
import type { ExamSession } from '@/services/exam'
import type { UserRole, Question } from '@/types'

/**
 * Exam Taking Page
 */
export default function ExamTakingPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string
  const [currentRole] = React.useState<UserRole>('student')
  const { t } = useLanguage()

  const { success, error: showError } = useToast()
  
  // Exam session state
  const [session, setSession] = React.useState<ExamSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [result, setResult] = React.useState<any>(null)

  const student = mockStudentProfile
  const exam = getExamById(examId)

  // Start exam on mount
  React.useEffect(() => {
    if (exam && exam.status === 'available') {
      startExam()
    } else {
      setIsLoading(false)
    }
  }, [examId])

  // Timer effect
  React.useEffect(() => {
    if (session && session.timeLimit && !session.isSubmitted && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [session, timeRemaining])

  const startExam = async () => {
    if (!exam) return
    
    setIsLoading(true)
    try {
      const response = await examService.startExam(examId, exam)
      if (response.success && response.session) {
        setSession(response.session)
        setAnswers({})
        setCurrentQuestionIndex(0)
        if (response.session.timeLimit) {
          setTimeRemaining(response.session.timeLimit * 60)
        }
        success(t('common.success') || 'Thành công', t('exam.examStarted') || 'Bài kiểm tra đã bắt đầu')
      } else {
        showError(t('common.error') || 'Lỗi', response.error || t('exam.cannotStartExam') || 'Không thể bắt đầu bài kiểm tra')
        router.push('/student/exams')
      }
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('exam.errorStarting') || 'Đã xảy ra lỗi khi bắt đầu bài kiểm tra')
      router.push('/student/exams')
    } finally {
      setIsLoading(false)
    }
  }

  const currentQuestion = session?.questions[currentQuestionIndex]

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
    examService.selectAnswer(questionId, optionIndex)
  }

  const handleClearAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[questionId]
      return newAnswers
    })
    examService.clearAnswer(questionId)
  }

  const handleNext = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)
    
    try {
      const response = await examService.submitExam()
      if (response.success && response.result) {
        setResult(response.result)
        setSession((prev) => prev ? { ...prev, isSubmitted: true } : null)
        success(t('common.success') || 'Thành công', t('exam.examSubmitted') || 'Bài kiểm tra đã được nộp')
      } else {
        showError(t('common.error') || 'Lỗi', response.error || t('exam.cannotSubmit') || 'Không thể nộp bài kiểm tra')
      }
    } catch (err) {
      showError(t('common.error') || 'Lỗi', t('exam.errorSubmitting') || 'Đã xảy ra lỗi khi nộp bài kiểm tra')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => {
    examService.clearSession()
    router.push('/student/exams')
  }

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Count answered questions
  const answeredCount = Object.keys(answers).length
  const totalQuestions = session?.questions.length || 0

  // Show result screen
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Card variant="default" padding="lg" className="text-center">
            <div className="mb-6">
              <div className={cn(
                'mx-auto flex h-24 w-24 items-center justify-center rounded-full',
                result.percentage >= 80 ? 'bg-success-100 dark:bg-success-900/30' :
                result.percentage >= 60 ? 'bg-warning-100 dark:bg-warning-900/30' :
                'bg-error-100 dark:bg-error-900/30'
              )}>
                <span className={cn(
                  'text-4xl font-bold',
                  result.percentage >= 80 ? 'text-success-600 dark:text-success-400' :
                  result.percentage >= 60 ? 'text-warning-600 dark:text-warning-400' :
                  'text-error-600 dark:text-error-400'
                )}>
                  {result.percentage}%
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('exam.examResult') || 'Kết quả bài kiểm tra'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {exam?.titleVi}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {result.correct || (result.score && result.maxScore ? Math.round(result.score / result.maxScore * 100) : 0)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.correct') || 'Đúng'}</p>
              </div>
              <div className="p-4 bg-error-50 dark:bg-error-900/20 rounded-lg">
                <p className="text-2xl font-bold text-error-600 dark:text-error-400">
                  {result.incorrect || (result.score !== undefined ? (result.maxScore - result.score) : 0)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam.incorrect') || 'Sai'}</p>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                  {result.maxScore || totalQuestions}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.total') || 'Tổng cộng'}</p>
              </div>
            </div>

            {result.timeSpentMinutes && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t('common.timeSpent') || 'Thời gian làm bài'}: {result.timeSpentMinutes} {t('mastery.minutes') || 'phút'}
              </p>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/student/exams')}>
                {t('common.backToList') || 'Quay lại danh sách'}
              </Button>
              <Button variant="primary" onClick={handleExit}>
                {t('common.continueLearning') || 'Tiếp tục học'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-12 w-12 animate-spin text-verve-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{t('common.loadingExam') || 'Đang tải bài kiểm tra...'}</p>
        </div>
      </div>
    )
  }

  // No session / exam not found
  if (!session || !exam) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card variant="default" padding="lg" className="text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t('exam.examNotFound') || 'Không tìm thấy bài kiểm tra'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('exam.notExistOrUnavailable') || 'Bài kiểm tra không tồn tại hoặc không khả dụng.'}
          </p>
          <Button variant="primary" onClick={() => router.push('/student/exams')}>
            {t('common.backToList') || 'Quay lại danh sách'}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                {exam.titleVi}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('common.question') || 'Câu'} {currentQuestionIndex + 1} / {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className={cn(
                  'px-4 py-2 rounded-lg font-mono font-bold',
                  timeRemaining < 60 ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}>
                  {formatTime(timeRemaining)}
                </div>
              )}
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isSubmitting}
              >
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Question Navigator - Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="default" padding="md">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                {t('common.questionNavigator') || 'Điều hướng câu hỏi'}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((eq, index) => {
                  const isAnswered = answers[eq.questionId] !== undefined
                  const isCurrent = index === currentQuestionIndex
                  return (
                    <button
                      key={eq.id}
                      onClick={() => handleGoToQuestion(index)}
                      className={cn(
                        'h-10 rounded-lg text-sm font-medium transition-colors',
                        isCurrent
                          ? 'bg-verve-600 text-white'
                          : isAnswered
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-success-100 dark:bg-success-900/30"></div>
                  <span>{t('common.answered') || 'Đã trả lời'} ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800"></div>
                  <span>{t('common.unanswered') || 'Chưa trả lời'} ({totalQuestions - answeredCount})</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-2">
            {currentQuestion && (
              <Card variant="default" padding="lg">
                <div className="mb-6">
                  <Badge variant="outline" size="sm" className="mb-2">
                    {t('common.question') || 'Câu hỏi'} {currentQuestionIndex + 1}
                  </Badge>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {currentQuestion.question.contentVi || currentQuestion.question.content}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.question.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.questionId] === index
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(currentQuestion.questionId, index)}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 text-left transition-all',
                          isSelected
                            ? 'border-verve-600 bg-verve-50 dark:bg-verve-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                            isSelected
                              ? 'bg-verve-600 text-white'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          )}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className={cn(
                            'flex-1',
                            isSelected ? 'font-medium text-verve-700 dark:text-verve-300' : 'text-slate-700 dark:text-slate-300'
                          )}>
                            {option.contentVi || option.content}
                          </span>
                          {isSelected && (
                            <svg className="w-5 h-5 text-verve-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Clear answer button */}
                {answers[currentQuestion.questionId] !== undefined && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearAnswer(currentQuestion.questionId)}
                    >
                      {t('common.clearAnswer') || 'Xóa câu trả lời'}
                    </Button>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('common.previous') || 'Câu trước'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                  >
                    {t('common.next') || 'Câu sau'}
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleSubmit}
        title={t('exam.submitExam') || 'Nộp bài kiểm tra'}
        titleVi={t('exam.submitExam') || 'Nộp bài kiểm tra'}
        message={`${t('common.youAnswered') || 'Bạn đã trả lời'} ${answeredCount} / ${totalQuestions} ${t('exam.questions') || 'câu hỏi'}. ${t('common.confirmSubmit') || 'Bạn có chắc muốn nộp bài?'}`}
        messageVi={`${t('common.youAnswered') || 'Bạn đã trả lời'} ${answeredCount} / ${totalQuestions} ${t('exam.questions') || 'câu hỏi'}. ${t('common.confirmSubmit') || 'Bạn có chắc muốn nộp bài?'}`}
        confirmLabel={t('common.submit') || 'Nộp bài'}
        confirmLabelVi={t('common.submit') || 'Nộp bài'}
        variant="default"
        isLoading={isSubmitting}
      />
    </div>
  )
}
