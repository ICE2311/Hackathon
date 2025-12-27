import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { MaintenanceType, RequestStage } from '@prisma/client';

export class CreateMaintenanceRequestDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsUUID()
  equipmentId: string;

  @IsUUID()
  @IsOptional()
  maintenanceTeamId?: string; // Auto-filled from equipment

  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string; // Auto-filled from equipment

  @IsDateString()
  @IsOptional()
  scheduledDate?: string; // Required for PREVENTIVE

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationHours?: number;
}

export class UpdateMaintenanceRequestDto {
  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(MaintenanceType)
  @IsOptional()
  type?: MaintenanceType;

  @IsUUID()
  @IsOptional()
  equipmentId?: string;

  @IsUUID()
  @IsOptional()
  maintenanceTeamId?: string;

  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationHours?: number;

  @IsEnum(RequestStage)
  @IsOptional()
  stage?: RequestStage;
}

export class AssignTechnicianDto {
  @IsUUID()
  technicianId: string;
}

export class UpdateStageDto {
  @IsEnum(RequestStage)
  stage: RequestStage;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationHours?: number; // Required when moving to REPAIRED
}
