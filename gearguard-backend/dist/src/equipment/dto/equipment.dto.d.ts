import { EquipmentStatus } from '@prisma/client';
export declare class CreateEquipmentDto {
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
    status?: EquipmentStatus;
}
export declare class UpdateEquipmentDto {
    name?: string;
    serialNumber?: string;
    department?: string;
    assignedEmployeeId?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    location?: string;
    category?: string;
    defaultMaintenanceTeamId?: string;
    defaultTechnicianId?: string;
    status?: EquipmentStatus;
}
