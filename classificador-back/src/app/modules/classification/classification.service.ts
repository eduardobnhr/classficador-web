import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateException } from 'src/commons/exceptions/generateExceptionError';
import { ApiClassificacaoPythonService } from 'src/externals/api-classificacao-python/api-classificacao-python.service';
import { Classification } from 'src/models/entities/classification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectRepository(Classification, 'pg')
    private classificationRepository: Repository<Classification>,
    private readonly apiClassificacaoPythonService: ApiClassificacaoPythonService,
  ) { }

  async generateClassification(incidentId: string, title: string, description: string): Promise<Classification> {
    try {
      const prediction = await this.apiClassificacaoPythonService.predictIncident(title, description);

      const classification = this.classificationRepository.create({
        incident_id: incidentId,
        category: prediction.category,
        severity: prediction.severity,
        confidence_score: prediction.confidence_score,
      });

      return await this.classificationRepository.save(classification);
    } catch (error) {
      GenerateException(error)
    }
  }
}
