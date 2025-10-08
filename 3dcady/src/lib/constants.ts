import { SubscriptionPlan } from '@/types';

export interface SubscriptionLimits {
  maxProjects: number;
  maxSpecificationsPerProject: number;
  maxProposalsPerSpecification: number;
  maxFileStorageGB: number;
  aiDocumentAnalysis: boolean;
  teamManagement: boolean;
  prioritySupport: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  free: {
    maxProjects: 1,
    maxSpecificationsPerProject: 3,
    maxProposalsPerSpecification: 5,
    maxFileStorageGB: 1,
    aiDocumentAnalysis: false,
    teamManagement: false,
    prioritySupport: false,
  },
  pro: {
    maxProjects: 10,
    maxSpecificationsPerProject: -1, // unlimited
    maxProposalsPerSpecification: -1, // unlimited
    maxFileStorageGB: 20,
    aiDocumentAnalysis: true,
    teamManagement: false,
    prioritySupport: true,
  },
  business: {
    maxProjects: -1, // unlimited
    maxSpecificationsPerProject: -1, // unlimited
    maxProposalsPerSpecification: -1, // unlimited
    maxFileStorageGB: 100,
    aiDocumentAnalysis: true,
    teamManagement: true,
    prioritySupport: true,
  },
};

export const SUBSCRIPTION_PRICES = {
  pro: {
    monthly: 29.99,
    yearly: 299.99, // 2 months free
  },
  business: {
    monthly: 99.99,
    yearly: 999.99, // 2 months free
  },
};

// File upload constants
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/dwg',
  'application/dxf',
];

// AI Processing constants
export const AI_CONFIDENCE_THRESHOLD = 0.7;
export const MAX_DOCUMENT_PAGES = 50;

// Pagination constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache constants
export const CACHE_TTL_SECONDS = {
  USER_SESSION: 3600, // 1 hour
  PROJECT_DATA: 1800, // 30 minutes
  CATALOG_DATA: 7200, // 2 hours
  NOTIFICATIONS: 300, // 5 minutes
};

// Database constants
export const DB_PRECISION = {
  PRICE: { precision: 12, scale: 2 },
  QUANTITY: { precision: 10, scale: 3 },
  RATING: { precision: 3, scale: 2 },
};

// Notification constants
export const NOTIFICATION_BATCH_SIZE = 100;
export const EMAIL_RATE_LIMIT_PER_HOUR = 100;

// Project workflow constants
export const DEFAULT_PROJECT_STAGES = [
  'Requirements Gathering',
  'Supplier Selection',
  'In Progress',
  'Quality Review',
  'Completion',
];

// Search constants
export const SEARCH_RESULTS_LIMIT = 50;
export const SEARCH_MIN_QUERY_LENGTH = 2;