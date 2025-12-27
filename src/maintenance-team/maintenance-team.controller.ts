import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MaintenanceTeamService } from './maintenance-team.service';
import {
  CreateMaintenanceTeamDto,
  UpdateMaintenanceTeamDto,
} from './dto/maintenance-team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('maintenance-teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceTeamController {
  constructor(
    private readonly maintenanceTeamService: MaintenanceTeamService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createMaintenanceTeamDto: CreateMaintenanceTeamDto) {
    return this.maintenanceTeamService.create(createMaintenanceTeamDto);
  }

  @Get()
  findAll() {
    return this.maintenanceTeamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceTeamService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceTeamDto: UpdateMaintenanceTeamDto,
  ) {
    return this.maintenanceTeamService.update(id, updateMaintenanceTeamDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.maintenanceTeamService.remove(id);
  }

  // Add member to team
  @Post(':id/members')
  @Roles(UserRole.ADMIN)
  addMember(@Param('id') id: string, @Body('userId') userId: string) {
    return this.maintenanceTeamService.addMember(id, userId);
  }

  // Remove member from team
  @Delete(':id/members/:userId')
  @Roles(UserRole.ADMIN)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.maintenanceTeamService.removeMember(id, userId);
  }
}
