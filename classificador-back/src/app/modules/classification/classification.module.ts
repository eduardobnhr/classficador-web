import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalsModule } from 'src/externals/externals.module';
import { Classification } from 'src/models/entities/classification.entity';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classification], 'pg'),
    ExternalsModule,
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService],
  exports: [ClassificationService],
})
export class ClassificationModule { }
