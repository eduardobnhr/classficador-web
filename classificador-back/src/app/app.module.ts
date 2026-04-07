import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configValidationSchema } from 'src/commons/configs/env/env.validation';
import { DatabaseModule } from 'src/commons/databases/db.module';
import { HttpExceptionFilter } from 'src/commons/filters/httpExceptionFilter';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { LoggerInterceptor } from 'src/commons/interceptors/logger.interceptor';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
