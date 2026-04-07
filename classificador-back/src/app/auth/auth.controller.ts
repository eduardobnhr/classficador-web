import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Documentation } from 'src/commons/configs/swagger/documentation';
import { IsPublic } from 'src/commons/decorators/is-public-decorator';
import { LocalAuthGuard } from 'src/commons/guards/local-auth.guard';
import { LoginRequestBody } from 'src/models/dtos/auth/LoginRequestBody.dto';
import type { AuthRequest } from 'src/models/interfaces/auth/AuthRequest';
import { UserToken } from 'src/models/interfaces/auth/UserToken';
import { AuthService } from './auth.service';


@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Documentation.create(LoginRequestBody, UserToken)
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
