import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
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
