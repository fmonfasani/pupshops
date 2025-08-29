# PupShops - Pet Marketplace Application

## Overview

PupShops is a comprehensive fullstack pet marketplace application that provides a complete platform for pet owners to purchase products and book professional services. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data storage and Replit Auth for authentication. The platform includes both customer-facing features (product browsing, service booking, shopping cart) and administrative capabilities (product management, order tracking, analytics dashboard).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom pastel green and orange color scheme
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for API development
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Authentication**: Replit Auth integration with session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and validation
- **Middleware**: Custom logging, JSON parsing, and authentication guards

### Database Design
- **Primary Database**: PostgreSQL for relational data storage
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema Management**: Drizzle Kit for schema migrations and updates
- **Key Entities**:
  - Users with role-based access (user/admin) and loyalty points system
  - Products with categories, inventory tracking, and pet type filtering
  - Services with pricing, duration, and booking capabilities
  - Orders and order items for purchase tracking
  - Bookings for service appointments
  - Cart items for shopping cart functionality
  - Categories for product organization
  - Sessions for authentication state

### Authentication & Authorization
- **Primary Auth**: Replit OpenID Connect (OIDC) for secure authentication
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Role-Based Access**: User and admin roles with protected routes
- **Security Features**: HTTP-only secure cookies, CSRF protection, and session expiration

### Key Features Architecture
- **Shopping Cart**: Real-time cart management with quantity updates and persistence
- **Service Booking**: Calendar-based appointment scheduling with conflict detection
- **Loyalty System**: Point-based rewards system with user levels (bronze, silver, gold)
- **Admin Dashboard**: Comprehensive management interface for products, services, orders, and analytics
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **express**: Web application framework for Node.js
- **passport**: Authentication middleware with OpenID Connect strategy

### UI & Styling Dependencies
- **@radix-ui/***: Accessible UI component primitives (dialog, select, button, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Variant-based component styling
- **lucide-react**: Modern icon library

### Form & Validation Dependencies
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation library

### Development & Build Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **eslint**: Code linting and formatting
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Session & Security Dependencies
- **connect-pg-simple**: PostgreSQL session store for Express
- **openid-client**: OpenID Connect client for authentication
- **ws**: WebSocket implementation for real-time features

### Payment Integration (Ready for Implementation)
- **@stripe/stripe-js**: Payment processing framework (prepared for future integration)
- **@stripe/react-stripe-js**: React components for Stripe integration

### Optional Enhancement Dependencies
- **date-fns**: Date manipulation and formatting utilities
- **memoizee**: Function memoization for performance optimization