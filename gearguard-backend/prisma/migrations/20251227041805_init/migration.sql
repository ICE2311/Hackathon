-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'TECHNICIAN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'SCRAPPED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('CORRECTIVE', 'PREVENTIVE');

-- CreateEnum
CREATE TYPE "RequestStage" AS ENUM ('NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "assignedEmployeeId" TEXT,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyExpiry" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "defaultMaintenanceTeamId" TEXT NOT NULL,
    "defaultTechnicianId" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_requests" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "maintenanceTeamId" TEXT NOT NULL,
    "assignedTechnicianId" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "durationHours" DOUBLE PRECISION,
    "stage" "RequestStage" NOT NULL DEFAULT 'NEW',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_logs" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_teams_name_key" ON "maintenance_teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serialNumber_key" ON "equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "equipment_department_idx" ON "equipment"("department");

-- CreateIndex
CREATE INDEX "equipment_category_idx" ON "equipment"("category");

-- CreateIndex
CREATE INDEX "equipment_status_idx" ON "equipment"("status");

-- CreateIndex
CREATE INDEX "equipment_defaultMaintenanceTeamId_idx" ON "equipment"("defaultMaintenanceTeamId");

-- CreateIndex
CREATE INDEX "maintenance_requests_equipmentId_idx" ON "maintenance_requests"("equipmentId");

-- CreateIndex
CREATE INDEX "maintenance_requests_maintenanceTeamId_idx" ON "maintenance_requests"("maintenanceTeamId");

-- CreateIndex
CREATE INDEX "maintenance_requests_stage_idx" ON "maintenance_requests"("stage");

-- CreateIndex
CREATE INDEX "maintenance_requests_scheduledDate_idx" ON "maintenance_requests"("scheduledDate");

-- CreateIndex
CREATE INDEX "maintenance_requests_type_idx" ON "maintenance_requests"("type");

-- CreateIndex
CREATE INDEX "request_logs_requestId_idx" ON "request_logs"("requestId");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "_TeamMembers"("B");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_defaultMaintenanceTeamId_fkey" FOREIGN KEY ("defaultMaintenanceTeamId") REFERENCES "maintenance_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_maintenanceTeamId_fkey" FOREIGN KEY ("maintenanceTeamId") REFERENCES "maintenance_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "maintenance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "maintenance_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
