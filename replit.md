# TaskFlow Project Management System

## Overview

TaskFlow is a modern web-based project management application built with React, Express, and TypeScript. It provides a comprehensive solution for managing projects and tasks with an intuitive user interface and robust backend API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build processes
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: shadcn/ui for consistent UI components
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for API state, React Context for local state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for projects and tasks
- **Validation**: Zod schemas for request validation
- **Storage**: In-memory storage with interface for easy database integration
- **Error Handling**: Centralized error handling middleware

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Projects**: Core project management with status tracking, due dates, and color coding
- **Tasks**: Individual tasks linked to projects with priority levels and completion status

### Component Structure
- **Layout Components**: Sidebar navigation and header with search functionality
- **Page Components**: Dashboard, Projects, Tasks views, Project Detail view, and Task Detail view
- **UI Components**: Comprehensive set of reusable UI components from shadcn/ui
- **Modal Components**: Project and task creation/editing modals with full form validation
- **Card Components**: Project cards and task items for data display with clickable navigation
- **Theme Components**: Dark/light mode toggle with localStorage persistence

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks to fetch data
2. **API Layer**: Express.js routes handle HTTP requests and validate input
3. **Storage Layer**: Abstract storage interface allows for flexible data persistence
4. **Response Handling**: Structured JSON responses with proper error handling
5. **State Updates**: TanStack Query automatically updates UI when data changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Runtime type validation
- **react-hook-form**: Form state management

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **@types/***: Type definitions

## Deployment Strategy

### Development
- Vite development server for frontend with hot module replacement
- Express server with TypeScript compilation via tsx
- Automatic restarts and error overlay for development experience

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild compiles TypeScript to optimized Node.js bundle
- Static assets served by Express in production

### Database Migration
- Drizzle Kit handles database schema migrations
- Environment-based configuration for different deployment stages

### Key Features
- **Project Management**: Create, update, and track projects with status and due dates
- **Task Management**: Organize tasks within projects with priority levels and completion tracking
- **Dashboard**: Overview of project statistics and recent activity
- **Project Detail Pages**: Detailed view of individual projects with statistics and task lists
- **Task Detail Pages**: Complete task information with editing capabilities and status management
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Real-time Updates**: Optimistic updates and automatic data synchronization
- **Task Editing**: Full CRUD operations for tasks with modal-based editing interface

### Configuration
- **TypeScript**: Strict type checking with path aliases for clean imports
- **Tailwind**: Custom design system with CSS variables for theming
- **Build**: Separate build processes for client and server with optimized outputs