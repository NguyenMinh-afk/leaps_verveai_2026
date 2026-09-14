/**
 * VERVEAI — Content API surface (through Gateway → svc-content).
 * 
 * Question types supported by backend:
 * - multiple-choice: Has options array with correctOptionIndex
 * - true-false: Boolean correctAnswer ('true' | 'false')
 * - short-answer: String correctAnswer for manual grading
 */

import { api } from './apiClient';

// ============================================
// Types
// ============================================

export type ContentType = 'QUESTION' | 'EXPLANATION' | 'EXAMPLE' | 'EXERCISE'
export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

/**
 * Question option for multiple-choice questions
 */
export interface QuestionOption {
  id?: string;
  content: string;
  contentVi?: string;
}

/**
 * Question metadata from content service
 * - For multiple-choice: has options array and correctOptionIndex
 * - For true-false: has correctAnswer as 'true' | 'false'
 * - For short-answer: has correctAnswer as string for manual grading
 */
export interface QuestionMetadata {
  type: QuestionType;
  options?: QuestionOption[];
  correctOptionIndex?: number;
  correctAnswer?: string;
  explanation?: string;
  explanationVi?: string;
  topicId?: string;
  topicName?: string;
  topicNameVi?: string;
  tags?: string[];
  contentVi?: string;
}

/**
 * Full question object from content service (GET /api/content/questions/:id)
 */
export interface Question {
  id: string;
  title: string;
  body: string;
  bodyVi?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  difficultyLabel: QuestionDifficulty;
  type: QuestionType;
  status: QuestionStatus;
  authorId: string;
  topic?: string;
  chapter?: string;
  metadata: QuestionMetadata;
  createdAt: string;
  updatedAt: string;
  reviews?: ReviewSummary[];
}

/**
 * Lightweight question for list views
 */
export interface QuestionListItem {
  id: string;
  title: string;
  body: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  status: QuestionStatus;
  topic?: string;
  createdAt: string;
}

/**
 * Review summary
 */
export interface ReviewSummary {
  id: string;
  reviewerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
  createdAt: string;
}

/**
 * Question list pagination
 */
export interface QuestionListPage {
  items: QuestionListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// Content Item Types (for non-question content)
// ============================================

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  difficulty: number;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItemDetail extends ContentItem {
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// ============================================
// Question API (svc-content)
// ============================================

export interface ListQuestionsParams {
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: QuestionType;
  status?: QuestionStatus;
  topic?: string;
  authorId?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Fetch full question by ID from content service
 * GET /api/content/questions/:id
 */
export async function getQuestion(questionId: string): Promise<Question | null> {
  try {
    return await api.get<Question>(`/api/content/questions/${encodeURIComponent(questionId)}`);
  } catch {
    return null;
  }
}

/**
 * Fetch multiple questions by IDs
 * Used when loading exam questions - need to get content for each questionId
 */
export async function getQuestions(questionIds: string[]): Promise<Question[]> {
  if (questionIds.length === 0) return [];
  
  const results: Question[] = [];
  const errors: string[] = [];
  
  // Fetch all questions in parallel
  const promises = questionIds.map(async (id) => {
    try {
      const question = await api.get<Question>(`/api/content/questions/${encodeURIComponent(id)}`);
      return question;
    } catch (err) {
      errors.push(id);
      return null;
    }
  });
  
  const responses = await Promise.all(promises);
  
  // Filter out nulls and errors
  for (const q of responses) {
    if (q) results.push(q);
  }
  
  if (errors.length > 0) {
    console.warn(`Failed to fetch questions: ${errors.join(', ')}`);
  }
  
  return results;
}

/**
 * List questions with filters
 * GET /api/content/questions
 */
export async function listQuestions(params: ListQuestionsParams = {}): Promise<QuestionListPage> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params.type) searchParams.set('type', params.type);
  if (params.status) searchParams.set('status', params.status);
  if (params.topic) searchParams.set('topic', params.topic);
  if (params.authorId) searchParams.set('authorId', params.authorId);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  
  const query = searchParams.toString();
  const path = query ? `/api/content/questions?${query}` : '/api/content/questions';
  return api.get<QuestionListPage>(path);
}

// ============================================
// Content API
// ============================================

export interface ListContentParams {
  type?: ContentType
  status?: ContentStatus
  page?: number
  pageSize?: number
}

export interface ListContentResponse {
  data: ContentItem[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function listContent(params: ListContentParams = {}): Promise<ListContentResponse> {
  const searchParams = new URLSearchParams()
  if (params.type) searchParams.set('type', params.type)
  if (params.status) searchParams.set('status', params.status)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  const query = searchParams.toString()
  const path = query ? `/api/content?${query}` : '/api/content'
  return api.get<ListContentResponse>(path)
}

export async function getContentItem(id: string): Promise<ContentItemDetail | null> {
  try {
    return await api.get<ContentItemDetail>(`/api/content/${encodeURIComponent(id)}`)
  } catch (error) {
    return null
  }
}

export interface CreateContentRequest {
  type: ContentType
  title: string
  body: string
  difficulty: number
}

export async function createContent(request: CreateContentRequest): Promise<ContentItem> {
  return api.post<ContentItem>('/api/content', request)
}

export interface UpdateContentRequest {
  title?: string
  body?: string
  difficulty?: number
}

export async function updateContent(id: string, request: UpdateContentRequest): Promise<ContentItem> {
  return api.put<ContentItem>(`/api/content/${encodeURIComponent(id)}`, request)
}

export async function deleteContent(id: string): Promise<void> {
  return api.delete<void>(`/api/content/${encodeURIComponent(id)}`)
}

export async function submitForReview(id: string): Promise<ContentItem> {
  return api.post<ContentItem>(`/api/content/${encodeURIComponent(id)}/submit`)
}

// ============================================
// Review API
// ============================================

export interface ReviewItem {
  id: string
  contentId: string
  content: ContentItem
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface ListReviewsParams {
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  pageSize?: number
}

export interface ListReviewsResponse {
  data: ReviewItem[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function listReviews(params: ListReviewsParams = {}): Promise<ListReviewsResponse> {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  const query = searchParams.toString()
  const path = query ? `/api/content/review?${query}` : '/api/content/review'
  return api.get<ListReviewsResponse>(path)
}

// ============================================
// Review Stats Types (from svc-content)
// ============================================

export interface ReviewerWorkload {
  reviewerId: string;
  pendingCount: number;
  totalCount: number;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reviewerWorkload: ReviewerWorkload[];
}

export async function getReviewStats(): Promise<ReviewStats> {
  return api.get<ReviewStats>('/api/content/review/stats');
}

export interface ApproveReviewRequest {
  feedback?: string
}

export async function approveReview(id: string, request: ApproveReviewRequest = {}): Promise<ReviewItem> {
  return api.post<ReviewItem>(`/api/content/review/${encodeURIComponent(id)}/approve`, request)
}

export interface RejectReviewRequest {
  reason: string
}

export async function rejectReview(id: string, request: RejectReviewRequest): Promise<ReviewItem> {
  return api.post<ReviewItem>(`/api/content/review/${encodeURIComponent(id)}/reject`, request)
}

// ============================================
// Bundles API (from svc-content)
// ============================================

export type BundleStatus = 'BUILDING' | 'BUILT' | 'SIGNED' | 'PUBLISHED';

export interface BundleSignature {
  id: string;
  bundleId: string;
  publicKeyFingerprint: string;
  signature: string;
  signedAt: string;
}

export interface Bundle {
  id: string;
  name: string;
  version: string;
  status: BundleStatus;
  contentIds: string[];
  createdAt: string;
  publishedAt?: string;
  signatures: BundleSignature[];
}

export interface BundleListResult {
  items: Bundle[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ListBundlesParams {
  page?: number;
  pageSize?: number;
}

export async function listBundles(params: ListBundlesParams = {}): Promise<BundleListResult> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  const query = searchParams.toString();
  const path = query ? `/api/content/bundles?${query}` : '/api/content/bundles';
  return api.get<BundleListResult>(path);
}

export async function getBundle(id: string): Promise<Bundle | null> {
  try {
    return await api.get<Bundle>(`/api/content/bundles/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export interface BuildBundleRequest {
  name: string;
  contentIds: string[];
}

export async function buildBundle(request: BuildBundleRequest): Promise<Bundle> {
  return api.post<Bundle>('/api/content/bundles/build', request);
}

export interface SignBundleResponse {
  id: string;
  bundleId: string;
  publicKeyFingerprint: string;
  signature: string;
  signedAt: string;
}

export async function signBundle(id: string): Promise<SignBundleResponse> {
  return api.post<SignBundleResponse>(`/api/content/bundles/${encodeURIComponent(id)}/sign`);
}

export async function publishBundle(id: string): Promise<Bundle> {
  return api.post<Bundle>(`/api/content/bundles/${encodeURIComponent(id)}/publish`);
}

// ============================================
// Reports API (from svc-content)
// ============================================

export interface AggregateReport {
  type: string;
  generatedAt: string;
  data: {
    content: {
      total: number;
      draft: number;
      pendingReview: number;
      approved: number;
      rejected: number;
    };
    bundles: {
      total: number;
      built: number;
      signed: number;
      published: number;
    };
    reviews: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    upstream: {
      svcClass: 'ok' | 'down';
      svcBkt: 'ok' | 'down';
    };
    upstreamData: Record<string, unknown>;
  };
}

export interface ClassReportData {
  classId: string;
  classInfo: Record<string, unknown> | null;
  contentStats: {
    total: number;
    approved: number;
    pendingReview: number;
    draft: number;
  };
  bundlesUsed: number;
  generatedAt: string;
}

export interface StudentReportData {
  studentId: string;
  studentInfo: Record<string, unknown> | null;
  classInfo: Record<string, unknown> | null;
  progress: Record<string, unknown> | null;
  generatedAt: string;
}

export interface ExportResult {
  filename: string;
  mimeType: string;
  encoding: 'base64';
  data: string;
  sizeBytes: number;
}

export async function getAggregateReport(): Promise<AggregateReport> {
  return api.get<AggregateReport>('/api/content/reports/aggregate');
}

export async function getClassReport(classId: string): Promise<ClassReportData> {
  return api.get<ClassReportData>(`/api/content/reports/class/${encodeURIComponent(classId)}`);
}

export async function getStudentReport(studentId: string): Promise<StudentReportData> {
  return api.get<StudentReportData>(`/api/content/reports/student/${encodeURIComponent(studentId)}`);
}

export type ExportType = 'aggregate' | 'classes' | 'bundles' | 'content' | 'reviews';
export type ExportFormat = 'json' | 'csv';

export interface ExportParams {
  type: ExportType;
  format?: ExportFormat;
}

export async function exportReport(params: ExportParams): Promise<ExportResult> {
  const { type, format = 'json' } = params;
  const query = new URLSearchParams({ type, format });
  return api.get<ExportResult>(`/api/content/reports/export?${query}`);
}
