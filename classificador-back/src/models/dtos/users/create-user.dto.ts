import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @MaxLength(120)
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @MaxLength(255)
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    @MaxLength(255)
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    role: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    @IsDefined()
    is_active: boolean;
}
