import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto, AssignTechnicianDto, UpdateStageDto } from './dto/maintenance-request.dto';
import { MaintenanceType, RequestStage } from '@prisma/client';
export declare class MaintenanceRequestService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateMaintenanceRequestDto, userId: string): Promise<{
        equipment: {
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
        };
        maintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            email: string;
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
    }>;
    findAll(filters?: {
        type?: MaintenanceType;
        stage?: RequestStage;
        maintenanceTeamId?: string;
        equipmentId?: string;
    }): Promise<({
        equipment: {
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
        };
        maintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            email: string;
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
    })[]>;
    findOne(id: string): Promise<{
        isOverdue: boolean;
        equipment: {
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
        };
        maintenanceTeam: {
            members: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        logs: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            note: string | null;
            requestId: string;
            userId: string;
        })[];
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
    }>;
    update(id: string, updateDto: UpdateMaintenanceRequestDto): Promise<{
        equipment: {
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
        };
        maintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
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
    }>;
    assignTechnician(id: string, assignDto: AssignTechnicianDto, currentUserId: string): Promise<{
        equipment: {
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
        };
        maintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
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
    }>;
    updateStage(id: string, updateStageDto: UpdateStageDto, currentUserId: string): Promise<{
        equipment: {
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
        };
        maintenanceTeam: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
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
    }>;
    getKanbanData(): Promise<Record<import("@prisma/client").$Enums.RequestStage, any[]>>;
    getCalendarData(startDate: string, endDate: string): Promise<{
        isOverdue: boolean;
        equipment: {
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
        };
        assignedTechnician: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
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
    }[]>;
    remove(id: string): Promise<{
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
    }>;
    getMetrics(month?: string, year?: string): Promise<{
        period: {
            month: number;
            year: number;
        };
        created: {
            current: number;
            trend: number;
        };
        repaired: {
            current: number;
            trend: number;
        };
        avgDuration: number;
        completionRate: number;
        history: {
            date: string;
            day: number;
            created: number;
            repaired: number;
        }[];
    }>;
    private calculateTrend;
    private calculateOverdue;
}
