// Core User Management Types
export interface UserAccount {
  id: string;
  email: string;
  password_hash: string;
  role_type: 'client' | 'supplier' | 'admin';
  subscription_plan: 'free' | 'pro' | 'business';
  created_date: Date;
  updated_date: Date;
  organization_id?: string;
  profile: UserProfile;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  company_website?: string;
  bio?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'design_studio' | 'supplier' | 'contractor';
  subscription_tier: 'free' | 'pro' | 'business';
  created_date: Date;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  browser_notifications: boolean;
  proposal_alerts: boolean;
  deadline_reminders: boolean;
}

export interface UserPermissions {
  id: string;
  user_id: string;
  project_id: string;
  access_level: 'view' | 'edit' | 'admin';
  granted_by: string;
  granted_date: Date;
}

// Project Management Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  budget_planned: number;
  budget_actual: number;
  currency: string;
  owner_id: string;
  organization_id: string;
  created_date: Date;
  updated_date: Date;
  deadline?: Date;
  project_settings: ProjectSettings;
  tags: string[];
}

export interface ProjectSettings {
  allow_public_proposals: boolean;
  auto_approve_suppliers: boolean;
  require_nda: boolean;
  budget_visibility: 'hidden' | 'range' | 'exact';
}

export interface ProjectStage {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deadline?: Date;
  created_date: Date;
  updated_date: Date;
}

export interface Task {
  id: string;
  stage_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  due_date?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_date: Date;
  updated_date: Date;
}

// Technical Specification Types
export interface TechnicalSpecification {
  id: string;
  project_id: string;
  category: SpecificationCategory;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'approved' | 'archived';
  created_by: string;
  approved_by?: string;
  created_date: Date;
  updated_date: Date;
  deadline?: Date;
}

export type SpecificationCategory = 
  | 'finishing_materials'
  | 'furniture'
  | 'lighting'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'custom';

export interface SpecificationItem {
  id: string;
  spec_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  specifications: Record<string, any>; // Flexible JSON for various specs
  estimated_price?: number;
  notes?: string;
  order: number;
  product_references?: string[]; // Reference to catalog products
}

// Supplier Management Types
export interface SupplierProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_registration: string;
  tax_id?: string;
  website?: string;
  logo_url?: string;
  description: string;
  categories: SpecificationCategory[];
  service_areas: string[]; // Geographic areas
  rating: number;
  review_count: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  certifications: Certification[];
  portfolio: PortfolioItem[];
  created_date: Date;
  updated_date: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: Date;
  expiry_date?: Date;
  certificate_url?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: SpecificationCategory;
  images: string[];
  project_year?: number;
  budget_range?: string;
}

// Product Catalog Types
export interface ProductCatalog {
  id: string;
  supplier_id: string;
  name: string;
  description: string;
  category: SpecificationCategory;
  subcategory?: string;
  price: number;
  currency: string;
  unit: string;
  availability: 'in_stock' | 'made_to_order' | 'discontinued';
  lead_time_days?: number;
  minimum_order?: number;
  specifications: ProductSpecifications;
  images: ProductImage[];
  documents: ProductDocument[];
  tags: string[];
  created_date: Date;
  updated_date: Date;
}

export interface ProductSpecifications {
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  materials?: string[];
  colors?: string[];
  finishes?: string[];
  style_tags?: string[];
  care_instructions?: string;
  warranty?: string;
  origin_country?: string;
  custom_specs?: Record<string, any>;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: 'manual' | 'spec_sheet' | 'certificate' | 'warranty' | 'other';
  url: string;
  size_bytes: number;
}

// Proposal Management Types
export interface Proposal {
  id: string;
  spec_id: string;
  supplier_id: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'accepted' | 'rejected' | 'expired';
  submitted_date?: Date;
  valid_until?: Date;
  response_deadline?: Date;
  notes?: string;
  terms_conditions?: string;
  created_date: Date;
  updated_date: Date;
}

export interface ProposalItem {
  id: string;
  proposal_id: string;
  spec_item_id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  lead_time_days?: number;
  notes?: string;
  alternatives?: ProposalItemAlternative[];
}

export interface ProposalItemAlternative {
  id: string;
  product_id?: string;
  description: string;
  unit_price: number;
  total_price: number;
  reason: string;
}

// Communication Types
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  attachments?: MessageAttachment[];
  created_date: Date;
  read_by: MessageRead[];
}

export interface MessageThread {
  id: string;
  project_id: string;
  subject: string;
  participants: string[]; // user_ids
  thread_type: 'project' | 'proposal' | 'support';
  reference_id?: string; // proposal_id, spec_id, etc.
  created_date: Date;
  updated_date: Date;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  size_bytes: number;
  mime_type: string;
}

export interface MessageRead {
  user_id: string;
  read_date: Date;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_date: Date;
}

export type NotificationType =
  | 'proposal_received'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'deadline_approaching'
  | 'budget_alert'
  | 'project_update'
  | 'message_received'
  | 'system_announcement';

// File Upload Types
export interface FileUpload {
  id: string;
  original_name: string;
  stored_name: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  uploaded_by: string;
  project_id?: string;
  created_date: Date;
}

// AI Document Analysis Types
export interface DocumentAnalysisJob {
  id: string;
  project_id: string;
  file_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis_type: 'specification_extraction' | 'cad_analysis' | 'general';
  started_date?: Date;
  completed_date?: Date;
  error_message?: string;
  results?: DocumentAnalysisResult;
}

export interface DocumentAnalysisResult {
  extracted_items: ExtractedSpecificationItem[];
  confidence_score: number;
  processing_notes: string[];
  manual_review_required: boolean;
}

export interface ExtractedSpecificationItem {
  name: string;
  quantity?: number;
  unit?: string;
  category?: SpecificationCategory;
  specifications?: Record<string, any>;
  confidence: number;
  source_location: string; // page/section reference
}

// Subscription and Billing Types
export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_date: Date;
  updated_date: Date;
}

export interface SubscriptionLimits {
  max_projects: number;
  max_specifications_per_project: number;
  max_proposals_per_specification: number;
  max_file_storage_gb: number;
  ai_document_analysis: boolean;
  team_management: boolean;
  priority_support: boolean;
}

export interface BillingInvoice {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  issue_date: Date;
  due_date: Date;
  paid_date?: Date;
  invoice_url?: string;
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  user_id: string;
  widget_type: string;
  position: { x: number; y: number; w: number; h: number };
  settings: Record<string, any>;
  is_visible: boolean;
}

// Audit Trail Types
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_date: Date;
}