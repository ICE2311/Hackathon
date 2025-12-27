import { MaintenanceTeamService } from './maintenance-team.service';
import { CreateMaintenanceTeamDto, UpdateMaintenanceTeamDto } from './dto/maintenance-team.dto';
export declare class MaintenanceTeamController {
    private readonly maintenanceTeamService;
    constructor(maintenanceTeamService: MaintenanceTeamService);
    create(createMaintenanceTeamDto: CreateMaintenanceTeamDto): Promise<{
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
    }>;
    findAll(): Promise<({
        members: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        _count: {
            equipment: number;
            maintenanceRequests: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    findOne(id: string): Promise<{
        members: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
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
        }[];
        maintenanceRequests: ({
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    update(id: string, updateMaintenanceTeamDto: UpdateMaintenanceTeamDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    addMember(id: string, userId: string): Promise<{
        members: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        _count: {
            equipment: number;
            maintenanceRequests: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    removeMember(id: string, userId: string): Promise<{
        members: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        _count: {
            equipment: number;
            maintenanceRequests: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
}
