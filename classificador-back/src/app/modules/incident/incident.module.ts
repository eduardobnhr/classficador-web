import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from 'src/models/entities/incident.entity';
import { ClassificationModule } from '../classification/classification.module';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident], 'pg'),
    ClassificationModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
})
export class IncidentModule { }
