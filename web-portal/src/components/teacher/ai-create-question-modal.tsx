// ============================================
// VERVE AI - AI Create Question Modal Component
// ============================================

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  Button,
  Input,
  Badge,
} from '@/components/ui'
import type { Question, QuestionOption } from '@/types'
import { useLanguage } from '@/components/providers/language-provider'

/**
 * File types supported for upload
 */
const SUPPORTED_FILE_TYPES = [
  { ext: '.pdf', label: 'PDF' },
  { ext: '.doc', label: 'Word' },
  { ext: '.docx', label: 'Word' },
  { ext: '.ppt', label: 'PowerPoint' },
  { ext: '.pptx', label: 'PowerPoint' },
  { ext: '.csv', label: 'CSV' },
  { ext: '.xlsx', label: 'Excel' },
  { ext: '.txt', label: 'Text' },
]

/**
 * Topic suggestions for autocomplete
 */
const TOPIC_SUGGESTIONS = [
  { id: 't1', name: 'Phép cộng', nameVi: 'Phép cộng' },
  { id: 't2', name: 'Phép trừ', nameVi: 'Phép trừ' },
  { id: 't3', name: 'Phép nhân', nameVi: 'Phép nhân' },
  { id: 't4', name: 'Phép chia', nameVi: 'Phép chia' },
  { id: 't5', name: 'Phân số', nameVi: 'Phân số' },
  { id: 't6', name: 'Số thập phân', nameVi: 'Số thập phân' },
  { id: 't7', name: 'Hình học', nameVi: 'Hình học' },
  { id: 't8', name: 'Đo lường', nameVi: 'Đo lường' },
  { id: 't9', name: 'Tỉ lệ', nameVi: 'Tỉ lệ' },
  { id: 't10', name: 'Phương trình', nameVi: 'Phương trình' },
]

/**
 * Uploaded file interface
 */
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
}

/**
 * Generation options interface
 */
export interface AIGenerationOptions {
  mode: 'topic' | 'document'
  questionCount: number
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  questionType: 'multiple-choice' | 'true-false' | 'short-answer' | 'mixed'
  topicId?: string
  topicName?: string
  topicNameVi?: string
  additionalInstruction?: string
  files?: UploadedFile[]
  fileInstruction?: string
}

/**
 * AI Create Question Modal Props
 */
export interface AICreateQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (options: AIGenerationOptions) => Promise<Question[]>
}

/**
 * AI Create Question Modal Component
 */
export const AICreateQuestionModal: React.FC<AICreateQuestionModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const { t } = useLanguage()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Mode state
  const [mode, setMode] = React.useState<'topic' | 'document'>('topic')

  // Common fields
  const [questionCount, setQuestionCount] = React.useState(5)
  const [difficulty, setDifficulty] = React.useState<AIGenerationOptions['difficulty']>('mixed')
  const [questionType, setQuestionType] = React.useState<AIGenerationOptions['questionType']>('mixed')

  // Mode A - Topic
  const [topicSearch, setTopicSearch] = React.useState('')
  const [selectedTopic, setSelectedTopic] = React.useState<typeof TOPIC_SUGGESTIONS[0] | null>(null)
  const [additionalInstruction, setAdditionalInstruction] = React.useState('')

  // Mode B - Document
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [fileInstruction, setFileInstruction] = React.useState('')
  const [dragActive, setDragActive] = React.useState(false)
  const [fileError, setFileError] = React.useState<string | null>(null)

  // Loading state
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationProgress, setGenerationProgress] = React.useState(0)

  // Filtered topics
  const filteredTopics = TOPIC_SUGGESTIONS.filter(
    (topic) =>
      topic.name.toLowerCase().includes(topicSearch.toLowerCase()) ||
      topic.nameVi.includes(topicSearch)
  )

  // Validation
  const isValid = React.useMemo(() => {
    if (mode === 'topic') {
      return selectedTopic !== null && questionCount > 0 && questionCount <= 20
    } else {
      return uploadedFiles.length > 0 && questionCount > 0 && questionCount <= 20
    }
  }, [mode, selectedTopic, uploadedFiles, questionCount])

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    setFileError(null)

    const newFiles: UploadedFile[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of Array.from(files)) {
      // Check file extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      const isSupported = SUPPORTED_FILE_TYPES.some((t) => t.ext === ext)

      if (!isSupported) {
        setFileError(`Định dạng ${ext} không được hỗ trợ`)
        continue
      }

      // Check file size
      if (file.size > maxSize) {
        setFileError(`File ${file.name} quá lớn (tối đa 10MB)`)
        continue
      }

      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: ext,
      })
    }

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Remove file
  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setFileError(null)
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Handle generate
  const handleGenerate = async () => {
    if (!isValid) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const options: AIGenerationOptions = {
        mode,
        questionCount,
        difficulty,
        questionType,
        additionalInstruction: mode === 'topic' ? additionalInstruction : fileInstruction,
      }

      if (mode === 'topic' && selectedTopic) {
        options.topicId = selectedTopic.id
        options.topicName = selectedTopic.name
        options.topicNameVi = selectedTopic.nameVi
      } else {
        options.files = uploadedFiles
      }

      await onGenerate(options)
      setGenerationProgress(100)

      // Close modal after short delay
      setTimeout(() => {
        handleClose()
      }, 500)
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  // Handle close
  const handleClose = () => {
    // Reset state
    setMode('topic')
    setQuestionCount(5)
    setDifficulty('mixed')
    setQuestionType('mixed')
    setTopicSearch('')
    setSelectedTopic(null)
    setAdditionalInstruction('')
    setUploadedFiles([])
    setFileInstruction('')
    setFileError(null)
    setIsGenerating(false)
    setGenerationProgress(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-card shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-verve-100 dark:bg-verve-900/30">
              <svg className="h-5 w-5 text-verve-600 dark:text-verve-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Tạo câu hỏi với AI
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tạo câu hỏi tự động bằng trí tuệ nhân tạo
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            disabled={isGenerating}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 rounded-xl">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-verve-600"></div>
                <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                  Đang tạo câu hỏi...
                </p>
                <div className="mt-2 mx-auto max-w-xs">
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-verve-600 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{generationProgress}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Chọn phương thức tạo câu hỏi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('topic')}
                disabled={isGenerating}
                className={cn(
                  'flex flex-col items-center rounded-lg border-2 p-4 transition-all',
                  mode === 'topic'
                    ? 'border-verve-600 bg-verve-50 dark:border-verve-500 dark:bg-verve-900/30'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                )}
              >
                <svg className={cn('h-6 w-6 mb-2', mode === 'topic' ? 'text-verve-600' : 'text-slate-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className={cn('font-medium', mode === 'topic' ? 'text-verve-700 dark:text-verve-300' : 'text-slate-700 dark:text-slate-300')}>
                  Theo Chủ đề
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Chọn chủ đề có sẵn
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('document')}
                disabled={isGenerating}
                className={cn(
                  'flex flex-col items-center rounded-lg border-2 p-4 transition-all',
                  mode === 'document'
                    ? 'border-verve-600 bg-verve-50 dark:border-verve-500 dark:bg-verve-900/30'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                )}
              >
                <svg className={cn('h-6 w-6 mb-2', mode === 'document' ? 'text-verve-600' : 'text-slate-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={cn('font-medium', mode === 'document' ? 'text-verve-600 dark:text-verve-300' : 'text-slate-700 dark:text-slate-300')}>
                  Upload Tài liệu
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Tải lên file tài liệu
                </span>
              </button>
            </div>
          </div>

          {/* Common Fields */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Cài đặt chung
            </h3>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Số lượng câu hỏi (1-20)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  disabled={isGenerating}
                  className="flex-1 accent-verve-600"
                />
                <div className="w-12 h-10 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100">
                  {questionCount}
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Độ khó
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'easy', label: 'Dễ', color: 'text-success-600' },
                  { value: 'medium', label: 'Trung bình', color: 'text-amber-600' },
                  { value: 'hard', label: 'Khó', color: 'text-error-600' },
                  { value: 'mixed', label: 'Hỗn hợp', color: 'text-slate-600' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value as AIGenerationOptions['difficulty'])}
                    disabled={isGenerating}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      difficulty === option.value
                        ? 'bg-verve-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Loại câu hỏi
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'multiple-choice', label: 'Trắc nghiệm' },
                  { value: 'true-false', label: 'Đúng/Sai' },
                  { value: 'short-answer', label: 'Tự luận' },
                  { value: 'mixed', label: 'Hỗn hợp' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setQuestionType(option.value as AIGenerationOptions['questionType'])}
                    disabled={isGenerating}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      questionType === option.value
                        ? 'bg-verve-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode A: Topic */}
          {mode === 'topic' && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Theo Chủ đề
              </h3>

              {/* Topic Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Chọn chủ đề <span className="text-error-500">*</span>
                </label>
                <Input
                  placeholder="Tìm kiếm chủ đề..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  disabled={isGenerating}
                  className="mb-2"
                />
                
                {/* Selected Topic */}
                {selectedTopic && (
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-verve-50 border border-verve-200 px-3 py-2 dark:bg-verve-900/30 dark:border-verve-800">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">Đã chọn</Badge>
                      <span className="text-sm font-medium text-verve-700 dark:text-verve-300">
                        {selectedTopic.nameVi}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTopic(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Topic List */}
                {topicSearch && !selectedTopic && (
                  <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {filteredTopics.length > 0 ? (
                      filteredTopics.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setSelectedTopic(topic)
                            setTopicSearch('')
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          {topic.nameVi}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-500">
                        Không tìm thấy chủ đề
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Instruction */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Hướng dẫn thêm (tùy chọn)
                </label>
                <textarea
                  value={additionalInstruction}
                  onChange={(e) => setAdditionalInstruction(e.target.value)}
                  placeholder="VD: Tập trung vào các câu hỏi ứng dụng thực tế..."
                  rows={2}
                  disabled={isGenerating}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Mode B: Document Upload */}
          {mode === 'document' && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Upload Tài liệu
              </h3>

              {/* File Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  'relative rounded-lg border-2 border-dashed p-6 text-center transition-all',
                  dragActive
                    ? 'border-verve-600 bg-verve-50 dark:bg-verve-900/20'
                    : 'border-slate-300 dark:border-slate-600',
                  isGenerating && 'opacity-50'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={SUPPORTED_FILE_TYPES.map((t) => t.ext).join(',')}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  disabled={isGenerating}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-verve-600 dark:text-verve-400">Nhấp để tải lên</span> hoặc kéo thả file
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {SUPPORTED_FILE_TYPES.map((t) => t.ext).join(', ')}
                </p>
              </div>

              {/* Error Message */}
              {fileError && (
                <div className="flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fileError}
                </div>
              )}

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Files đã tải lên ({uploadedFiles.length})
                  </label>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        disabled={isGenerating}
                        className="text-slate-400 hover:text-error-600 disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Instruction */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Hướng dẫn cho AI (tùy chọn)
                </label>
                <textarea
                  value={fileInstruction}
                  onChange={(e) => setFileInstruction(e.target.value)}
                  placeholder="VD: Tập trung vào các khái niệm chính trong chương 3..."
                  rows={2}
                  disabled={isGenerating}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-verve-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-6 rounded-lg bg-info-50 p-4 dark:bg-info-900/20">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-info-600 dark:text-info-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-info-700 dark:text-info-300">
                <p className="font-medium">Lưu ý</p>
                <p className="mt-1">
                  Câu hỏi được tạo sẽ có trạng thái <Badge variant="warning" size="sm">Chờ duyệt</Badge> và cần được bạn xem xét trước khi xuất bản.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50 shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            isLoading={isGenerating}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Tạo {questionCount} câu hỏi
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AICreateQuestionModal
