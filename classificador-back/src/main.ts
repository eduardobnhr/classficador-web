import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { CsrfConfig } from './commons/configs/csrf/csrf.config';
import { Swagger } from './commons/configs/swagger/swagger.config';
import { ServicesUtils } from './commons/utils/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  const configsMain = {
    port: Number(configService.get<number>('API_PORT')),
    urlAutorizadaCors: configService.get<string>('URL_AUTORIZADA_CORS'),
    environment: configService.get<string>('ENVIRONMENT'),
  };

  if (configsMain.environment !== 'production') {
    Swagger.setup(app);
  }

  app.enableCors({
    origin: configsMain.urlAutorizadaCors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  CsrfConfig.initialize(configService);

  app.use(cookieParser());
  app.use(CsrfConfig.doubleCsrfProtection);

  await app.listen(configsMain.port, async () => {
    Logger.debug(`API disponível em: ${ServicesUtils.getLocalIp()}:${configsMain.port}`);
  });
}
bootstrap();
