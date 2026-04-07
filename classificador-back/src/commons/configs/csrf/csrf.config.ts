import { ConfigService } from '@nestjs/config';
import { doubleCsrf, DoubleCsrfUtilities } from 'csrf-csrf';
import { Request } from 'express';
import { jwtConstants } from '../jwt/jwt.config';

export class CsrfConfig {
  private static csrfUtilities: DoubleCsrfUtilities;

  static initialize(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'csrf-fallback-secret-here-xyz';
    const environment = configService.get<string>('ENVIRONMENT');

    this.csrfUtilities = doubleCsrf({
      getSecret: () => secret,
      getSessionIdentifier: () => '',
      cookieName: 'x-csrf-token',
      cookieOptions: {
        sameSite: 'lax',
        path: '/',
        secure: environment === 'production',
        httpOnly: true,
        maxAge: jwtConstants.expiresInMs,
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
      getCsrfTokenFromRequest: (req: Request) => {
        return req.headers['x-csrf-token'] as string;
      },
    });
  }

  static get generateCsrfToken() {
    return this.csrfUtilities.generateCsrfToken;
  }

  static get doubleCsrfProtection() {
    return this.csrfUtilities.doubleCsrfProtection;
  }
}
