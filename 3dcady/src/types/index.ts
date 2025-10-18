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

// Furniture Configurator Types
export type ProductTypeName = 'kitchen' | 'wardrobe';

export interface ProductType {
  id: string;
  name: ProductTypeName;
  displayName: string;
  isActive: boolean;
}

export interface OptionCategory {
  id: string;
  productTypeId: string;
  name: string;
  title: string;
  stepOrder: number;
  isRequired: boolean;
  allowsMultiple: boolean;
  conditionalDisplay?: ConditionalLogic;
  options?: OptionValue[];
}

export interface OptionValue {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  priceFactor?: number;
  specifications?: Record<string, any>;
  displayOrder: number;
  isAvailable: boolean;
}

export interface ConditionalLogic {
  showIf?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'in' | 'notIn';
    value: any;
  }[];
  hideIf?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'in' | 'notIn';
    value: any;
  }[];
}

export type LayoutType = 
  | 'linear' 
  | 'l-shaped' 
  | 'u-shaped' 
  | 'island' 
  | 'parallel'
  | 'built-in'; // for wardrobes

export type StyleType = 
  | 'modern' 
  | 'classic' 
  | 'loft' 
  | 'minimalist' 
  | 'traditional';

export type CorpusMaterial = 
  | 'marine_plywood' 
  | 'mdf' 
  | 'mr_particle_board';

export type FacadeMaterial = 
  | 'acrylic_mdf' 
  | 'lacquered_mdf' 
  | 'laminated_mdf' 
  | 'veneer' 
  | 'pvc_film' 
  | 'solid_wood';

export type FinishType = 'high_gloss' | 'matte' | 'super_matte';

export type ProfileType = 'smooth' | 'j_handle' | 'classic_panel' | 'push_to_open';

export type CountertopMaterial = 
  | 'engineered_quartz' 
  | 'natural_stone' 
  | 'sintered_stone' 
  | 'solid_surface' 
  | 'hpl';

export type SplashbackMaterial = 
  | 'quartz' 
  | 'glass' 
  | 'porcelain' 
  | 'hpl';

export type DoorType = 'hinged' | 'sliding';

export type DoorMaterialType = 
  | 'lacquered_mdf' 
  | 'mirror' 
  | 'tinted_glass' 
  | 'lacobel' 
  | 'combined';

export type SlidingSystemType = 'floor_supported' | 'suspended';

export type FillingElementType = 
  | 'shelf' 
  | 'hanging_rod' 
  | 'pantograph' 
  | 'drawer' 
  | 'basket' 
  | 'trouser_rack' 
  | 'shoe_rack';

export type HingeType = 'roller' | 'ball_bearing' | 'soft_close';

export type DrawerSlideType = 'roller' | 'ball_bearing' | 'soft_close';

export type HandleType = 'overlay' | 'profile_gola' | 'push_to_open';

export type HardwareManufacturer = 'blum' | 'hettich' | 'salice' | 'standard';

export type AccessoryType = 
  | 'dish_drainer' 
  | 'cutlery_tray' 
  | 'bottle_rack' 
  | 'magic_corner' 
  | 'led_lighting' 
  | 'spice_rack' 
  | 'pull_out_basket';

export type ApplianceType = 
  | 'oven' 
  | 'cooktop' 
  | 'hood' 
  | 'dishwasher' 
  | 'refrigerator' 
  | 'microwave' 
  | 'warming_drawer';

export type ApplianceIntegration = 'built_in' | 'freestanding';

export type LightingType = 'led_strip' | 'led_spots' | 'puck_lights';

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  unit: 'mm' | 'cm' | 'm';
}

export interface TypeAndSize {
  layoutType: LayoutType;
  dimensions: Dimensions;
}

export interface CorpusMaterialSelection {
  material: CorpusMaterial;
  thickness?: number;
  color?: string;
}

export interface FacadeMaterialSelection {
  material: FacadeMaterial;
  finish: FinishType;
  color: string;
  profile: ProfileType;
  edgeProfile?: string;
}

export interface CountertopSelection {
  material: CountertopMaterial;
  brand?: string;
  color?: string;
  thickness: 20 | 30 | 40;
  edgeProfile?: string;
}

export interface SplashbackSelection {
  material: SplashbackMaterial;
  matchesCountertop: boolean;
  color?: string;
}

export interface DoorMaterialItem {
  section: number;
  material: DoorMaterialType;
  type?: string;
  width: number;
  color?: string;
  finish?: FinishType;
}

export interface SlidingSystem {
  type: SlidingSystemType;
  profileColor: string;
  manufacturer?: string;
  trackCount?: number;
  note?: string;
}

export interface FillingElement {
  id?: string;
  type: FillingElementType;
  height: number;
  quantity: number;
  position?: string;
  drawerType?: string;
  liftingHeight?: string;
  capacity?: number;
}

export interface FillingSection {
  id?: string;
  sectionWidth: number;
  elements: FillingElement[];
}

export interface HardwareSelection {
  hinges: HingeType;
  drawerSlides: DrawerSlideType;
  handles?: HandleType;
  manufacturer: HardwareManufacturer;
}

export interface Accessory {
  type: AccessoryType;
  width?: number;
  brand?: string;
  note?: string;
}

export interface Appliance {
  type: ApplianceType;
  integration: ApplianceIntegration;
  brand?: string;
  model?: string;
  cutoutDimensions?: Dimensions;
}

export interface LightingSelection {
  workAreaLighting?: boolean;
  internalLighting: boolean;
  type: LightingType;
  color?: string;
  motionSensor?: boolean;
}

export interface ConfigurationSelections {
  typeAndSize?: TypeAndSize;
  style?: StyleType;
  corpusMaterial?: CorpusMaterialSelection;
  facadeMaterial?: FacadeMaterialSelection;
  countertop?: CountertopSelection;
  splashback?: SplashbackSelection;
  doorType?: DoorType;
  doorMaterials?: DoorMaterialItem[];
  slidingSystem?: SlidingSystem;
  internalFilling?: FillingSection[];
  hardware?: HardwareSelection;
  accessories?: Accessory[];
  appliances?: Appliance[];
  lighting?: LightingSelection;
}

export interface ConfigurationData {
  productType: ProductTypeName;
  selections: ConfigurationSelections;
  notes?: string;
}

export interface ClientData {
  name: string;
  phone: string;
  email: string;
  preferredContactTime?: string;
}

export type OrderRequestStatus = 
  | 'draft' 
  | 'submitted' 
  | 'quoted' 
  | 'converted' 
  | 'cancelled';

export interface OrderRequest {
  id: string;
  productTypeId: string;
  status: OrderRequestStatus;
  clientData: ClientData;
  configurationData: ConfigurationData;
  createdDate: Date;
  submittedDate?: Date;
  projectId?: string;
}

export interface ConfiguratorState {
  productType: ProductTypeName | null;
  currentStep: number;
  totalSteps: number;
  configuration: ConfigurationData;
  optionsCache: Record<string, OptionValue[]>;
  categoriesCache: OptionCategory[];
  isLoading: boolean;
  errors: Record<string, string[]>;
  savedStateTimestamp?: number;
}

export interface StepDefinition {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  validate: (config: ConfigurationSelections) => boolean;
  isConditional?: boolean;
  showIf?: (config: ConfigurationSelections) => boolean;
}