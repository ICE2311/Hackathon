import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { EquipmentStatus } from '@prisma/client';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    return this.prisma.equipment.create({
      data: {
        ...createEquipmentDto,
        purchaseDate: new Date(createEquipmentDto.purchaseDate),
        warrantyExpiry: createEquipmentDto.warrantyExpiry
          ? new Date(createEquipmentDto.warrantyExpiry)
          : null,
      },
      include: {
        assignedEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        defaultMaintenanceTeam: true,
      },
    });
  }

  async findAll(filters?: {
    department?: string;
    assignedEmployeeId?: string;
    category?: string;
    status?: EquipmentStatus;
  }) {
    const where: any = {};

    // Only apply filters if they have non-empty values
    if (filters?.department && filters.department !== '') {
      where.department = filters.department;
    }
    if (filters?.assignedEmployeeId) {
      where.assignedEmployeeId = filters.assignedEmployeeId;
    }
    if (filters?.category && filters.category !== '') {
      where.category = filters.category;
    }
    if (filters?.status && (filters.status as string) !== '') {
      where.status = filters.status;
    }

    return this.prisma.equipment.findMany({
      where,
      include: {
        assignedEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        defaultMaintenanceTeam: true,
        _count: {
          select: {
            maintenanceRequests: {
              where: {
                stage: {
                  in: ['NEW', 'IN_PROGRESS'],
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        assignedEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        defaultMaintenanceTeam: true,
        maintenanceRequests: {
          include: {
            assignedTechnician: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            createdBy: {
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

    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.equipment.update({
      where: { id },
      data: {
        ...updateEquipmentDto,
        purchaseDate: updateEquipmentDto.purchaseDate
          ? new Date(updateEquipmentDto.purchaseDate)
          : undefined,
        warrantyExpiry: updateEquipmentDto.warrantyExpiry
          ? new Date(updateEquipmentDto.warrantyExpiry)
          : undefined,
      },
      include: {
        assignedEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        defaultMaintenanceTeam: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.equipment.delete({
      where: { id },
    });
  }
}
