# Inventory Management System

## Overview
This is a full-stack inventory management system designed to manage products, inventory, sales, purchases, customers, suppliers, and financial reports. The system aims to provide comprehensive business tools with a modern UI and robust data management capabilities. The project is currently undergoing a significant UI/UX migration to a more complete inventory management template to enhance its capabilities and user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing Wouter for routing and TanStack Query for server state management. The UI is constructed using Radix UI primitives and shadcn/ui components, styled with Tailwind CSS for a responsive, mobile-first design with dark mode support. Key features include real-time data fetching, file upload for product images, and interactive data visualizations. The project is actively migrating to a new UI template, involving the conversion of 197+ JSX pages to TypeScript, integrating Redux Toolkit for state management, and React Router v6 for navigation.

### Backend Architecture
The backend is a Node.js Express.js application written in TypeScript, using PostgreSQL (via Neon serverless) as the database and Drizzle ORM for type-safe database interactions. It follows a RESTful API architecture with modular routes for various functionalities like dashboard analytics, product management, sales, purchases, customer/supplier management, and expense tracking. Multer handles file uploads for product images.

### Database Schema
The database schema includes tables for `users`, `categories`, `products`, `customers`, `suppliers`, `sales`, `purchases`, and `expenses`, designed to support the core functionalities of the inventory system.

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