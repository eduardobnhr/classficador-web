import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassificationService } from './classification.service';

@ApiTags('classification')
@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) { }
}
