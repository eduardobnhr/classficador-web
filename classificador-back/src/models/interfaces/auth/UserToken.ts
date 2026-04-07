import { ApiProperty } from '@nestjs/swagger';

export class UserToken {
  @ApiProperty()
  access_token: string;
}