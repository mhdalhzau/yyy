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

---

## 🚀 TEMPLATE UI MIGRATION CHECKLIST

### Status: IN PROGRESS
**Tujuan:** Mengganti seluruh UI aplikasi dengan template inventory management system yang lengkap (197+ halaman)

### PHASE 1: PERSIAPAN & SETUP DASAR ✅

#### 1.1 Ekstraksi & Analisa Template
- [x] Extract template dari `attached_assets/template_1759369941578.zip`
- [x] Analisa struktur template (React + React Router + Redux + Bootstrap)
- [x] Buat rencana migrasi dengan architect
- [x] Identifikasi 197 halaman JSX yang perlu dimigrasikan

#### 1.2 Instalasi Dependencies (54/56 packages berhasil)
- [x] React Router DOM v6.22.3
- [x] Redux Toolkit v2.2.1 + React Redux v9.1.0
- [x] Bootstrap v5.3.3
- [x] Ant Design v5.15.2
- [x] SASS v1.72.0
- [x] Chart libraries (ApexCharts, Chart.js, React-ApexCharts, React-ChartJs-2)
- [x] Date/Time libraries (moment, dayjs, react-datepicker, react-datetime-picker, react-date-range, react-bootstrap-daterangepicker)
- [x] Calendar (@fullcalendar/react + plugins)
- [x] Icon libraries (Font Awesome, Feather Icons, Boxicons)
- [x] UI Components (react-select, react-dropzone, react-bootstrap, SweetAlert2, PrimeReact, react-helmet, datatables.net)
- [x] Additional UI (react-slick, slick-carousel, dragula, react-dnd, react-draggable, react-countup, react-input-mask, clipboard-copy, react-tag-input-component)
- [x] Editors (react-simple-wysiwyg) - CKEditor gagal install (npm cache error)
- [x] Other utilities (prop-types, lightbox libraries, sticky notes, star rating)

#### 1.3 Copy Assets & Styles
- [x] Copy 831 gambar (13MB) dari `template_extracted/public/assets/` ke `client/public/assets/`
  - [x] 202 icons (SVG/PNG)
  - [x] 35 user avatars
  - [x] 86 product images
  - [x] 245 flags
  - [x] 17 subdirectories lengkap
- [x] Copy 34 font files (5.9MB) dari `template_extracted/src/style/fonts/` ke `client/public/fonts/`
- [x] Copy 68 SCSS files dari `template_extracted/src/style/scss/` ke `client/src/style/scss/`
  - [x] base/ (2 files)
  - [x] components/ (25 files)
  - [x] layout/ (13 files)
  - [x] pages/ (22 files)
  - [x] utils/ (2 files)
  - [x] vendors/ (2 files)
  - [x] main.scss
- [x] Copy 4 CSS files ke `client/src/style/css/`
- [x] Copy 26 Font Awesome files ke `client/src/style/icons/`
- [x] Buat entry point `client/src/template-styles.scss`

### PHASE 2: FOUNDATION SETUP 🔄 (SEDANG DIKERJAKAN)

#### 2.1 Redux Store Setup
- [ ] Copy `template_extracted/src/core/redux/` ke `client/src/core/redux/`
  - [ ] store.jsx → store.tsx (convert + TypeScript)
  - [ ] reducer.jsx → reducer.tsx (30+ action types)
  - [ ] action.jsx → action.tsx  
  - [ ] initial.value.jsx → initial.value.tsx
- [ ] Review & adapt Redux untuk Vite environment
- [ ] Test Redux store configuration

#### 2.2 React Router v6 Setup
- [ ] Copy `template_extracted/src/Router/` ke `client/src/router/`
  - [ ] router.jsx → router.tsx (convert + TypeScript)
  - [ ] router.link.jsx → router.link.tsx (193 routes)
  - [ ] all_routes.js → all_routes.ts
- [ ] Adapt routes untuk API structure saat ini
- [ ] Configure route groups: publicRoutes, pagesRoute, posRoutes

#### 2.3 Core Layout Components
- [ ] Copy `template_extracted/src/InitialPage/` ke `client/src/InitialPage/`
  - [ ] Sidebar/Sidebar.jsx → Sidebar.tsx
  - [ ] Sidebar/Header.jsx → Header.tsx
  - [ ] themeSettings.jsx → themeSettings.tsx
- [ ] Copy core utilities:
  - [ ] pagination/ → client/src/core/pagination/
  - [ ] breadcrumbs.jsx → breadcrumbs.tsx
  - [ ] filter/ → client/src/core/filter/
  - [ ] json/ → client/src/core/json/ (mock data)
- [ ] Copy plugins: `template_extracted/src/style/plugins/` → `client/src/style/plugins/`
- [ ] Copy loader: `template_extracted/src/feature-module/loader/` → `client/src/feature-module/loader/`

#### 2.4 Main Entry Point
- [ ] Create `client/src/main-template.tsx` with:
  - [ ] React Router BrowserRouter setup
  - [ ] Redux Provider + store
  - [ ] Bootstrap CSS import
  - [ ] Template styles import
  - [ ] Icon libraries CSS
  - [ ] App shell rendering
- [ ] Copy & convert `environment.jsx` → `environment.ts`
- [ ] Update `client/index.html` untuk root div
- [ ] Configure path aliases di `vite.config.ts` untuk @ imports

### PHASE 3: CORE COMPONENTS & MODALS 📦 (BELUM MULAI)

#### 3.1 UI Interface Components (50+ components)
- [ ] Copy `template_extracted/src/feature-module/uiinterface/` ke `client/src/feature-module/uiinterface/`
- [ ] Basic UI:
  - [ ] accordion.jsx → accordion.tsx
  - [ ] alert.jsx → alert.tsx
  - [ ] avatar.jsx → avatar.tsx
  - [ ] badges.jsx → badges.tsx
  - [ ] borders.jsx → borders.tsx
  - [ ] breadcrumb.jsx → breadcrumb.tsx
  - [ ] buttons.jsx + buttonsgroup.jsx → TypeScript
  - [ ] cards.jsx → cards.tsx
  - [ ] carousel.jsx → carousel.tsx
  - [ ] colors.jsx → colors.tsx
  - [ ] dropdowns.jsx → dropdowns.tsx
  - [ ] grid.jsx → grid.tsx
  - [ ] images.jsx → images.tsx
  - [ ] lightbox.jsx → lightbox.tsx
  - [ ] media.jsx → media.tsx
  - [ ] modals.jsx → modals.tsx
  - [ ] navtabs.jsx → navtabs.tsx
  - [ ] offcanvas.jsx → offcanvas.tsx
  - [ ] pagination.jsx → pagination.tsx
  - [ ] placeholder.jsx → placeholder.tsx
  - [ ] popover.jsx → popover.tsx
  - [ ] progress.jsx → progress.tsx
  - [ ] rangeslider.jsx → rangeslider.tsx
  - [ ] spinner.jsx → spinner.tsx
  - [ ] sweetalert.jsx → sweetalert.tsx
  - [ ] toasts.jsx → toasts.tsx
  - [ ] tooltips.jsx → tooltips.tsx
  - [ ] typography.jsx → typography.tsx
  - [ ] video.jsx → video.tsx

#### 3.2 Advanced UI Components
- [ ] advancedui/clipboard.jsx → clipboard.tsx
- [ ] advancedui/counter.jsx → counter.tsx
- [ ] advancedui/dragdrop.jsx → dragdrop.tsx
- [ ] advancedui/rating.jsx → rating.tsx
- [ ] advancedui/ribbon.jsx → ribbon.tsx
- [ ] advancedui/stickynote.jsx → stickynote.tsx
- [ ] advancedui/texteditor.jsx → texteditor.tsx
- [ ] advancedui/timeline.jsx → timeline.tsx
- [ ] advancedui/uiscrollbar.jsx → uiscrollbar.tsx

#### 3.3 Charts
- [ ] charts/apexcharts.jsx → apexcharts.tsx
- [ ] charts/chartjs.jsx → chartjs.tsx

#### 3.4 Forms
- [ ] forms/formelements/basic-inputs.jsx → basic-inputs.tsx
- [ ] forms/formelements/checkbox-radios.jsx → checkbox-radios.tsx
- [ ] forms/formelements/fileupload.jsx → fileupload.tsx
- [ ] forms/formelements/form-mask.jsx → form-mask.tsx
- [ ] forms/formelements/form-select.jsx → form-select.tsx
- [ ] forms/formelements/form-wizard.jsx → form-wizard.tsx
- [ ] forms/formelements/grid-gutters.jsx → grid-gutters.tsx
- [ ] forms/formelements/input-group.jsx → input-group.tsx
- [ ] forms/formelements/layouts/floating-label.jsx → floating-label.tsx
- [ ] forms/formelements/layouts/form-horizontal.jsx → form-horizontal.tsx
- [ ] forms/formelements/layouts/form-select2.jsx → form-select2.tsx
- [ ] forms/formelements/layouts/form-validation.jsx → form-validation.tsx
- [ ] forms/formelements/layouts/form-vertical.jsx → form-vertical.tsx

#### 3.5 Icons
- [ ] icons/feathericon.jsx → feathericon.tsx
- [ ] icons/flagicons.jsx → flagicons.tsx
- [ ] icons/fontawesome.jsx → fontawesome.tsx
- [ ] icons/ionicicons.jsx → ionicicons.tsx
- [ ] icons/materialicon.jsx → materialicon.tsx
- [ ] icons/pe7icons.jsx → pe7icons.tsx
- [ ] icons/simplelineicon.jsx → simplelineicon.tsx
- [ ] icons/themify.jsx → themify.tsx
- [ ] icons/typicons.jsx → typicons.tsx
- [ ] icons/weathericons.jsx → weathericons.tsx

#### 3.6 Tables
- [ ] table/tables-basic.jsx → tables-basic.tsx
- [ ] table/data-tables.jsx → data-tables.tsx

#### 3.7 Modal Components
- [ ] Copy `template_extracted/src/core/modals/` ke `client/src/core/modals/`
- [ ] applications/ (3 files: fileModal, notesModal, todoModal)
- [ ] coupons/ (2 files: addcoupons, editcoupons)
- [ ] delete/deletemodal.jsx
- [ ] hrm/ (16 files: attendance, department, designation, holidays, leaves, shift)
- [ ] inventory/ (19 files: brand, category, subcategory, unit, variant, warranty, barcode, qrcode)
- [ ] peoples/ (4 files: customerModal, storelist, supplierModal, warehouses)
- [ ] purchases/ (5 files: addpurchase, editpurchase, importpurchases, returns)
- [ ] sales/ (4 files: quotation, salesreturns)
- [ ] settings/ (20+ files: bank, currency, custom fields, IP address, printer, tax, AWS, Nexmo, Paypal, Twilio, 2FA)
- [ ] stocks/ (3 files: managestock, stockadjustment, stocktransfer)
- [ ] usermanagement/ (4 files: addrole, addusers, editrole, edituser)

### PHASE 4: DASHBOARD MODULE 📊 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/dashboard/` ke `client/src/feature-module/dashboard/`
  - [ ] Dashboard.jsx → Dashboard.tsx (Main Dashboard)
  - [ ] salesdashbaord.jsx → salesdashboard.tsx (Sales Dashboard)
- [ ] Connect dashboard ke backend API:
  - [ ] `/api/dashboard/stats`
  - [ ] `/api/products/top-selling`
  - [ ] `/api/products/low-stock`
  - [ ] `/api/customers/top`
  - [ ] `/api/sales/recent`

### PHASE 5: INVENTORY MODULE 📦 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/inventory/` ke `client/src/feature-module/inventory/`
- [ ] Product Management:
  - [ ] productlist.jsx → productlist.tsx
  - [ ] addproduct.jsx → addproduct.tsx
  - [ ] editproduct.jsx → editproduct.tsx
  - [ ] productdetail.jsx → productdetail.tsx
- [ ] Categories:
  - [ ] categorylist.jsx → categorylist.tsx
  - [ ] subcategories.jsx → subcategories.tsx
  - [ ] editsubcategories.jsx → editsubcategories.tsx
- [ ] Brands & Attributes:
  - [ ] brandlist.jsx → brandlist.tsx
  - [ ] units.jsx → units.tsx
  - [ ] variantattributes.jsx → variantattributes.tsx
  - [ ] warranty.jsx → warranty.tsx
- [ ] Stock Management:
  - [ ] lowstock.jsx → lowstock.tsx
  - [ ] expiredproduct.jsx → expiredproduct.tsx
- [ ] Barcodes:
  - [ ] printbarcode.jsx → printbarcode.tsx
  - [ ] qrcode.jsx → qrcode.tsx
- [ ] Text Editor:
  - [ ] texteditor.jsx → texteditor.tsx

### PHASE 6: SALES MODULE 💰 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/sales/` ke `client/src/feature-module/sales/`
  - [ ] pos.jsx → pos.tsx (Point of Sale)
  - [ ] saleslist.jsx → saleslist.tsx
  - [ ] quotationlist.jsx → quotationlist.tsx
  - [ ] salesreturn.jsx → salesreturn.tsx
  - [ ] invoicereport.jsx → invoicereport.tsx
- [ ] Connect ke API sales endpoints

### PHASE 7: PURCHASES MODULE 🛒 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/purchases/` ke `client/src/feature-module/purchases/`
  - [ ] purchaseslist.jsx → purchaseslist.tsx
  - [ ] purchasereturns.jsx → purchasereturns.tsx
  - [ ] purchaseorderreport.jsx → purchaseorderreport.tsx
- [ ] Connect ke API purchases endpoints

### PHASE 8: PEOPLE MODULE 👥 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/people/` ke `client/src/feature-module/people/`
  - [ ] customers.jsx → customers.tsx
  - [ ] suppliers.jsx → suppliers.tsx
- [ ] Connect ke API customers & suppliers endpoints

### PHASE 9: STOCK MANAGEMENT 📊 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/stock/` ke `client/src/feature-module/stock/`
  - [ ] managestock.jsx → managestock.tsx
  - [ ] stockAdjustment.jsx → stockAdjustment.tsx
  - [ ] stockTransfer.jsx → stockTransfer.tsx

### PHASE 10: FINANCE & ACCOUNTS 💵 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/FinanceAccounts/` ke `client/src/feature-module/FinanceAccounts/`
  - [ ] expenseslist.jsx → expenseslist.tsx
  - [ ] expensecategory.jsx → expensecategory.tsx
- [ ] Connect ke API expenses endpoints

### PHASE 11: REPORTS MODULE 📈 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/Reports/` ke `client/src/feature-module/Reports/`
  - [ ] salesreport.jsx → salesreport.tsx
  - [ ] purchasereport.jsx → purchasereport.tsx
  - [ ] inventoryreport.jsx → inventoryreport.tsx
  - [ ] invoicereport.jsx → invoicereport.tsx
  - [ ] supplierreport.jsx → supplierreport.tsx
  - [ ] customerreport.jsx → customerreport.tsx
  - [ ] expensereport.jsx → expensereport.tsx
  - [ ] incomereport.jsx → incomereport.tsx
  - [ ] taxreport.jsx → taxreport.tsx
  - [ ] profitloss.jsx → profitloss.tsx

### PHASE 12: HRM MODULE 👔 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/hrm/` ke `client/src/feature-module/hrm/`
- [ ] Employees:
  - [ ] employeesgrid.jsx → employeesgrid.tsx
  - [ ] addemployee.jsx → addemployee.tsx
  - [ ] editemployee.jsx → editemployee.tsx
- [ ] Attendance:
  - [ ] attendanceadmin.jsx → attendanceadmin.tsx
  - [ ] attendance-employee.jsx → attendance-employee.tsx
- [ ] Department & Structure:
  - [ ] departmentgrid.jsx → departmentgrid.tsx
  - [ ] departmentlist.jsx → departmentlist.tsx
  - [ ] designation.jsx → designation.tsx
  - [ ] shift.jsx → shift.tsx
- [ ] Leaves:
  - [ ] leavesadmin.jsx → leavesadmin.tsx
  - [ ] leavesemployee.jsx → leavesemployee.tsx
  - [ ] leavetypes.jsx → leavetypes.tsx
- [ ] Others:
  - [ ] holidays.jsx → holidays.tsx
  - [ ] payslip.jsx → payslip.tsx

### PHASE 13: APPLICATIONS MODULE 📱 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/Application/` ke `client/src/feature-module/Application/`
  - [ ] chat.jsx → chat.tsx
  - [ ] calendar.jsx → calendar.tsx
  - [ ] email.jsx → email.tsx
  - [ ] content.jsx → content.tsx
  - [ ] filemanager.jsx → filemanager.tsx
  - [ ] fileContent.jsx → fileContent.tsx
  - [ ] notes.jsx → notes.tsx
  - [ ] notesContent.jsx → notesContent.tsx
  - [ ] todo.jsx → todo.tsx
  - [ ] videocall.jsx → videocall.tsx
  - [ ] audiocall.jsx → audiocall.tsx
  - [ ] callhistory.jsx → callhistory.tsx

### PHASE 14: SETTINGS MODULE ⚙️ (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/settings/` ke `client/src/feature-module/settings/`

#### 14.1 General Settings
- [ ] generalsettings/generalsettings.jsx → generalsettings.tsx
- [ ] generalsettings/securitysettings.jsx → securitysettings.tsx
- [ ] generalsettings/notification.jsx → notification.tsx
- [ ] generalsettings/connectedapps.jsx → connectedapps.tsx

#### 14.2 Website Settings
- [ ] websitesettings/appearance.jsx → appearance.tsx
- [ ] websitesettings/companysettings.jsx → companysettings.tsx
- [ ] websitesettings/customfields.jsx → customfields.tsx
- [ ] websitesettings/languagesettings.jsx → languagesettings.tsx
- [ ] websitesettings/localizationsettings.jsx → localizationsettings.tsx
- [ ] websitesettings/possettings.jsx → possettings.tsx
- [ ] websitesettings/preference.jsx → preference.tsx
- [ ] websitesettings/prefixes.jsx → prefixes.tsx
- [ ] websitesettings/socialauthentication.jsx → socialauthentication.tsx
- [ ] websitesettings/systemsettings.jsx → systemsettings.tsx

#### 14.3 App Settings
- [ ] appsetting/invoicesettings.jsx → invoicesettings.tsx
- [ ] appsetting/printersettings.jsx → printersettings.tsx

#### 14.4 System Settings
- [ ] systemsettings/emailsettings.jsx → emailsettings.tsx
- [ ] systemsettings/gdprsettings.jsx → gdprsettings.tsx
- [ ] systemsettings/otpsettings.jsx → otpsettings.tsx
- [ ] systemsettings/smsgateway.jsx → smsgateway.tsx

#### 14.5 Financial Settings
- [ ] financialsettings/banksetting.jsx → banksetting.tsx
- [ ] financialsettings/banksettinggrid.jsx → banksettinggrid.tsx
- [ ] financialsettings/currencysettings.jsx → currencysettings.tsx
- [ ] financialsettings/paymentgateway.jsx → paymentgateway.tsx
- [ ] financialsettings/taxrates.jsx → taxrates.tsx

#### 14.6 Other Settings
- [ ] othersettings/ban-ipaddress.jsx → ban-ipaddress.tsx
- [ ] othersettings/storagesettings.jsx → storagesettings.tsx

#### 14.7 Settings Sidebar
- [ ] settingssidebar/index.jsx → index.tsx

#### 14.8 Tag Inputs
- [ ] reacttaginputs.jsx → reacttaginputs.tsx

### PHASE 15: USER MANAGEMENT MODULE 👤 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/usermanagement/` ke `client/src/feature-module/usermanagement/`
  - [ ] users.jsx → users.tsx
  - [ ] rolespermissions.jsx → rolespermissions.tsx
  - [ ] permissions.jsx → permissions.tsx
  - [ ] deleteaccount.jsx → deleteaccount.tsx

### PHASE 16: COUPONS MODULE 🎟️ (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/coupons/` ke `client/src/feature-module/coupons/`
  - [ ] coupons.jsx → coupons.tsx

### PHASE 17: AUTHENTICATION PAGES 🔐 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/pages/` ke `client/src/feature-module/pages/`

#### 17.1 Login Pages (3 variants)
- [ ] login/signin.jsx → signin.tsx
- [ ] login/signinTwo.jsx → signinTwo.tsx
- [ ] login/signinThree.jsx → signinThree.tsx

#### 17.2 Register Pages (3 variants)
- [ ] register/register.jsx → register.tsx
- [ ] register/registerTwo.jsx → registerTwo.tsx
- [ ] register/registerThree.jsx → registerThree.tsx

#### 17.3 Forgot Password (3 variants)
- [ ] forgotpassword/forgotpassword.jsx → forgotpassword.tsx
- [ ] forgotpassword/forgotpasswordTwo.jsx → forgotpasswordTwo.tsx
- [ ] forgotpassword/forgotpasswordThree.jsx → forgotpasswordThree.tsx

#### 17.4 Reset Password (3 variants)
- [ ] resetpassword/resetpassword.jsx → resetpassword.tsx
- [ ] resetpassword/resetpasswordTwo.jsx → resetpasswordTwo.tsx
- [ ] resetpassword/resetpasswordThree.jsx → resetpasswordThree.tsx

#### 17.5 Email Verification (3 variants)
- [ ] emailverification/emailverification.jsx → emailverification.tsx
- [ ] emailverification/emailverificationTwo.jsx → emailverificationTwo.tsx
- [ ] emailverification/emailverificationThree.jsx → emailverificationThree.tsx

#### 17.6 Two-Step Verification (3 variants)
- [ ] twostepverification/twostepverification.jsx → twostepverification.tsx
- [ ] twostepverification/twostepverificationTwo.jsx → twostepverificationTwo.tsx
- [ ] twostepverification/twostepverificationThree.jsx → twostepverificationThree.tsx

#### 17.7 Other Pages
- [ ] lockscreen.jsx → lockscreen.tsx
- [ ] profile.jsx → profile.tsx
- [ ] blankpage.jsx → blankpage.tsx
- [ ] comingsoon.jsx → comingsoon.tsx
- [ ] undermaintainence.jsx → undermaintainence.tsx

#### 17.8 Error Pages
- [ ] errorpages/error404.jsx → error404.tsx
- [ ] errorpages/error500.jsx → error500.tsx

### PHASE 18: COMPONENTS & UTILITIES 🔧 (BELUM MULAI)

- [ ] Copy `template_extracted/src/feature-module/components/` ke `client/src/feature-module/components/`
  - [ ] pagination.jsx → pagination.tsx
  - [ ] rightSidebar/index.jsx → index.tsx
  - [ ] antdstyle.css (copy as-is)

### PHASE 19: API INTEGRATION & ADAPTER LAYER 🔌 (BELUM MULAI)

#### 19.1 Create API Adapter
- [ ] Create `client/src/lib/api-adapter.ts`
- [ ] Map template expectations to real backend API
- [ ] Handle mock data vs real data transformation

#### 19.2 Connect Modules to Backend
- [ ] Dashboard → `/api/dashboard/*`
- [ ] Products → `/api/products/*`
- [ ] Categories → `/api/categories/*`
- [ ] Sales → `/api/sales/*`
- [ ] Purchases → `/api/purchases/*`
- [ ] Customers → `/api/customers/*`
- [ ] Suppliers → `/api/suppliers/*`
- [ ] Expenses → `/api/expenses/*`

#### 19.3 Data Flow Integration
- [ ] Replace mock JSON data dengan real API calls
- [ ] Integrate Redux actions dengan backend responses
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Implement optimistic updates where needed

### PHASE 20: TESTING & VERIFICATION ✅ (BELUM MULAI)

#### 20.1 Routing Verification
- [ ] Test all 193 routes accessible
- [ ] Verify route parameters work correctly
- [ ] Test navigation between pages
- [ ] Verify protected routes (if any)

#### 20.2 UI Verification
- [ ] Test semua 197 halaman render tanpa error
- [ ] Verify semua assets (images, icons, fonts) loading correctly
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify dark mode/theme switching (if applicable)
- [ ] Test all modals open/close correctly
- [ ] Verify all forms work properly

#### 20.3 Functionality Testing
- [ ] Test Dashboard metrics display correctly
- [ ] Test CRUD operations (Create, Read, Update, Delete) untuk:
  - [ ] Products
  - [ ] Categories
  - [ ] Sales
  - [ ] Purchases
  - [ ] Customers
  - [ ] Suppliers
- [ ] Test barcode/QR code generation
- [ ] Test report generation
- [ ] Test file uploads (product images)
- [ ] Test search & filter functionality
- [ ] Test pagination
- [ ] Test sorting

#### 20.4 Performance Testing
- [ ] Check bundle size
- [ ] Test page load times
- [ ] Optimize images if needed
- [ ] Check for console errors/warnings

### PHASE 21: FINALISASI 🎉 (BELUM MULAI)

- [ ] Clean up unused old files
- [ ] Remove old wouter routing
- [ ] Remove unused Tailwind/shadcn components (optional - keep for future use)
- [ ] Update vite.config.ts to use main-template.tsx as entry
- [ ] Final testing dengan workflow restart
- [ ] Update `.local/state/replit/agent/progress_tracker.md`
- [ ] Mark import as complete

---

## 📝 CATATAN PENTING

### Yang Sudah Dikerjakan:
1. ✅ Template sudah diekstrak lengkap (197 halaman JSX)
2. ✅ Dependencies terinstall 54/56 packages (96% success rate)
3. ✅ Assets lengkap tersalin (831 gambar + 34 fonts = ~19MB)
4. ✅ Styles lengkap tersalin (68 SCSS + 4 CSS + 26 Font Awesome files)
5. ✅ Struktur folder siap untuk migrasi

### Yang Sedang Dikerjakan:
- 🔄 PHASE 2: Foundation Setup (Redux + React Router + Core Layout)

### Next Steps:
1. Selesaikan foundation setup (Redux, Router, Layout)
2. Create main entry point dan test rendering
3. Mulai migrasi module per module secara sistematis
4. Integrate dengan backend API
5. Testing menyeluruh
6. Finalisasi

### Estimasi Total Files:
- JSX to TSX conversion: ~197 page files + ~100 component files + ~60 modal files = **~357 files**
- Redux/Router/Core: ~20 files
- **Total: ~377 files perlu dimigrasikan**

### Dependencies yang Gagal Install:
- ❌ @ckeditor/ckeditor5-build-classic (npm cache error)
- ❌ @ckeditor/ckeditor5-react (npm cache error)
- ✅ Alternatif tersedia: react-simple-wysiwyg sudah terinstall