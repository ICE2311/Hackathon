import { MaintenanceType, RequestStage } from '@prisma/client';
export declare class CreateMaintenanceRequestDto {
    subject: string;
    description: string;
    type: MaintenanceType;
    equipmentId: string;
    maintenanceTeamId?: string;
    assignedTechnicianId?: string;
    scheduledDate?: string;
    durationHours?: number;
}
export declare class UpdateMaintenanceRequestDto {
    subject?: string;
    description?: string;
    type?: MaintenanceType;
    equipmentId?: string;
    maintenanceTeamId?: string;
    assignedTechnicianId?: string;
    scheduledDate?: string;
    durationHours?: number;
    stage?: RequestStage;
}
export declare class AssignTechnicianDto {
    technicianId: string;
}
export declare class UpdateStageDto {
    stage: RequestStage;
    note?: string;
    durationHours?: number;
}
