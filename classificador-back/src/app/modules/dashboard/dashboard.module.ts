import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from 'src/models/entities/incident.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Incident], 'pg')],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
