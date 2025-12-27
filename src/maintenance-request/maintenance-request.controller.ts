import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MaintenanceRequestService } from './maintenance-request.service';
import {
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  AssignTechnicianDto,
  UpdateStageDto,
} from './dto/maintenance-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, MaintenanceType, RequestStage } from '@prisma/client';

@Controller('maintenance-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceRequestController {
  constructor(
    private readonly maintenanceRequestService: MaintenanceRequestService,
  ) {}

  @Post()
  create(@Body() createDto: CreateMaintenanceRequestDto, @Request() req) {
    return this.maintenanceRequestService.create(createDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('type') type?: MaintenanceType,
    @Query('stage') stage?: RequestStage,
    @Query('maintenanceTeamId') maintenanceTeamId?: string,
    @Query('equipmentId') equipmentId?: string,
  ) {
    return this.maintenanceRequestService.findAll({
      type,
      stage,
      maintenanceTeamId,
      equipmentId,
    });
  }

  @Get('kanban')
  getKanbanData() {
    return this.maintenanceRequestService.getKanbanData();
  }

  @Get('calendar')
  getCalendarData(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    return this.maintenanceRequestService.getCalendarData(startDate, endDate);
  }

  @Get('metrics')
  getMetrics(@Query('month') month: string, @Query('year') year: string) {
    return this.maintenanceRequestService.getMetrics(month, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceRequestService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMaintenanceRequestDto,
  ) {
    return this.maintenanceRequestService.update(id, updateDto);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  assignTechnician(
    @Param('id') id: string,
    @Body() assignDto: AssignTechnicianDto,
    @Request() req,
  ) {
    return this.maintenanceRequestService.assignTechnician(
      id,
      assignDto,
      req.user.id,
    );
  }

  @Patch(':id/stage')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  updateStage(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateStageDto,
    @Request() req,
  ) {
    return this.maintenanceRequestService.updateStage(
      id,
      updateStageDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.maintenanceRequestService.remove(id);
  }
}
