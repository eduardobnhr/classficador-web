import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateClassificationDto {
    @ApiProperty()
    @IsUUID()
    incident_id: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    category: string;

    @ApiProperty()
    @IsString()
    @MaxLength(20)
    severity: string;

    @ApiProperty()
    @IsNumber()
    confidence_score: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    model_version?: string;
}
