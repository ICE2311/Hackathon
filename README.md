# GearGuard - Maintenance Management System

A production-ready Odoo-like maintenance module that connects Equipment, Maintenance Teams, and Maintenance Requests, supporting breakdown repairs and preventive maintenance with strong workflow logic and polished UX.

## 🎯 Features

### Core Functionality

- **Equipment Management**: Track all company assets with departments, categories, and assignments
- **Maintenance Teams**: Organize specialized teams with role-based access
- **Maintenance Requests**: Handle both corrective (breakdown) and preventive maintenance
- **Workflow Automation**: Auto-fill team and technician based on equipment selection
- **Scrap Management**: Automatic equipment status updates when scrapped
- **Kanban Board**: Drag-and-drop interface for request management
- **Calendar View**: Schedule and track preventive maintenance
- **Overdue Tracking**: Automatic highlighting of overdue requests

### Business Logic

- ✅ Auto-fill maintenance team and technician from equipment defaults
- ✅ Stage transitions: NEW → IN_PROGRESS → REPAIRED/SCRAP
- ✅ Equipment status automatically updated to SCRAPPED when request moved to SCRAP
- ✅ Audit logs for all critical actions
- ✅ Role-based access control (ADMIN, MANAGER, TECHNICIAN, EMPLOYEE)
- ✅ Overdue calculation for scheduled maintenance

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (NeonDB compatible)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **Validation**: class-validator, class-transformer

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Drag & Drop**: Native HTML5 Drag & Drop API
- **HTTP Client**: Axios

## 📁 Project Structure

```
gearguard-backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── auth/                  # JWT authentication module
│   ├── equipment/             # Equipment CRUD + filters
│   ├── maintenance-team/      # Team management
│   ├── maintenance-request/   # Request management with business logic
│   ├── prisma/                # Prisma service
│   └── main.ts                # App entry point
└── package.json

gearguard-frontend/
├── src/
│   ├── api/                   # API client
│   ├── components/            # Reusable components
│   │   ├── Kanban/           # Kanban board components
│   │   └── Layout.tsx        # Main layout
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── pages/                 # Page components
│   │   ├── Login.tsx         # Login page
│   │   └── KanbanBoard.tsx   # Kanban view
│   ├── types/                 # TypeScript types
│   └── App.tsx                # Main app component
└── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or NeonDB account)

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd gearguard-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Update the `.env` file (or create from `.env.example`):

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/gearguard?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   ```

   For NeonDB, use your connection string from the NeonDB dashboard.

4. **Update Prisma configuration**:

   Edit `prisma.config.ts` and set your database URL:

   ```typescript
   datasource: {
     url: process.env["DATABASE_URL"],
   },
   ```

5. **Run database migrations**:

   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed the database**:

   ```bash
   npx prisma db seed
   ```

7. **Start the backend server**:

   ```bash
   npm run start:dev
   ```

   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd gearguard-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment**:

   The `.env` file should contain:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 👤 Demo Credentials

After seeding the database, use these credentials to login:

| Role         | Email                  | Password    |
| ------------ | ---------------------- | ----------- |
| Admin        | admin@gearguard.com    | password123 |
| Manager      | manager@gearguard.com  | password123 |
| Technician 1 | tech1@gearguard.com    | password123 |
| Technician 2 | tech2@gearguard.com    | password123 |
| Technician 3 | tech3@gearguard.com    | password123 |
| Employee     | employee@gearguard.com | password123 |

## 📊 Database Schema

### Core Models

**User**

- Roles: ADMIN, MANAGER, TECHNICIAN, EMPLOYEE
- JWT authentication with bcrypt password hashing

**Equipment**

- Status: ACTIVE, SCRAPPED
- Linked to default maintenance team and technician
- Tracks warranty, location, category, department

**MaintenanceTeam**

- Contains team members (users)
- Manages equipment and requests

**MaintenanceRequest**

- Type: CORRECTIVE, PREVENTIVE
- Stage: NEW, IN_PROGRESS, REPAIRED, SCRAP
- Auto-fills team/technician from equipment
- Tracks scheduled date, duration, overdue status

**RequestLog**

- Audit trail for all request actions
- Tracks stage changes, assignments, scrap reasons

## 🔑 Key API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Equipment

- `GET /equipment` - List all equipment (with filters)
- `GET /equipment/:id` - Get equipment details with maintenance history
- `POST /equipment` - Create equipment (ADMIN/MANAGER)
- `PATCH /equipment/:id` - Update equipment (ADMIN/MANAGER)
- `DELETE /equipment/:id` - Delete equipment (ADMIN)

### Maintenance Teams

- `GET /maintenance-teams` - List all teams
- `GET /maintenance-teams/:id` - Get team details
- `POST /maintenance-teams` - Create team (ADMIN/MANAGER)
- `PATCH /maintenance-teams/:id` - Update team (ADMIN/MANAGER)

### Maintenance Requests

- `GET /maintenance-requests` - List all requests (with filters)
- `GET /maintenance-requests/kanban` - Get Kanban board data
- `GET /maintenance-requests/calendar` - Get calendar data (preventive only)
- `POST /maintenance-requests` - Create request (any authenticated user)
- `PATCH /maintenance-requests/:id/assign` - Assign technician
- `PATCH /maintenance-requests/:id/stage` - Update stage (handles scrap logic)

## 🎨 Frontend Features

### Kanban Board

- Drag-and-drop requests between stages
- Optimistic UI updates with React Query
- Real-time refresh every 30 seconds
- Color-coded by stage
- Overdue requests highlighted in red
- Technician avatars on cards

### Authentication

- JWT token stored in localStorage
- Protected routes with automatic redirect
- User info displayed in navbar

## 🔒 Security Features

- JWT authentication with secure token storage
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Input validation on all endpoints
- CORS configuration for frontend
- SQL injection protection via Prisma ORM

## 🧪 Testing the Application

### Complete Breakdown Maintenance Flow

1. Login as **Employee** (employee@gearguard.com)
2. Create a corrective maintenance request for any equipment
3. Verify team and technician are auto-filled
4. Login as **Technician** (tech1@gearguard.com)
5. Go to Kanban board
6. Drag request from NEW to IN_PROGRESS
7. Drag to REPAIRED (add duration hours)

### Complete Preventive Maintenance Flow

1. Login as **Manager** (manager@gearguard.com)
2. Create preventive request with scheduled date
3. Verify it appears on Calendar view
4. Assign to technician
5. Technician completes work on scheduled date

### Scrap Workflow

1. Create a maintenance request
2. Drag to SCRAP stage
3. Verify equipment status changes to SCRAPPED
4. Check that equipment no longer appears in active equipment list
5. View audit log for scrap reason

## 📝 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 🚢 Production Deployment

### Backend

1. Set production DATABASE_URL (NeonDB recommended)
2. Change JWT_SECRET to a secure random string
3. Set NODE_ENV=production
4. Build: `npm run build`
5. Start: `npm run start:prod`

### Frontend

1. Update VITE_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)

## 📚 Additional Notes

- The system uses Prisma 7 with the new configuration format
- All timestamps are in ISO 8601 format
- Overdue calculation is done server-side
- Kanban uses native HTML5 drag & drop (no external library needed for basic functionality)
- React Query handles caching and optimistic updates

## 🤝 Contributing

This is a demonstration project showcasing a production-ready maintenance management system with proper architecture, business logic, and UX patterns.

## 📄 License

MIT License - feel free to use this as a template for your own projects.
