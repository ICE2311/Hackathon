import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MaintenanceTeamModule } from './maintenance-team/maintenance-team.module';
import { MaintenanceRequestModule } from './maintenance-request/maintenance-request.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EquipmentModule,
    MaintenanceTeamModule,
    MaintenanceRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
