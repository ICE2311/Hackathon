import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { EquipmentStatus } from '@prisma/client';
export declare class EquipmentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEquipmentDto: CreateEquipmentDto): Promise<{
        assignedEmployee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        defaultMaintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        department: string;
        purchaseDate: Date;
        warrantyExpiry: Date | null;
        location: string;
        category: string;
        defaultTechnicianId: string | null;
        status: import("@prisma/client").$Enums.EquipmentStatus;
        assignedEmployeeId: string | null;
        defaultMaintenanceTeamId: string;
    }>;
    findAll(filters?: {
        department?: string;
        assignedEmployeeId?: string;
        category?: string;
        status?: EquipmentStatus;
    }): Promise<({
        assignedEmployee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        defaultMaintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        _count: {
            maintenanceRequests: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        department: string;
        purchaseDate: Date;
        warrantyExpiry: Date | null;
        location: string;
        category: string;
        defaultTechnicianId: string | null;
        status: import("@prisma/client").$Enums.EquipmentStatus;
        assignedEmployeeId: string | null;
        defaultMaintenanceTeamId: string;
    })[]>;
    findOne(id: string): Promise<{
        maintenanceRequests: ({
            assignedTechnician: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
            createdBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            description: string;
            type: import("@prisma/client").$Enums.MaintenanceType;
            scheduledDate: Date | null;
            durationHours: number | null;
            stage: import("@prisma/client").$Enums.RequestStage;
            equipmentId: string;
            maintenanceTeamId: string;
            assignedTechnicianId: string | null;
            createdById: string;
        })[];
        assignedEmployee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        defaultMaintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        department: string;
        purchaseDate: Date;
        warrantyExpiry: Date | null;
        location: string;
        category: string;
        defaultTechnicianId: string | null;
        status: import("@prisma/client").$Enums.EquipmentStatus;
        assignedEmployeeId: string | null;
        defaultMaintenanceTeamId: string;
    }>;
    update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<{
        assignedEmployee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        defaultMaintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        department: string;
        purchaseDate: Date;
        warrantyExpiry: Date | null;
        location: string;
        category: string;
        defaultTechnicianId: string | null;
        status: import("@prisma/client").$Enums.EquipmentStatus;
        assignedEmployeeId: string | null;
        defaultMaintenanceTeamId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        serialNumber: string;
        department: string;
        purchaseDate: Date;
        warrantyExpiry: Date | null;
        location: string;
        category: string;
        defaultTechnicianId: string | null;
        status: import("@prisma/client").$Enums.EquipmentStatus;
        assignedEmployeeId: string | null;
        defaultMaintenanceTeamId: string;
    }>;
}
