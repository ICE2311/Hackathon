# API Contract 🔌

GearGuard uses a RESTful API with JSON payloads. This document provides a Swagger-style overview of the primary endpoints.

---

## 🔐 Auth APIs

### `POST /auth/register`

Create a new user account.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "EMPLOYEE"
  }
  ```
- **Response** (201): User object.

### `POST /auth/login`

Authenticate and receive a JWT.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response** (200):
  ```json
  {
    "user": { "id": "uuid", "email": "...", "role": "..." },
    "token": "jwt_token_here"
  }
  ```

---

## 🔧 Equipment APIs

### `GET /equipment`

List all equipment with optional filters.

- **Query Params**: `dept`, `assignedEmployeeId`, `category`, `status`.
- **Response** (200): Array of Equipment objects.

### `POST /equipment`

Add new equipment to the registry.

- **Permissions**: `ADMIN`, `MANAGER`.
- **Request Body**: `EquipmentDTO` (Name, Serial, Dept, Category, etc.).
- **Response** (201): Created Equipment object.

---

## 📋 Maintenance Request APIs

### `GET /maintenance-requests`

Browse all requests. Supports filtering by `equipmentId`, `stage`, `technicianId`, and `type`.

- **Response** (200): Array of MaintenanceRequest objects.

### `POST /maintenance-requests`

Submit a new breakdown or preventive request.

- **Auto-Logic**: Assets defaults are applied on the server if not provided.
- **Request Body**:
  ```json
  {
    "subject": "Steam Pipe Leak",
    "description": "Minor leak in Room 302",
    "type": "CORRECTIVE",
    "equipmentId": "uuid"
  }
  ```

### `PATCH /maintenance-requests/:id/stage`

Transition a request through the Kanban stages.

- **Valid Stages**: `NEW`, `IN_PROGRESS`, `REPAIRED`, `SCRAP`.
- **Request Body**: `{ "stage": "IN_PROGRESS" }`
- **Result**: Atomic update of request stage and (if `SCRAP`) equipment status.

---

## 🚀 Specialized Operations

### `GET /maintenance-requests/kanban`

Fetch requests grouped for Kanban visualization.

- **Response**: Dictionary mapping stages to request arrays.

### `GET /maintenance-requests/metrics`

Aggregated KPIs for the dashboard.

- **Response**: Metrics for Current Month, Previous Month, and Daily History.

### `PATCH /maintenance-requests/:id/assign`

Assign or reassign a technician.

- **Validation**: Enforces that the technician belongs to the assigned maintenance team.
