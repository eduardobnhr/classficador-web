import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateException } from 'src/commons/exceptions/generateExceptionError';
import { Incident } from 'src/models/entities/incident.entity';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from '../../../models/dtos/incident/create-incident.dto';
import { ClassificationService } from '../classification/classification.service';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident, 'pg')
    private readonly incidentRepository: Repository<Incident>,
    private readonly classificationService: ClassificationService,
  ) { }

  async create(createIncidentDto: CreateIncidentDto, userId: string): Promise<Incident> {
    try {
      const newIncident = this.incidentRepository.create({
        ...createIncidentDto,
        user_id: userId,
        status: 'pending',
      });

      const savedIncident = await this.incidentRepository.save(newIncident);

      this.processClassificationFlow(savedIncident);

      return savedIncident;
    } catch (error) {
      GenerateException(error)
    }
  }

  private async processClassificationFlow(incident: Incident): Promise<void> {
    try {
      await this.incidentRepository.update(incident.id, { status: 'classifying' });

      await this.classificationService.generateClassification(
        incident.id,
        incident.title,
        incident.description
      );

      await this.incidentRepository.update(incident.id, { status: 'classified' });

    } catch (error) {
      await this.incidentRepository.update(incident.id, { status: 'error' });
    }
  }

  async findAll(userId: string): Promise<Incident[]> {
    return this.incidentRepository.find({
      where: { user_id: userId },
      relations: ['classification'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Incident> {
    try {
      const incident = await this.incidentRepository.findOne({
        where: { id, user_id: userId },
        relations: ['classification'],
      });

      if (!incident) {
        throw new NotFoundException(`Incidente com ID ${id} não encontrado.`);
      }

      return incident;
    } catch (error) {
      GenerateException(error)
    }
  }
}
