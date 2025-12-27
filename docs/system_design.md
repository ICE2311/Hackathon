# System Design & Architecture 🏗️

GearGuard is designed as a centralized, full-stack maintenance hub, prioritizing operational consistency and technical scalability. This document outlines the high-level architecture and module responsibilities.

---

## 🏛️ High-Level Architecture

GearGuard follows a classic **Three-Tier Architecture** tailored for high responsiveness and data integrity:

1.  **Presentation Tier (Next.js 15)**: A modernized frontend utilizing React Server Components (RSC) and Client Components where appropriate. It handles UI rendering, client-side state (TanStack Query), and user interaction logic.
2.  **Logic Tier (NestJS)**: A structured TypeScript backend providing a RESTful API. It enforces business rules, role-based access control (RBAC), and orchestrates data transitions.
3.  **Data Tier (PostgreSQL + Prisma)**: A relational database ensuring ACID compliance. Prisma provides a type-safe abstraction layer, enabling efficient querying and schema evolution.

---

## 🧩 Module Responsibilities

### Frontend Modules

- **Auth Context**: Manages JWT lifecycle and global user identity.
- **Resource Pages**: (Equipment, Teams, Requests) Handles CRUD workflows and filtered data presentation.
- **Kanban Engine**: Implements stage-based visualization with optimistic state synchronization.
- **Permission Layer**: Client-side logic to conditionally render UI elements based on the authenticated user's role.

### Backend Modules

- **Auth Module**: Handles registration, login (Bcrypt/Passport JWT), and token generation.
- **Equipment Module**: Manages the life cycle of industrial assets (Active vs. Scrapped).
- **Maintenance Request Module**: The core "engine" of the application, managing work order creation, technician assignment, and stage transitions.
- **Reporting Service**: Aggregates database stats into meaningful KPIs (Trends, MTTR, Completion Rates).

---

## 🔄 Request Lifecycle

1.  **Submission**: An Employee or Manager submits a request via the frontend.
2.  **API Routing**: The logic tier interceptor validates the JWT and verifies the user's role permissions.
3.  **Business logic**: The service layer calculates auto-assignments (technician/team) based on the targeted equipment's metadata.
4.  **Persistence**: The database record is created, and an audit log (RequestLog) is appended.
5.  **Synchronization**: The frontend receives a 201 Created response and invalidates relevant cache keys (React Query) to refresh the Kanban and Dashboard.

---

## ⚖️ Design Trade-offs

### 1. Monolith vs. Microservices

**Choice**: Modular Monolith (NestJS).
**Rationale**: For the current scale of GearGuard, a modular monolith minimizes network latency and operational overhead while maintaining clear internal boundaries that allow for future microservice extraction if needed.

### 2. State Management

**Choice**: Server State (TanStack Query) vs. Client State (Redux).
**Rationale**: Since GearGuard is data-intensive, TanStack Query was chosen to handle caching, synchronization, and background refetching out of the box, significantly reducing boilerplate.

### 3. Database Selection

**Choice**: RDBMS (PostgreSQL).
**Rationale**: Maintenance data is inherently relational (User → Team → Equipment → Request). PostgreSQL's strong relational integrity and JSONB support provide the perfect balance for structured work orders and semi-structured notes.

---

## 🚀 Scalability Considerations

- **Stateless Auth**: JWTs allow the backend to scale horizontally without session synchronization.
- **Database Indexing**: Targeted indexes on `equipmentId`, `stage`, and `scheduledDate` ensure performant lookups even as the work order history grows.
- **Caching Strategy**: Implement Redis for frequently accessed dashboard metrics as the user base expands.
