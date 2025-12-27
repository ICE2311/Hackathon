"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MaintenanceRequestService = class MaintenanceRequestService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId) {
        if (createDto.type === client_1.MaintenanceType.PREVENTIVE &&
            !createDto.scheduledDate) {
            throw new common_1.BadRequestException('Scheduled date is required for preventive maintenance');
        }
        const equipment = await this.prisma.equipment.findUnique({
            where: { id: createDto.equipmentId },
        });
        if (!equipment) {
            throw new common_1.NotFoundException('Equipment not found');
        }
        if (equipment.status === client_1.EquipmentStatus.SCRAPPED) {
            throw new common_1.BadRequestException('Cannot create request for scrapped equipment');
        }
        const maintenanceTeamId = createDto.maintenanceTeamId || equipment.defaultMaintenanceTeamId;
        const assignedTechnicianId = createDto.assignedTechnicianId || equipment.defaultTechnicianId;
        const request = await this.prisma.maintenanceRequest.create({
            data: {
                subject: createDto.subject,
                description: createDto.description,
                type: createDto.type,
                equipmentId: createDto.equipmentId,
                maintenanceTeamId,
                assignedTechnicianId,
                scheduledDate: createDto.scheduledDate
                    ? new Date(createDto.scheduledDate)
                    : null,
                durationHours: createDto.durationHours,
                createdById: userId,
            },
            include: {
                equipment: true,
                maintenanceTeam: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        await this.prisma.requestLog.create({
            data: {
                requestId: request.id,
                action: 'CREATED',
                note: `Request created by ${request.createdBy.firstName} ${request.createdBy.lastName}`,
                userId,
            },
        });
        return request;
    }
    async findAll(filters) {
        return this.prisma.maintenanceRequest.findMany({
            where: {
                type: filters?.type,
                stage: filters?.stage,
                maintenanceTeamId: filters?.maintenanceTeamId,
                equipmentId: filters?.equipmentId,
            },
            include: {
                equipment: true,
                maintenanceTeam: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const request = await this.prisma.maintenanceRequest.findUnique({
            where: { id },
            include: {
                equipment: true,
                maintenanceTeam: {
                    include: {
                        members: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                logs: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Maintenance request with ID ${id} not found`);
        }
        const isOverdue = this.calculateOverdue(request);
        return {
            ...request,
            isOverdue,
        };
    }
    async update(id, updateDto) {
        await this.findOne(id);
        return this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                ...updateDto,
                scheduledDate: updateDto.scheduledDate
                    ? new Date(updateDto.scheduledDate)
                    : undefined,
            },
            include: {
                equipment: true,
                maintenanceTeam: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async assignTechnician(id, assignDto, currentUserId) {
        const request = await this.findOne(id);
        const updated = await this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                assignedTechnicianId: assignDto.technicianId,
                stage: client_1.RequestStage.IN_PROGRESS,
            },
            include: {
                equipment: true,
                maintenanceTeam: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        await this.prisma.requestLog.create({
            data: {
                requestId: id,
                action: 'ASSIGNED',
                note: `Assigned to ${updated.assignedTechnician?.firstName} ${updated.assignedTechnician?.lastName}`,
                userId: currentUserId,
            },
        });
        return updated;
    }
    async updateStage(id, updateStageDto, currentUserId) {
        const request = await this.findOne(id);
        if (updateStageDto.stage === client_1.RequestStage.REPAIRED &&
            !updateStageDto.durationHours) {
            throw new common_1.BadRequestException('Duration hours required when marking as repaired');
        }
        if (updateStageDto.stage === client_1.RequestStage.SCRAP) {
            await this.prisma.equipment.update({
                where: { id: request.equipmentId },
                data: { status: client_1.EquipmentStatus.SCRAPPED },
            });
            await this.prisma.requestLog.create({
                data: {
                    requestId: id,
                    action: 'SCRAPPED',
                    note: updateStageDto.note ||
                        'Equipment scrapped due to maintenance request',
                    userId: currentUserId,
                },
            });
        }
        const updated = await this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                stage: updateStageDto.stage,
                durationHours: updateStageDto.durationHours,
            },
            include: {
                equipment: true,
                maintenanceTeam: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (updateStageDto.stage !== client_1.RequestStage.SCRAP) {
            await this.prisma.requestLog.create({
                data: {
                    requestId: id,
                    action: `STAGE_CHANGED_TO_${updateStageDto.stage}`,
                    note: updateStageDto.note,
                    userId: currentUserId,
                },
            });
        }
        return updated;
    }
    async getKanbanData() {
        const requests = await this.prisma.maintenanceRequest.findMany({
            include: {
                equipment: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const grouped = {
            NEW: [],
            IN_PROGRESS: [],
            REPAIRED: [],
            SCRAP: [],
        };
        requests.forEach((request) => {
            const isOverdue = this.calculateOverdue(request);
            grouped[request.stage].push({
                ...request,
                isOverdue,
            });
        });
        return grouped;
    }
    async getCalendarData(startDate, endDate) {
        const requests = await this.prisma.maintenanceRequest.findMany({
            where: {
                scheduledDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: {
                equipment: true,
                assignedTechnician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                scheduledDate: 'asc',
            },
        });
        return requests.map((request) => ({
            ...request,
            isOverdue: this.calculateOverdue(request),
        }));
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.maintenanceRequest.delete({
            where: { id },
        });
    }
    async getMetrics(month, year) {
        const now = new Date();
        const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
        const targetYear = year ? parseInt(year) : now.getFullYear();
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
        const prevStartDate = new Date(targetYear, targetMonth - 1, 1);
        const prevEndDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
        const currentData = await this.prisma.maintenanceRequest.findMany({
            where: {
                OR: [
                    { createdAt: { gte: startDate, lte: endDate } },
                    {
                        updatedAt: { gte: startDate, lte: endDate },
                        stage: client_1.RequestStage.REPAIRED,
                    },
                ],
            },
            select: {
                createdAt: true,
                updatedAt: true,
                stage: true,
                durationHours: true,
            },
        });
        const prevData = await this.prisma.maintenanceRequest.findMany({
            where: {
                OR: [
                    { createdAt: { gte: prevStartDate, lte: prevEndDate } },
                    {
                        updatedAt: { gte: prevStartDate, lte: prevEndDate },
                        stage: client_1.RequestStage.REPAIRED,
                    },
                ],
            },
            select: {
                createdAt: true,
                updatedAt: true,
                stage: true,
            },
        });
        const totalCreated = currentData.filter((r) => r.createdAt >= startDate && r.createdAt <= endDate).length;
        const totalRepaired = currentData.filter((r) => r.stage === client_1.RequestStage.REPAIRED &&
            r.updatedAt >= startDate &&
            r.updatedAt <= endDate).length;
        const prevCreated = prevData.filter((r) => r.createdAt >= prevStartDate && r.createdAt <= prevEndDate).length;
        const prevRepaired = prevData.filter((r) => r.stage === client_1.RequestStage.REPAIRED &&
            r.updatedAt >= prevStartDate &&
            r.updatedAt <= prevEndDate).length;
        const repairedItems = currentData.filter((r) => r.stage === client_1.RequestStage.REPAIRED &&
            r.updatedAt >= startDate &&
            r.updatedAt <= endDate &&
            r.durationHours !== null);
        const avgDuration = repairedItems.length > 0
            ? repairedItems.reduce((sum, r) => sum + (r.durationHours || 0), 0) /
                repairedItems.length
            : 0;
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const history = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dayStart = new Date(targetYear, targetMonth, day);
            const dayEnd = new Date(targetYear, targetMonth, day, 23, 59, 59);
            const createdCount = currentData.filter((r) => r.createdAt >= dayStart && r.createdAt <= dayEnd).length;
            const repairedCount = currentData.filter((r) => r.stage === client_1.RequestStage.REPAIRED &&
                r.updatedAt >= dayStart &&
                r.updatedAt <= dayEnd).length;
            history.push({
                date: dayStart.toISOString().split('T')[0],
                day: day,
                created: createdCount,
                repaired: repairedCount,
            });
        }
        return {
            period: {
                month: targetMonth + 1,
                year: targetYear,
            },
            created: {
                current: totalCreated,
                trend: this.calculateTrend(totalCreated, prevCreated),
            },
            repaired: {
                current: totalRepaired,
                trend: this.calculateTrend(totalRepaired, prevRepaired),
            },
            avgDuration: avgDuration || 0,
            completionRate: totalCreated > 0 ? (totalRepaired / totalCreated) * 100 : 0,
            history,
        };
    }
    calculateTrend(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
    calculateOverdue(request) {
        if (!request.scheduledDate)
            return false;
        if (request.stage === client_1.RequestStage.REPAIRED ||
            request.stage === client_1.RequestStage.SCRAP) {
            return false;
        }
        return new Date(request.scheduledDate) < new Date();
    }
};
exports.MaintenanceRequestService = MaintenanceRequestService;
exports.MaintenanceRequestService = MaintenanceRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceRequestService);
//# sourceMappingURL=maintenance-request.service.js.map