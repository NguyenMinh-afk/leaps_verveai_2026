/**
 * Constants — shared enums, error codes, and magic values used across all services.
 *
 * @module constants
 */

/** User roles — matches UserRole enum in Prisma schema */
export enum Role {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPERVISOR = 'SUPERVISOR',
}

/** Audit log action types */
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  OVERRIDE = 'OVERRIDE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SIGN = 'SIGN',
  PUBLISH = 'PUBLISH',
  SYNC_PUSH = 'SYNC_PUSH',
  SYNC_PULL = 'SYNC_PULL',
  SYNC_CONFLICT = 'SYNC_CONFLICT',
}

/** Content review status */
export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
}

/** Device type for sync */
export enum DeviceType {
  PHONE = 'PHONE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
  HUB = 'HUB',
}

/** Sync conflict resolution strategy */
export enum ConflictResolution {
  SERVER_WINS = 'SERVER_WINS',
  CLIENT_WINS = 'CLIENT_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL',
}

/** Intervention priority — determines sort order */
export enum InterventionPriority {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
}

/** Magic constants — do not change */
export const MAGIC = {
  /** Max items per page */
  MAX_PAGE_SIZE: 100,
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,
  /** Bcrypt rounds for password hashing */
  BCRYPT_ROUNDS: 12,
  /** JWT default expiry */
  JWT_EXPIRY: '1d',
  /** JWT refresh token expiry */
  JWT_REFRESH_EXPIRY: '7d',
  /** Max password length */
  MAX_PASSWORD_LENGTH: 128,
  /** Min password length */
  MIN_PASSWORD_LENGTH: 8,
  /** Max email length */
  MAX_EMAIL_LENGTH: 255,
  /** HTTP request timeout (ms) */
  HTTP_TIMEOUT_MS: 5000,
  /** Max retries for HTTP calls */
  HTTP_MAX_RETRIES: 3,
  /** Circuit breaker: error threshold % */
  CB_ERROR_THRESHOLD: 50,
  /** Circuit breaker: reset timeout (ms) */
  CB_RESET_TIMEOUT_MS: 10000,
  /** Circuit breaker: timeout (ms) */
  CB_TIMEOUT_MS: 3000,
} as const;

/** Content bundle file extension */
export const BUNDLE_EXTENSION = '.verveai-bundle.zip';

/** Content bundle MIME type */
export const BUNDLE_MIME_TYPE = 'application/zip';

/** Supported content types */
export const CONTENT_TYPES = ['LESSON', 'EXERCISE', 'QUIZ', 'ASSESSMENT', 'REMEDIATION'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/** Skill difficulty levels */
export const SKILL_DIFFICULTY = ['EASY', 'MEDIUM', 'HARD'] as const;
export type SkillDifficulty = (typeof SKILL_DIFFICULTY)[number];

/** Intervention status */
export const INTERVENTION_STATUS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'] as const;
export type InterventionStatus = (typeof INTERVENTION_STATUS)[number];

/** Evidence quality labels */
export const EVIDENCE_QUALITY = ['STRONG', 'MODERATE', 'WEAK'] as const;
export type EvidenceQuality = (typeof EVIDENCE_QUALITY)[number];

/** Sync status */
export const SYNC_STATUS = ['SUCCESS', 'PARTIAL', 'FAILED', 'CONFLICT'] as const;
export type SyncStatus = (typeof SYNC_STATUS)[number];
