export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MANAGER" | "TECHNICIAN" | "EMPLOYEE";
}

export type EquipmentStatus = "ACTIVE" | "MAINTENANCE" | "BROKEN" | "SCRAPPED";

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  assignedEmployeeId?: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  category: string;
  defaultMaintenanceTeamId: string;
  defaultTechnicianId?: string;
  status: EquipmentStatus;
  assignedEmployee?: User;
  defaultMaintenanceTeam?: MaintenanceTeam;
  _count?: {
    maintenanceRequests: number;
  };
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  members?: User[];
  _count?: {
    equipment: number;
    maintenanceRequests: number;
  };
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  type: "CORRECTIVE" | "PREVENTIVE";
  equipmentId: string;
  maintenanceTeamId: string;
  assignedTechnicianId?: string;
  scheduledDate?: string;
  durationHours?: number;
  stage: "NEW" | "IN_PROGRESS" | "REPAIRED" | "SCRAP";
  createdById: string;
  createdAt: string;
  updatedAt: string;
  equipment?: Equipment;
  maintenanceTeam?: MaintenanceTeam;
  assignedTechnician?: User;
  createdBy?: User;
  isOverdue?: boolean;
}

export interface KanbanData {
  NEW: MaintenanceRequest[];
  IN_PROGRESS: MaintenanceRequest[];
  REPAIRED: MaintenanceRequest[];
  SCRAP: MaintenanceRequest[];
}
