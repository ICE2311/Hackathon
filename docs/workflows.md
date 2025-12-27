# Business Workflows & Logic 🔄

GearGuard is built on standardized industrial maintenance workflows. This document explains the operational logic behind requests, assignments, and decommissioning.

---

## 🔧 Maintenance Request Lifecycles

GearGuard supports two primary maintenance flows: **Breakdown (Corrective)** and **Scheduled (Preventive)**.

### 1. Breakdown Maintenance Flow (Corrective)

Handle unexpected equipment failures with rapid reporting and dispatch.

1.  **Reporting**: An Employee submits a request noting a malfunction.
2.  **Assignment**: The system auto-assigns the equipment's default team. A Manager or Technician can then claim the work order.
3.  **Repair**: The Technician moves the request to `IN_PROGRESS` and performs the fix.
4.  **Resolution**: The Technician marks the request as `REPAIRED` and logs the duration.

### 2. Scheduled Maintenance Flow (Preventive)

Ensure long-term asset health through planned inspections.

1.  **Creation**: A Manager creates a request with a specific `scheduledDate`.
2.  **Scheduling**: The request appears on the **Maintenance Calendar**.
3.  **Execution**: On the scheduled date, the Technician performs the inspection.
4.  **Completion**: The Technician updates the stage and logs duration.

---

## ⚡ Smart Automation Logic

### Auto-Fill Rules

To minimize user error and speed up entry, GearGuard intelligently predicts request metadata:

- **Team Match**: Selecting an `Equipment` automatically fetches and sets the associated `defaultMaintenanceTeam`.
- **Technician Preference**: If the equipment has a preferred `defaultTechnician`, they are automatically assigned to the new request.
- **Categorization**: The asset's `category` is automatically inherited by the request for granular reporting.

---

## 🛡️ Critical Workflows

### 1. Scrap Handling Logic

When equipment is beyond repair, the decommissioning process is integrated into the workflow:

- **Trigger**: Moving a Maintenance Request to the `SCRAP` stage.
- **System Action (Backend)**:
  1.  The linked equipment status is updated to `SCRAPPED`.
  2.  An audit log is created in `RequestLog` capturing the user and timestamp.
- **Impact**: The equipment is immediately filtered out of the "Active Assets" registry and becomes unavailable for new maintenance requests.

### 2. Overdue Highlighting

Ensuring compliance with maintenance schedules through visual urgency:

- **Condition**: If `scheduledDate` < Today AND stage is not `REPAIRED` or `SCRAP`.
- **UI Element**: The request card on the Kanban and Dashboard gains a high-visibility red border and a warning icon (`⚠️ OVERDUE`).

---

## 🛑 Stopping Conditions

- **Request Deletion**: An Administrator can delete requests, but this action is audited to prevent data loss.
- **Stage Lock**: Once a request reaches `REPAIRED` or `SCRAP`, further stage transitions are restricted to maintain the integrity of the performance metrics.
