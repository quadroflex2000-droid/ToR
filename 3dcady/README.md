# 3dcady - AI-Powered Interior Project Hub

A comprehensive platform that serves as a central hub for interior design projects, connecting clients, design studios, suppliers, contractors, and freelancers in a unified ecosystem.

## 🚀 Features

### ✅ Completed Features

#### Core Platform
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Prisma ORM
- **Authentication System**: NextAuth.js with Google OAuth and credentials
- **Role-Based Access Control**: Client, Supplier, and Admin roles
- **Responsive Design**: Mobile-first approach with modern UI components

#### Client/Design Studio Features
- **Dashboard**: Project overview, budget analytics, incoming proposals, and calendar widgets
- **Project Management**: Kanban-style boards with drag-and-drop functionality
- **Budget Tracking**: Real-time budget vs actual expense tracking with variance analysis
- **Proposal Management**: View and compare supplier proposals

#### Supplier/Contractor Features
- **Supplier Dashboard**: Opportunity feed, proposal tracking, and performance metrics
- **Product Catalog**: Complete catalog management system with grid/list views
- **Opportunity Management**: Browse and filter project opportunities
- **Order Tracking**: Active order management with progress tracking

#### AI-Powered Features
- **Document Analyzer**: AI-powered extraction of technical specifications from PDFs, DOCX, XLSX
- **OpenAI Integration**: Intelligent document parsing and categorization
- **Specification Generation**: Automatic creation of structured specifications from documents

#### Database & API
- **Comprehensive Schema**: Complete database design for all platform features
- **RESTful APIs**: Document upload, analysis, user management endpoints
- **File Processing**: Support for multiple document formats
- **Data Validation**: Robust input validation and error handling

### 🎯 Architecture

#### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI GPT-4 for document analysis
- **File Processing**: PDF-parse, Mammoth, XLSX libraries
- **UI Components**: Heroicons, Recharts, DnD Kit

#### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Client dashboard
│   ├── supplier/          # Supplier portal
│   ├── projects/          # Project management
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard components
│   ├── supplier/          # Supplier-specific components
│   ├── project-management/# Kanban board components
│   └── catalog/           # Product catalog components
├── lib/                   # Utility libraries
│   ├── ai/               # AI processing logic
│   ├── file-processing/   # Document processing
│   └── auth-utils.ts      # Authentication utilities
└── types/                 # TypeScript type definitions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (for AI features)

### Environment Variables
Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/3dcady"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# File Upload
MAX_FILE_SIZE_MB=100
UPLOAD_DIR="./uploads"
```

### Installation Steps

1. **Clone and Install**
   ```bash
   cd 3dcady
   npm install
   ```

2. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Create an account or sign in with Google

## 📋 Usage Guide

### For Clients/Design Studios

1. **Getting Started**
   - Create an account and select "Client / Design Studio"
   - Access the dashboard to see project overview

2. **Project Management**
   - Create new projects
   - Upload project documents for AI analysis
   - Use Kanban boards to track project stages
   - Monitor budget vs actual expenses

3. **Working with Suppliers**
   - Review incoming proposals
   - Compare proposals side-by-side
   - Accept/reject proposals
   - Track order progress

### For Suppliers/Contractors

1. **Profile Setup**
   - Create a supplier account
   - Complete your company profile
   - Add verification documents

2. **Product Catalog**
   - Add products with detailed specifications
   - Upload product images
   - Set pricing and availability
   - Organize by categories

3. **Business Development**
   - Browse project opportunities
   - Submit competitive proposals
   - Track proposal status
   - Manage active orders

## 🔧 Key Features Deep Dive

### AI Document Analyzer
- **Supported Formats**: PDF, DOCX, XLSX, TXT
- **Extraction Capabilities**: 
  - Item names and quantities
  - Technical specifications
  - Category classification
  - Quality confidence scoring
- **Output**: Structured technical specifications ready for supplier bidding

### Project Management System
- **Kanban Boards**: Drag-and-drop task management
- **Customizable Stages**: Adapt workflow to your process
- **Real-time Updates**: Live collaboration features
- **Progress Tracking**: Visual progress indicators

### Supplier Marketplace
- **Smart Filtering**: Find suppliers by category, location, rating
- **Proposal System**: Structured bidding process
- **Performance Metrics**: Track success rates and response times
- **Order Management**: Full order lifecycle tracking

## 🔒 Security & Authentication

- **Role-Based Access**: Granular permissions system
- **Secure Authentication**: NextAuth.js with multiple providers
- **Data Protection**: Encrypted sensitive data storage
- **File Security**: Secure file upload and processing
- **API Security**: Request validation and rate limiting

## 🎨 Design System

The platform follows a **functional minimalism** approach:
- **Clean Interface**: Purposeful design without clutter
- **Information Density**: Maximum useful data display
- **Consistent UX**: Standardized interaction patterns
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 📊 Subscription Tiers

### Free Plan ("Start")
- 1 active project
- 3 specifications per project
- 5 proposals per specification
- 1 GB file storage
- Manual specification creation only

### Pro Plan ("Professional")
- 10 active projects
- Unlimited specifications and proposals
- 20 GB file storage
- **AI document analyzer access**
- Priority technical support

### Business Plan ("Team")
- Unlimited projects
- Team management capabilities
- 100 GB file storage
- Advanced analytics
- Dedicated account manager

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS**
- **Google Cloud Platform**

### Production Checklist
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up file storage (AWS S3 recommended)
- [ ] Configure email service
- [ ] Set up monitoring and analytics
- [ ] Configure CDN for static assets

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time messaging system
- [ ] Advanced analytics and reporting
- [ ] Mobile applications (iOS/Android)
- [ ] Integration with CAD software
- [ ] Multi-language support
- [ ] Advanced AI features (image recognition, 3D model analysis)

### Integration Opportunities
- [ ] ERP system integrations
- [ ] Accounting software connections
- [ ] Payment gateway integration
- [ ] Calendar and scheduling tools
- [ ] Project management tool APIs

## 🤝 Contributing

This is a production-ready platform that can be extended with additional features. The modular architecture makes it easy to add new components and functionality.

## 📄 License

Proprietary software - All rights reserved.

## 📞 Support

For technical support or business inquiries, please contact the development team.

---

**3dcady - Streamlining Interior Design Projects with AI-Powered Intelligence**