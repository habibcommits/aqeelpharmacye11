# Aqeel Pharmacy E-Commerce Platform

## Overview

Aqeel Pharmacy is a modern, serverless e-commerce platform built for an online pharmacy in Pakistan. The application provides a comprehensive shopping experience for health and beauty products including skincare, haircare, makeup, vitamins, medicines, and baby care items. The platform features a customer-facing storefront with product browsing, cart management, and checkout capabilities, alongside an administrative dashboard for managing inventory, orders, and brands.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS for utility-first styling with custom design system

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library (New York style variant) with customized theme
- Custom design tokens defined in CSS variables for colors, spacing, and shadows
- Responsive grid-based layouts optimized for mobile-first design
- Dark mode support via ThemeProvider context

**State Management:**
- CartContext for shopping cart state (persisted to localStorage)
- ThemeContext for dark/light mode preferences
- React Query for server-side data caching and synchronization
- Local component state for UI interactions

**Key Design Decisions:**
- Product-first visual hierarchy following pharmacy e-commerce best practices
- Trust-building elements (authenticity badges, delivery promises, return policy)
- Optimized for conversion with clear CTAs and streamlined checkout
- Professional aesthetic appropriate for healthcare/medical context

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running on Node.js
- RESTful API design with JSON payloads
- In-memory storage abstraction layer (IStorage interface)
- Development mode with Vite middleware integration for HMR

**API Structure:**
- `/api/products` - Product CRUD operations with filtering by category, featured status, and slug
- `/api/categories` - Category management
- `/api/brands` - Brand management
- `/api/orders` - Order creation and tracking
- `/api/banners` - Homepage banner management

**Storage Layer:**
- Abstract storage interface supporting multiple implementations
- Currently using in-memory storage with plans for PostgreSQL via Drizzle ORM
- Schema definitions in shared module for type safety across client/server

**Build & Deployment:**
- esbuild for server bundling with selective dependency bundling
- Vite for client bundling with code splitting
- Single production build outputs to `dist/` directory
- Server serves static files in production mode

### Data Schema Design

**Core Entities:**

1. **Users** - Authentication and admin role management
   - UUID primary keys
   - Username-based authentication
   - Admin flag for role-based access

2. **Products** - Main inventory items
   - Multiple image support (array field)
   - Price and compare price for discount display
   - Stock tracking and featured product flags
   - Relationships to categories and brands via foreign keys
   - SEO-friendly slugs for URLs

3. **Categories** - Product organization
   - Hierarchical structure with parent-child relationships
   - Slug-based routing
   - Image support for category cards

4. **Brands** - Product manufacturers/brands
   - Logo images for brand showcase
   - Slug-based filtering

5. **Orders** - Purchase transactions
   - Order number generation for tracking
   - Customer information (name, email, phone)
   - Shipping address details
   - Status workflow (pending → processing → shipped → completed/cancelled)
   - Line items stored separately for flexibility

6. **Banners** - Homepage carousel content
   - Image URLs and linking
   - Active/inactive flags
   - Ordering support

**Schema Design Patterns:**
- Zod schemas for runtime validation using drizzle-zod integration
- Shared type definitions between client and server via TypeScript
- Soft relationships (no enforced foreign keys in current storage implementation)
- Support for optional fields to allow gradual data entry

### Session & Authentication

**Current Implementation:**
- Session storage ready via connect-pg-simple for PostgreSQL
- Passport.js infrastructure prepared for local strategy
- JWT support dependencies installed but not yet implemented
- Admin flag in user schema for role-based access control

**Planned Authentication Flow:**
- Local username/password authentication
- Session-based authentication for admin panel
- Cookie-based session management
- Protected routes on both client and server

### Image & Asset Management

**Strategy:**
- Product images stored as URL arrays (external hosting expected)
- Static assets served from `attached_assets` directory
- Logo and brand images via URL references
- Image optimization delegated to external CDN (ImageKit mentioned in project proposal)
- Fallback placeholder images for missing product photos

### Form Handling & Validation

**Approach:**
- React Hook Form for form state management
- Zod schemas for validation rules
- @hookform/resolvers for Zod integration
- Server-side validation using same Zod schemas
- Shared validation logic between client and server

### Development Workflow

**Hot Module Replacement:**
- Vite dev server integrated into Express via middleware
- WebSocket-based HMR for instant updates
- Separate Vite HMR path (`/vite-hmr`) to avoid conflicts
- Template reloading with cache busting for index.html

**Type Safety:**
- Strict TypeScript configuration
- Shared types directory for client/server overlap
- Path aliases for clean imports (@/, @shared/, @assets/)
- No-emit mode for type checking without build artifacts

## External Dependencies

### Database
- **Drizzle ORM** - Type-safe SQL query builder and migration tool
- **PostgreSQL** - Planned production database (configured but not yet provisioned)
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### UI Component Libraries
- **Radix UI** - Headless, accessible component primitives (20+ packages for dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui** - Pre-built components using Radix primitives with Tailwind styling
- **Lucide React** - Icon library for UI elements
- **Embla Carousel** - Carousel/slider functionality for product galleries and banners

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe variant API for component styles
- **clsx & tailwind-merge** - Conditional class name utilities

### Data Fetching & State
- **TanStack Query (React Query)** - Server state management with caching and synchronization
- **date-fns** - Date manipulation and formatting

### Form Management
- **React Hook Form** - Performant form state management
- **Zod** - Schema validation for forms and API payloads
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Third-Party Services (Planned)
- **ImageKit** - CDN and image optimization service (referenced in project proposal)
- **Email Service** - Nodemailer dependency installed for order confirmations
- **Payment Gateway** - Stripe dependency present (not yet implemented)

### Development Tools
- **Replit Plugins** - Cartographer for code navigation, dev banner, runtime error overlay
- **TypeScript** - Type safety across entire codebase
- **ESBuild** - Fast JavaScript bundler for server code
- **Vite** - Modern build tool for client code

### Build & Runtime
- **Express** - Web server framework
- **Wouter** - Lightweight routing library for React
- **nanoid** - Unique ID generation for sessions and cache busting

## Recent Changes

### December 2024 - SEO & Partner Import Features

**Vercel Deployment Ready:**
- Updated `vercel.json` with proper API rewrites and security headers
- Added sitemap.xml and robots.txt routes for SEO
- Domain configured: aqeelpharmacy.com
- Contact email: contact@aqeelpharmacy.com

**SEO Enhancements:**
- Comprehensive meta tags in index.html (Open Graph, Twitter Cards)
- Schema.org structured data (Pharmacy, Organization, WebSite)
- Dynamic sitemap.xml generation at /sitemap.xml
- robots.txt with crawling rules at /robots.txt
- Canonical URLs and proper indexing directives

**Najeeb Pharmacy Import Feature:**
- New admin tab: "Najeeb Pharmacy" for importing products from partner website
- Backend API `/api/admin/import-najeeb` scrapes products from najeebpharmacy.com
- Automatic category detection based on product names
- Duplicate detection to prevent re-importing existing products
- Pagination support (232 pages available, 12 products per page)

**Partner Import Features:**
- Import products with name, price, images from partner websites
- Automatic slug generation for SEO-friendly URLs
- Category matching based on keyword detection
- Default stock levels and active status for imported products