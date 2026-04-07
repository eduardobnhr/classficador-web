import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateIncidentDto } from './create-incident.dto';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
    @ApiProperty({ required: false, enum: ['pending', 'classifying', 'classified', 'error'] })
    @IsOptional()
    @IsString()
    @IsIn(['pending', 'classifying', 'classified', 'error'])
    status?: string;
}
