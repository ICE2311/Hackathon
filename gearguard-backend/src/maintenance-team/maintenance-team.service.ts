import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMaintenanceTeamDto,
  UpdateMaintenanceTeamDto,
} from './dto/maintenance-team.dto';

@Injectable()
export class MaintenanceTeamService {
  constructor(private prisma: PrismaService) {}

  async create(createMaintenanceTeamDto: CreateMaintenanceTeamDto) {
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Maintenance team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateMaintenanceTeamDto: UpdateMaintenanceTeamDto) {
    await this.findOne(id); // Check if exists

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

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.maintenanceTeam.delete({
      where: { id },
    });
  }

  async addMember(teamId: string, userId: string) {
    await this.findOne(teamId); // Check if team exists

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

  async removeMember(teamId: string, userId: string) {
    await this.findOne(teamId); // Check if team exists

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
}
