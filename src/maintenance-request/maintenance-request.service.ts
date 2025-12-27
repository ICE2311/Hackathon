import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  AssignTechnicianDto,
  UpdateStageDto,
} from './dto/maintenance-request.dto';
import {
  MaintenanceType,
  RequestStage,
  EquipmentStatus,
  UserRole,
} from '@prisma/client';

@Injectable()
export class MaintenanceRequestService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMaintenanceRequestDto, userId: string) {
    // Validate preventive maintenance has scheduled date
    if (
      createDto.type === MaintenanceType.PREVENTIVE &&
      !createDto.scheduledDate
    ) {
      throw new BadRequestException(
        'Scheduled date is required for preventive maintenance',
      );
    }

    // Get equipment to auto-fill team and technician
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: createDto.equipmentId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    if (equipment.status === EquipmentStatus.SCRAPPED) {
      throw new BadRequestException(
        'Cannot create request for scrapped equipment',
      );
    }

    // Auto-fill logic
    const maintenanceTeamId =
      createDto.maintenanceTeamId || equipment.defaultMaintenanceTeamId;
    const assignedTechnicianId =
      createDto.assignedTechnicianId || equipment.defaultTechnicianId;

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

    // Create log
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

  async findAll(filters?: {
    type?: MaintenanceType;
    stage?: RequestStage;
    maintenanceTeamId?: string;
    equipmentId?: string;
  }) {
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

  async findOne(id: string) {
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
      throw new NotFoundException(
        `Maintenance request with ID ${id} not found`,
      );
    }

    // Calculate if overdue
    const isOverdue = this.calculateOverdue(request);

    return {
      ...request,
      isOverdue,
    };
  }

  async update(id: string, updateDto: UpdateMaintenanceRequestDto) {
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

  async assignTechnician(
    id: string,
    assignDto: AssignTechnicianDto,
    currentUserId: string,
  ) {
    const request = await this.findOne(id);

    // Validation removed to allow flexible assignment
    /*
    if (request.maintenanceTeam) {
       const isMember = request.maintenanceTeam.members.some(
         (member) => member.id === assignDto.technicianId,
       );
       if (!isMember) {
         // throw new ForbiddenException('Technician must be a member of the assigned maintenance team');
       }
    }
    */

    const updated = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        assignedTechnicianId: assignDto.technicianId,
        stage: RequestStage.IN_PROGRESS,
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

    // Create log
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

  async updateStage(
    id: string,
    updateStageDto: UpdateStageDto,
    currentUserId: string,
  ) {
    const request = await this.findOne(id);

    // Validate stage transition
    if (
      updateStageDto.stage === RequestStage.REPAIRED &&
      !updateStageDto.durationHours
    ) {
      throw new BadRequestException(
        'Duration hours required when marking as repaired',
      );
    }

    // Handle SCRAP workflow
    if (updateStageDto.stage === RequestStage.SCRAP) {
      // Update equipment status to SCRAPPED
      await this.prisma.equipment.update({
        where: { id: request.equipmentId },
        data: { status: EquipmentStatus.SCRAPPED },
      });

      // Create scrap log
      await this.prisma.requestLog.create({
        data: {
          requestId: id,
          action: 'SCRAPPED',
          note:
            updateStageDto.note ||
            'Equipment scrapped due to maintenance request',
          userId: currentUserId,
        },
      });
    }

    // Update request
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

    // Create stage change log
    if (updateStageDto.stage !== RequestStage.SCRAP) {
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

    // Group by stage and calculate overdue
    const grouped: Record<RequestStage, any[]> = {
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

  async getCalendarData(startDate: string, endDate: string) {
    const requests = await this.prisma.maintenanceRequest.findMany({
      where: {
        // Show all types (Corrective & Preventive) that are scheduled
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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.maintenanceRequest.delete({
      where: { id },
    });
  }

  async getMetrics(month?: string, year?: string) {
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const prevStartDate = new Date(targetYear, targetMonth - 1, 1);
    const prevEndDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Fetch Current Month Data (Created OR Repaired in this month)
    const currentData = await this.prisma.maintenanceRequest.findMany({
      where: {
        OR: [
          { createdAt: { gte: startDate, lte: endDate } },
          {
            updatedAt: { gte: startDate, lte: endDate },
            stage: RequestStage.REPAIRED,
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

    // Fetch Previous Month Data (for trends)
    const prevData = await this.prisma.maintenanceRequest.findMany({
      where: {
        OR: [
          { createdAt: { gte: prevStartDate, lte: prevEndDate } },
          {
            updatedAt: { gte: prevStartDate, lte: prevEndDate },
            stage: RequestStage.REPAIRED,
          },
        ],
      },
      select: {
        createdAt: true,
        updatedAt: true,
        stage: true,
      },
    });

    // Calculate Totals
    const totalCreated = currentData.filter(
      (r) => r.createdAt >= startDate && r.createdAt <= endDate,
    ).length;
    const totalRepaired = currentData.filter(
      (r) =>
        r.stage === RequestStage.REPAIRED &&
        r.updatedAt >= startDate &&
        r.updatedAt <= endDate,
    ).length;

    const prevCreated = prevData.filter(
      (r) => r.createdAt >= prevStartDate && r.createdAt <= prevEndDate,
    ).length;
    const prevRepaired = prevData.filter(
      (r) =>
        r.stage === RequestStage.REPAIRED &&
        r.updatedAt >= prevStartDate &&
        r.updatedAt <= prevEndDate,
    ).length;

    // Calculate Avg Duration
    const repairedItems = currentData.filter(
      (r) =>
        r.stage === RequestStage.REPAIRED &&
        r.updatedAt >= startDate &&
        r.updatedAt <= endDate &&
        r.durationHours !== null,
    );
    const avgDuration =
      repairedItems.length > 0
        ? repairedItems.reduce((sum, r) => sum + (r.durationHours || 0), 0) /
          repairedItems.length
        : 0;

    // Generate Daily History
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const history: {
      date: string;
      day: number;
      created: number;
      repaired: number;
    }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStart = new Date(targetYear, targetMonth, day);
      const dayEnd = new Date(targetYear, targetMonth, day, 23, 59, 59);

      const createdCount = currentData.filter(
        (r) => r.createdAt >= dayStart && r.createdAt <= dayEnd,
      ).length;

      const repairedCount = currentData.filter(
        (r) =>
          r.stage === RequestStage.REPAIRED &&
          r.updatedAt >= dayStart &&
          r.updatedAt <= dayEnd,
      ).length;

      history.push({
        date: dayStart.toISOString().split('T')[0], // YYYY-MM-DD
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
      completionRate:
        totalCreated > 0 ? (totalRepaired / totalCreated) * 100 : 0,
      history, // Data for graphs
    };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  private calculateOverdue(request: any): boolean {
    if (!request.scheduledDate) return false;
    if (
      request.stage === RequestStage.REPAIRED ||
      request.stage === RequestStage.SCRAP
    ) {
      return false;
    }
    return new Date(request.scheduledDate) < new Date();
  }
}
