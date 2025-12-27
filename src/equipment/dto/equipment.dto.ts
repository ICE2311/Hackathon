import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsString()
  department: string;

  @IsUUID()
  @IsOptional()
  assignedEmployeeId?: string;

  @IsDateString()
  purchaseDate: string;

  @IsDateString()
  @IsOptional()
  warrantyExpiry?: string;

  @IsString()
  location: string;

  @IsString()
  category: string;

  @IsUUID()
  defaultMaintenanceTeamId: string;

  @IsUUID()
  @IsOptional()
  defaultTechnicianId?: string;

  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;
}

export class UpdateEquipmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsUUID()
  @IsOptional()
  assignedEmployeeId?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsDateString()
  @IsOptional()
  warrantyExpiry?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  defaultMaintenanceTeamId?: string;

  @IsUUID()
  @IsOptional()
  defaultTechnicianId?: string;

  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;
}
