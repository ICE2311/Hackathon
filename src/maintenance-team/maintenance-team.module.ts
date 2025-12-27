import { Module } from '@nestjs/common';
import { MaintenanceTeamService } from './maintenance-team.service';
import { MaintenanceTeamController } from './maintenance-team.controller';

@Module({
  controllers: [MaintenanceTeamController],
  providers: [MaintenanceTeamService],
  exports: [MaintenanceTeamService],
})
export class MaintenanceTeamModule {}
