import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
import { CsrfConfig } from 'src/commons/configs/csrf/csrf.config';
import { jwtConstants } from 'src/commons/configs/jwt/jwt.config';
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

  @Documentation.login(LoginRequestBody, UserToken)
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest, @Res({ passthrough: true }) response: Response) {
    const { access_token } = this.authService.login(req.user);
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: jwtConstants.expiresInMs,
    });
    return { message: 'Login successful' };
  }

  @Documentation.csrfToken()
  @IsPublic()
  @Get('csrf-token')
  getCsrfToken(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    return { token: CsrfConfig.generateCsrfToken(req, response) };
  }

  @Documentation.logout()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', { path: '/' });
    return { message: 'Logout successful' };
  }
}
