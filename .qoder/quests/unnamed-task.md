# 3dcady - AI-Powered Interior Project Hub Design Document

## Overview

3dcady is a comprehensive platform that serves as a central hub for interior design projects, connecting clients, design studios, suppliers, contractors, and freelancers in a unified ecosystem. The platform leverages AI-powered document analysis to automate technical specification creation, streamlines project management through Kanban-style workflows, and facilitates efficient supplier management and procurement processes.

### Core Value Proposition

The platform addresses the fragmented nature of interior design project management by providing:
- Automated extraction and structuring of project requirements from design documents
- Centralized project tracking with real-time visibility for all stakeholders
- Streamlined supplier discovery and proposal management
- Comprehensive budget tracking and cost optimization tools

### Target Users

**Primary Users:**
- Individual interior designers and design studios (project owners)
- Suppliers, contractors, and freelance specialists (service providers)

**Secondary Users:**
- Project managers within design studios
- Procurement specialists
- Client representatives

## Technology Stack & Dependencies

### Core Platform Architecture
- Web-based application with responsive design
- Real-time collaboration capabilities
- Cloud-based file storage and processing
- AI/ML services for document analysis
- Multi-tenant architecture supporting different user roles

### AI/ML Components
- Natural Language Processing (NLP) for document text extraction
- Computer Vision for CAD file analysis
- Machine Learning models for specification categorization
- Automated data validation and error detection

### Integration Requirements
- Email notification system
- Calendar synchronization
- File format support: PDF, DOCX, XLSX, DWG, CAD
- Export capabilities for various document formats

## User Role Architecture

### Client / Design Studio Dashboard

#### Dashboard Widget System

**Project Overview Widget**
- Visual representation: Card-based layout with project thumbnails
- Information display: Project name, main render/photo, progress indicator (circular progress chart), Kanban status, critical alerts
- Interactive elements: Click-to-navigate to project details
- Status indicators: Color-coded alerts for overdue tasks or budget overruns

**Budget Analytics Widget**
- Visual representation: Comparative bar charts showing "Planned Budget vs Actual Expenses"
- Data layers: Additional tracking for "Pending Approval" amounts (accepted but unpaid supplier proposals)
- Interactive elements: Hover tooltips with precise figures, click-through filtering to related transactions
- Real-time updates: Automatic refresh when new proposals are accepted or payments processed

**Incoming Proposals (BOQ) Widget**
- Layout: List view with proposal metadata
- Information structure: Project name, specification category, supplier name, total proposal amount
- Action elements: "Compare Proposals" button leading to consolidated comparison tables
- Notification system: Visual indicators for new or urgent proposals

**Calendar & Task Management Widget**
- Calendar view: Monthly layout with key milestone markers
- Event types: Phase deadlines, scheduled deliveries, stakeholder meetings
- Task integration: Weekly task list below calendar
- Interactive features: Direct task completion from widget, date-click event details

### Supplier / Contractor / Freelancer Dashboard

#### Opportunity Management System

**Technical Specification Feed Widget**
- Feed layout: Freelance marketplace-style opportunity cards
- Information display: Project title (potentially anonymized), category specification, budget range (if disclosed), proposal deadline
- Filtering system: Mandatory filters for work categories, budget ranges, geographic regions, project types
- Action elements: "View Specification & Submit Proposal" buttons

**Proposal Status Tracking Widget**
- Visual system: Kanban board with status columns: "Draft", "Submitted", "Client Reviewed", "Accepted", "Rejected"
- Card management: Automatic status progression based on client actions
- Interactive elements: Click-through to proposal details and client communication threads

**Active Orders Management Widget**
- Order tracking: List of accepted proposals with current status
- Progress indicators: Next milestone, deadline tracking, order value
- Action items: Direct links to order documentation, communication threads, task checklists

## Core Functionality Architecture

### AI Document Analyzer System

#### Document Processing Pipeline

**File Ingestion Stage**
- Multi-format support: Drag-and-drop interface for project folders
- File type recognition: Automatic classification of PDF, DOCX, XLSX, DWG, CAD files
- Batch processing: Concurrent analysis of multiple documents

**Content Extraction Engine**
- PDF/DOCX Analysis: NLP-based entity extraction targeting tables and lists with headers like "Finishing Schedule", "Furniture Specification", "Lighting Plan"
- Entity Recognition: Extraction of structured data including Item Name, Article Number, Quantity, Unit of Measure, Notes
- XLSX Processing: Direct table parsing with intelligent column mapping
- CAD Analysis: Layer name interpretation and room schedule extraction

**Data Structuring System**
- Unified database consolidation: All extracted data normalized into consistent format
- Category classification: Automatic grouping into Finishing Materials, Furniture, Lighting, Plumbing
- Data validation: AI-powered quality checks and anomaly detection

**Human Validation Workflow**
- Preliminary specification generation: AI creates draft technical specifications
- Interactive editor: User-friendly interface for data verification and correction
- Approval workflow: Client confirmation required before specification publication
- Accuracy guarantee: Human oversight ensures specification precision

#### AI Model Architecture

**Natural Language Processing Component**
- Entity extraction for construction and design terminology
- Context-aware parsing of specification documents
- Multi-language support for international projects

**Computer Vision Component**
- CAD file layer analysis
- Symbol and annotation recognition
- Spatial relationship extraction

### Project Management System

#### Kanban Workflow Engine

**Stage Configuration**
- Default workflow stages: Requirements Gathering, Supplier Selection, In Progress, Quality Review, Completion
- Custom stage creation: Client-defined workflow steps like "Drawing Approval", "Manufacturing", "On-site Delivery"
- Stage transitions: Manual and automated progression triggers

**Card Detail System**
- Multi-tab interface: Overview, Documents, Suppliers, Communications
- Document management: File attachment and version control
- Supplier tracking: Approved vendor lists per stage
- Communication threads: Contextual discussions per workflow stage

**Automation Rules Engine**
- Trigger configuration: Simple rule-based workflow automation
- Example automations: "When all Furniture category proposals are approved, automatically move 'Furniture Procurement' card from 'Supplier Selection' to 'In Progress'"
- Notification system: Automated stakeholder alerts for stage transitions

### Product Catalog System

#### Supplier Catalog Management

**Product Upload Interface**
- Individual item entry: Form-based product creation
- Bulk upload: Excel template for mass product import
- Inventory tracking: Stock availability and custom manufacturing timelines
- Product categorization: Style tags, color options, dimensional specifications

#### Client Catalog Interface

**Search and Discovery**
- Advanced search: Name/article number lookup with autocomplete
- Multi-dimensional filtering: Style (loft, scandinavian), color, dimensions, price range
- Visual browsing: Grid and list view options

**Mood Board System**
- Virtual board creation: Drag-and-drop product collection
- Visual compatibility assessment: Side-by-side product comparison
- Collaboration features: Board sharing and commenting

**Project Integration**
- Specification addition: One-click product addition to project technical specifications
- Automatic pricing: Real-time cost calculation and budget impact
- Vendor information: Supplier details and lead times

## Data Models & Schema

### User Management Schema

| Entity | Attributes | Relationships |
|--------|------------|---------------|
| User Account | user_id, email, role_type, subscription_plan, created_date | Links to Projects, Organizations |
| Organization | org_id, name, type, subscription_tier | Contains multiple Users |
| User Permissions | permission_id, user_id, project_id, access_level | Defines project access rights |

### Project Management Schema

| Entity | Attributes | Relationships |
|--------|------------|---------------|
| Project | project_id, name, description, status, budget_planned, budget_actual, owner_id | Contains Specifications, Stages |
| Project Stage | stage_id, project_id, name, order, status, deadline | Contains Tasks, Documents |
| Technical Specification | spec_id, project_id, category, items, status | Links to Proposals |
| Specification Item | item_id, spec_id, name, quantity, unit, description | References Catalog Products |

### Supplier Management Schema

| Entity | Attributes | Relationships |
|--------|------------|---------------|
| Supplier Profile | supplier_id, company_name, contact_info, categories, rating | Links to Products, Proposals |
| Product Catalog | product_id, supplier_id, name, category, price, availability | References Specification Items |
| Proposal | proposal_id, spec_id, supplier_id, total_amount, status, submitted_date | Contains Proposal Items |
| Proposal Item | item_id, proposal_id, product_id, quantity, unit_price, total_price | Links to Products |

## Business Logic Layer

### Project Workflow Management

**Project Creation Flow**
1. Client uploads project documents
2. AI analyzer processes and extracts data
3. System generates preliminary technical specifications
4. Client reviews and approves specifications
5. Specifications published to relevant suppliers
6. Kanban board initialized with default stages

**Supplier Proposal Flow**
1. Supplier receives specification notification
2. Supplier accesses detailed requirements
3. Proposal creation with itemized pricing
4. Proposal submission and status tracking
5. Client review and comparison interface
6. Proposal acceptance/rejection with feedback

**Budget Tracking Logic**
- Real-time budget calculation based on accepted proposals
- Variance analysis between planned and actual costs
- Alert system for budget threshold breaches
- Approval workflow for budget modifications

### AI Document Processing Logic

**Document Analysis Pipeline**
1. File format detection and preprocessing
2. Content extraction using appropriate parsers
3. Entity recognition and data normalization
4. Category classification and grouping
5. Quality validation and error flagging
6. Human review interface generation

**Learning and Improvement System**
- User correction feedback loop
- Model accuracy tracking and improvement
- Template recognition for common document formats
- Continuous learning from user interactions

## User Interface Architecture

### Design System Principles

**Functional Minimalism**
- Every interface element serves a specific purpose
- Elimination of decorative elements that don't add functional value
- Clean, uncluttered layouts with purposeful white space

**Information Density Optimization**
- Maximum useful data display without overwhelming users
- Structured information hierarchy using typography, spacing, and visual containers
- Progressive disclosure for detailed information

**Consistency Standards**
- Uniform component behavior across all system modules
- Standardized interaction patterns for buttons, forms, tables, modals
- Consistent visual language and terminology

### Navigation Architecture

**Primary Navigation**
- Collapsible left sidebar menu with icon fallback
- Hierarchical menu structure reflecting user workflow
- Role-based menu customization

**Breadcrumb System**
- Persistent navigation path display
- Format example: `Projects > "Lake House Project" > Procurement > Furniture Specification`
- Click-through navigation to parent levels

**Form Design Standards**
- Field labels positioned above input fields
- Real-time validation with immediate feedback
- Clear error messaging and correction guidance

**Notification System**
- Centralized notification center (bell icon in header)
- Non-intrusive alert delivery
- Categorized notifications by type and priority

## Subscription Model Architecture

### Client/Design Studio Tiers

**Free Plan ("Start")**
- Purpose: Risk-free platform evaluation
- Limitations: 1 active project, 3 specifications per project, 5 proposals per specification
- Storage: 1 GB file storage
- AI Features: Manual specification creation only (no AI analyzer)
- Support: Community forums only

**Pro Plan ("Professional")**
- Target: Freelancers and small design studios
- Core Value: Full AI document analyzer access
- Capacity: 10 active projects, unlimited specifications and proposals
- Storage: 20 GB file storage
- Support: Priority technical support
- Billing: Monthly or annual subscription (annual discount available)

**Business Plan ("Team")**
- Target: Multi-person design studios
- Enhanced Features: Unlimited projects, team management capabilities
- Team Management: User invitation system, role assignment, project access control
- Analytics: Team performance metrics and efficiency reporting
- Storage: 100 GB file storage
- Support: Dedicated account manager

### Supplier Monetization Strategy

**Base Access (Free)**
- Registration and basic platform access
- Technical specification viewing and proposal submission
- Essential for platform ecosystem growth

**Future Monetization Options**
- PRO Supplier Account: Enhanced visibility, expanded catalog capacity, performance analytics
- Promotional Services: Featured placement in search results and catalog browsing

## Testing Strategy

### System Testing Approach

**AI Component Testing**
- Document processing accuracy validation
- Entity extraction precision measurement
- Edge case handling for various document formats
- Performance testing for large file processing

**User Experience Testing**
- Role-based workflow validation
- Cross-browser compatibility verification
- Mobile responsiveness testing
- Accessibility compliance validation

**Integration Testing**
- End-to-end workflow testing
- API integration validation
- Third-party service integration testing
- Data consistency verification across modules

**Performance Testing**
- Load testing for concurrent user scenarios
- File processing performance optimization
- Database query optimization
- Real-time collaboration performance

### Quality Assurance Framework

**Automated Testing**
- Unit tests for core business logic
- Integration tests for API endpoints
- UI automation for critical user workflows

**User Acceptance Testing**
- Role-based testing scenarios
- Real-world project simulation
- Stakeholder feedback collection and integration