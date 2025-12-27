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
exports.MaintenanceTeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MaintenanceTeamService = class MaintenanceTeamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMaintenanceTeamDto) {
        return this.prisma.maintenanceTeam.create({
            data: {
                name: createMaintenanceTeamDto.name,
                members: createMaintenanceTeamDto.memberIds
                    ? {
                        connect: createMaintenanceTeamDto.memberIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
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
        });
    }
    async findAll() {
        return this.prisma.maintenanceTeam.findMany({
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
                _count: {
                    select: {
                        equipment: true,
                        maintenanceRequests: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const team = await this.prisma.maintenanceTeam.findUnique({
            where: { id },
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
                equipment: true,
                maintenanceRequests: {
                    include: {
                        equipment: true,
                        assignedTechnician: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!team) {
            throw new common_1.NotFoundException(`Maintenance team with ID ${id} not found`);
        }
        return team;
    }
    async update(id, updateMaintenanceTeamDto) {
        await this.findOne(id);
        return this.prisma.maintenanceTeam.update({
            where: { id },
            data: {
                name: updateMaintenanceTeamDto.name,
                members: updateMaintenanceTeamDto.memberIds
                    ? {
                        set: updateMaintenanceTeamDto.memberIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
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
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.maintenanceTeam.delete({
            where: { id },
        });
    }
    async addMember(teamId, userId) {
        await this.findOne(teamId);
        return this.prisma.maintenanceTeam.update({
            where: { id: teamId },
            data: {
                members: {
                    connect: { id: userId },
                },
            },
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
                _count: {
                    select: {
                        equipment: true,
                        maintenanceRequests: true,
                    },
                },
            },
        });
    }
    async removeMember(teamId, userId) {
        await this.findOne(teamId);
        return this.prisma.maintenanceTeam.update({
            where: { id: teamId },
            data: {
                members: {
                    disconnect: { id: userId },
                },
            },
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
                _count: {
                    select: {
                        equipment: true,
                        maintenanceRequests: true,
                    },
                },
            },
        });
    }
};
exports.MaintenanceTeamService = MaintenanceTeamService;
exports.MaintenanceTeamService = MaintenanceTeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceTeamService);
//# sourceMappingURL=maintenance-team.service.js.map