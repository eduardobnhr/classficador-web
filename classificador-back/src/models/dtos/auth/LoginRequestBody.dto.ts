import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({ example: 'teste' })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({ example: 'teste123' })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}
