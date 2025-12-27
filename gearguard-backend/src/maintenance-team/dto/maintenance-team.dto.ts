import { IsString, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateMaintenanceTeamDto {
  @IsString()
  name: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  memberIds?: string[];
}

export class UpdateMaintenanceTeamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  memberIds?: string[];
}
