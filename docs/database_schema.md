# Database Schema & Integrity 🗄️

The GearGuard persistence layer is built on PostgreSQL, utilizing Prisma ORM for type-safe relational mapping. This schema is designed for strong consistency and high data integrity.

---

## 🗺️ Entity Relationship Overview

The schema revolves around four core domains: **Identity**, **Assets**, **Orchestration**, and **Audit**.

### 1. Identity Domain (`User`, `MaintenanceTeam`)

- **User**: The central actor. Roles (`ADMIN`, `MANAGER`, `TECHNICIAN`, `EMPLOYEE`) dictate system access.
- **MaintenanceTeam**: Groupings of technicians. Links to `Equipment` as default responders and `MaintenanceRequest` for active work orders.

### 2. Asset Domain (`Equipment`)

- **Equipment**: Stores the master data for industrial assets.
- **Business Rule**: Equipment status transitions (e.g., to `SCRAPPED`) are strictly controlled by the Maintenance Request lifecycle.

### 3. Orchestration Domain (`MaintenanceRequest`)

- **MaintenanceRequest**: The bridge between an asset failure/schedule and the technical resolution.
- **Stages**: `NEW` (Open), `IN_PROGRESS` (Active), `REPAIRED` (Resolved), `SCRAP` (Decommissioned).

### 4. Audit Domain (`RequestLog`)

- **RequestLog**: Maintains an immutable history of work order actions, ensuring accountability and compliance.

---

## 📂 Table Definitions & Rationale

### `User`

| Field    | Type | Rationale                                     |
| :------- | :--- | :-------------------------------------------- |
| `id`     | UUID | Global unique identifier.                     |
| `role`   | Enum | Enforces RBAC at the database level.          |
| `teamId` | FK   | Optional association with a maintenance team. |

### `Equipment`

| Field          | Type   | Rationale                                         |
| :------------- | :----- | :------------------------------------------------ | ------------ |
| `serialNumber` | String | Unique hardware identifier for physical tracking. |
| `status`       | Enum   | Tracks operational health (`ACTIVE`               | `SCRAPPED`). |
| `dept`         | String | Used for cost-center and operational filtering.   |

### `MaintenanceRequest`

| Field           | Type     | Rationale                                               |
| :-------------- | :------- | :------------------------------------------------------ |
| `type`          | Enum     | Differentiates between `CORRECTIVE` and `PREVENTIVE`.   |
| `scheduledDate` | DateTime | Critical for Preventive Maintenance (PM) compliance.    |
| `durationHours` | Float    | Used to calculate technical efficiency and labor costs. |

---

## 🛡️ Data Integrity & Business Constraints

### 1. Unique Constraints

- **Equipment Serial Number**: Prevents duplicate entry of physical assets in the registry.
- **User Email**: Ensures unique identity for the authentication system.

### 2. Relationship Logic

- **Cascading Logic**: Deleting a maintenance team should not delete assigned technicians or historic equipment, preserving the audit trail.
- **Mandatory Linkages**: A maintenance request _must_ be linked to an existing, non-deleted equipment item.

### 3. State Consistency

- **Scrap Trigger**: Application-level logic (orchestrated via the MaintenanceRequest service) ensures that if a work order is moved to `SCRAP`, the linked `Equipment` status is updated atomically.

---

## 📈 Optimization

- **Foreign Key Indexes**: Automatic indexing on `equipmentId` and `technicianId` to speed up "Request History" and "My Tasks" views.
- **Created Date Indexing**: Optimized for the Dashboard's monthly and daily performance charts.
