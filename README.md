# GearGuard: The Ultimate Maintenance Tracker 🛡️

**GearGuard** is an enterprise-grade Maintenance Management System (MMS) designed to maximize industrial uptime and streamline technical operations. Inspired by world-class ERP maintenance modules (like Odoo and SAP), GearGuard integrates equipment lifecycle management, automated technical dispatch, and real-time performance analytics into a unified, high-performance platform.

---

## 🏗️ Business Context

### The Problem

Large-scale facilities often suffer from fragmented maintenance tracking. Breakdown (corrective) repairs are reported via disparate channels, leading to slow response times, while preventive maintenance (PM) schedules are frequently missed, resulting in costly equipment failures and safety risks.

### The GearGuard Solution

GearGuard bridges the gap between field reporting and technical execution. It provides a centralized hub where **Employees** can report issues, **Managers** can oversee facility health, and **Technicians** can execute workflows backed by smart automation and clear documentation.

---

## 🌟 Key Functional Pillars

### 1. Equipment Master

A comprehensive registry of all industrial assets, tracking serial numbers, department ownership, locations, and warranty cycles.

- **Smart Status Tracking**: Automated transition from `ACTIVE` to `SCRAPPED` based on repair outcomes.
- **Maintenance History**: Direct linkage to every work order ever performed on the asset.

### 2. Maintenance Teams & Auto-Assignment

Eliminate manual dispatch bottlenecks. GearGuard features logical team definitions (e.g., Electrical, IT, HVAC) with auto-assignment capabilities.

- **Logic**: New requests automatically route to the equipment's default maintenance team and preferred technician.

### 3. Dynamic Kanban Board

Modernized work order management featuring high-visibility stage tracking.

- **Stages**: `NEW` → `IN_PROGRESS` → `REPAIRED` / `SCRAP`.
- **Engagement**: Drag-and-drop interface with real-time optimistic state updates.

### 4. Preventive Maintenance Calendar

A foresight-driven grid for managing scheduled inspections and recurring maintenance tasks.

- **Visibility**: Integrated FullCalendar for monthly/weekly schedule overviews.
- **Compliance**: Clear visual indicators for overdue tasks to prevent maintenance debt.

### 5. Smart Reporting & Visual Intelligence

Data-driven decision-making powered by real-time KPIs and interactive visualizations.

- **Dashboard**: Monthly performance trends (Completion Rate, MTTR - Mean Time To Repair).
- **Vivid Theme**: A premium, animated UI that emphasizes data clarity without compromising on aesthetics.

---

## 🛠️ Technical Architecture

GearGuard is built on a modern, scalable full-stack architecture:

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) with [Tailwind CSS v4](https://tailwindcss.com/) and [TanStack Query](https://tanstack.com/query/latest).
- **Backend**: [NestJS (TypeScript)](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Persistence**: [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/).
- **Security**: JWT-based Authentication with comprehensive Role-Based Access Control (RBAC).

---

## 📂 Specialized Documentation

For deep-dives into the system's design and logic, refer to our specialized documentation suite:

- [**System Design & Architecture**](./docs/system_design.md): Deep dive into the component communication and scalability.
- [**Database Schema & Integrity**](./docs/database_schema.md): ERD breakdown and data relationship logic.
- [**Business Workflows**](./docs/workflows.md): Detailed explanation of Breakdown vs. Preventive flows and Scrap logic.
- [**API Contract**](./docs/api_contract.md): Interacting with the GearGuard services.
- [**Future Scope & Extensions**](./docs/future_scope.md): Roadmap for IoT and AI integration.

---

## 💿 Installation & Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL Instance

### Setup Guide

Refer to the `.env.example` files in both `gearguard-backend` and `gearguard-nextjs` for configuration details.

1. **Backend**:

   ```bash
   cd gearguard-backend
   npm install
   npx prisma db push
   npx prisma db seed
   npm run start:dev
   ```

2. **Frontend**:
   ```bash
   cd gearguard-nextjs
   npm install
   npm run dev
   ```

---

## 🔑 Demo Access

| Role           | Email                   | Password      |
| :------------- | :---------------------- | :------------ |
| **Admin**      | `admin@gearguard.com`   | `password123` |
| **Manager**    | `manager@gearguard.com` | `password123` |
| **Technician** | `tech1@gearguard.com`   | `password123` |

---

Developed for **System Maturity** and **Operational Excellence**. 🛡️
