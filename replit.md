# Inventory Management System

## Overview

This is a full-stack inventory management system built with React, Express, and PostgreSQL. The application provides comprehensive tools for managing products, inventory, sales, purchases, customers, suppliers, and generating financial reports. It features a modern UI built with shadcn/ui components and uses Drizzle ORM for database management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state
- **UI Components:** Radix UI primitives with shadcn/ui design system
- **Styling:** Tailwind CSS with CSS variables for theming
- **Build Tool:** Vite

**Design Patterns:**
- Component-based architecture with reusable UI components in `/client/src/components/ui`
- Custom hooks for common functionality (mobile detection, toast notifications)
- Layout wrapper pattern with persistent sidebar and header
- Form handling with React Hook Form and Zod validation
- Centralized API client with automatic error handling

**Key Features:**
- Responsive design with mobile-first approach
- Dark mode support through CSS custom properties
- Real-time data fetching and caching with React Query
- File upload support for product images
- Interactive charts and data visualization

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (via Neon serverless)
- **ORM:** Drizzle ORM
- **File Handling:** Multer for image uploads

**Design Patterns:**
- RESTful API architecture
- Modular route organization in `/server/routes.ts`
- Storage abstraction layer (`IStorage` interface) for database operations
- Middleware-based request logging and JSON body parsing
- Development/production environment separation

**API Structure:**
- `/api/dashboard/stats` - Dashboard metrics and analytics
- `/api/products/*` - Product CRUD and inventory management
- `/api/categories/*` - Category management
- `/api/sales/*` - Sales transactions and reporting
- `/api/purchases/*` - Purchase orders and tracking
- `/api/customers/*` - Customer relationship management
- `/api/suppliers/*` - Supplier management
- `/api/expenses/*` - Expense tracking

**Database Schema:**
- **users** - Authentication and user management
- **categories** - Product categorization
- **products** - Inventory items with SKU, pricing, stock levels
- **customers** - Customer profiles with purchase history
- **suppliers** - Supplier information
- **sales** - Sales transactions with line items
- **purchases** - Purchase orders with line items
- **expenses** - Business expense tracking

### Development Environment

**Build Configuration:**
- TypeScript with strict mode enabled
- Path aliases (`@/`, `@shared/`) for clean imports
- Separate client and server builds
- Hot module replacement in development
- ESBuild for production server bundling

**Development Tools:**
- Replit-specific plugins for development banner and error overlay
- Drizzle Kit for database migrations
- PostCSS with Tailwind for CSS processing

## External Dependencies

### Database & ORM
- **PostgreSQL** - Primary data store (via Neon serverless driver)
- **Drizzle ORM** - Type-safe database operations with schema validation
- **Drizzle Zod** - Schema-to-Zod conversion for runtime validation

### UI Component Libraries
- **Radix UI** - Unstyled, accessible component primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui** - Pre-styled component system built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### State & Data Management
- **TanStack Query (React Query)** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### File Handling
- **Multer** - File upload middleware (image uploads limited to 5MB)
- Supports: JPEG, JPG, PNG, GIF formats
- Storage location: `/uploads` directory

### Development Dependencies
- **Vite** - Frontend build tool and dev server
- **tsx** - TypeScript execution for Node.js
- **Wouter** - Lightweight routing library

### Session Management
- **connect-pg-simple** - PostgreSQL session store for Express

### Additional Utilities
- **date-fns** - Date manipulation and formatting
- **clsx & tailwind-merge** - Conditional CSS class management
- **cmdk** - Command menu component
- **class-variance-authority** - Component variant styling