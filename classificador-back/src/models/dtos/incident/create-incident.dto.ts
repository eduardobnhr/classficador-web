import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateIncidentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    affected_asset?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    occurred_at?: string;
}
