# Inventory Management System (DreamsPOS)

## Overview
This is a full-stack Point of Sale (POS) and inventory management system designed to manage products, inventory, sales, purchases, customers, suppliers, and financial reports. The system provides comprehensive business tools with a modern UI and robust data management capabilities. The project uses a complete inventory management template with extensive features and a professional UI.

## Recent Changes
- **October 4, 2025**: Complete POS page redesign and frontend optimization
  - **Complete POS redesign** matching reference design with proper layout and CSS:
    - Top button bar with proper colors (View All Brands: navy, Barcode: orange, Dashboard: orange, Freshmart: cyan)
    - Three-column layout: left category sidebar (purple highlights), center product grid, right order management
    - Product cards with images, category tags, stock count, and prices
    - Complete order sidebar with Transaction ID, Customer dropdown, cart items with quantity controls
    - Payment Summary section with Shipping, Tax, Coupon, Discount calculations
    - Tax %, Shipping, Discount % input controls
    - Grand Total button (dark blue) and 6 action buttons (Hold, Payment, Void, View Orders, Reset, Transaction)
  - Fixed POS action button styling with proper colors matching reference image
  - Added success/danger/warning variants to Badge component, resolving all LSP type errors
  - Fixed critical query key mismatch - aligned all React Query keys ensuring proper cache invalidation
  - Migrated all Sass files from @import to @use/@forward syntax, eliminating all deprecation warnings
  - Connected Sales "Transaksi Baru" button to POS page for seamless navigation
  - Verified all CRUD operations working on Customers, Suppliers, Products, and Sales pages
  - All API endpoints tested and confirmed working
  - Application running smoothly with zero console errors

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing Wouter for routing and TanStack Query for server state management. The UI is constructed using Radix UI primitives and shadcn/ui components, styled with Tailwind CSS for a responsive, mobile-first design with dark mode support. Key features include real-time data fetching, file upload for product images, and interactive data visualizations. The project is actively migrating to a new UI template, involving the conversion of 197+ JSX pages to TypeScript, integrating Redux Toolkit for state management, and React Router v6 for navigation.

### Backend Architecture
The backend is a Node.js Express.js application written in TypeScript. It uses Drizzle ORM for type-safe database interactions and supports both in-memory storage (MemStorage) and PostgreSQL (DbStorage). Currently configured to use **in-memory storage** for development. It follows a RESTful API architecture with modular routes for various functionalities like dashboard analytics, product management, sales, purchases, customer/supplier management, and expense tracking. Multer handles file uploads for product images. The backend and frontend are served on the same port (5000) using Vite middleware in development.

### Database Schema
The database schema includes tables for `users`, `categories`, `products`, `customers`, `suppliers`, `sales`, `purchases`, and `expenses`, designed to support the core functionalities of the inventory system.

**Current Storage**: Using in-memory storage (MemStorage) which includes sample data for development. To switch to PostgreSQL, update `server/storage.ts` to use `DbStorage` instead of `MemStorage` and configure the `DATABASE_URL` environment variable.

### UI/UX Decisions
The system initially used shadcn/ui. The project is currently migrating to a comprehensive inventory management template, which includes 197+ pages, extensive SCSS styling, and a wide array of UI components from Bootstrap, Ant Design, and various chart/icon libraries. This migration aims to deliver a richer, more complete user interface.

### Technical Implementations
- **Frontend:** React 18, TypeScript, Wouter, TanStack Query, Radix UI, shadcn/ui, Tailwind CSS, Vite.
- **Backend:** Node.js, TypeScript, Express.js, PostgreSQL, Drizzle ORM, Multer.
- **Development Tools:** TypeScript with strict mode, Path aliases, Drizzle Kit for migrations, PostCSS, ESBuild.

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary data store.
- **Drizzle ORM**: Type-safe ORM for database operations.
- **Drizzle Zod**: For schema validation.

### UI Component Libraries
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Pre-styled component system (initial).
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **React Router DOM**: For client-side routing (part of the new template migration).
- **Redux Toolkit & React Redux**: For state management (part of the new template migration).
- **Bootstrap**: UI framework (part of the new template migration).
- **Ant Design**: UI library (part of the new template migration).

### State & Data Management
- **TanStack Query (React Query)**: Server state management.
- **React Hook Form**: Form state management.
- **Zod**: Schema validation.

### File Handling
- **Multer**: Middleware for file uploads (images: JPEG, JPG, PNG, GIF, max 5MB).

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express.

### Additional Utilities
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
- **cmdk**: Command menu component.
- **class-variance-authority**: Component variant styling.