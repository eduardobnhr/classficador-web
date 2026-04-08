import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configValidationSchema } from 'src/commons/configs/env/env.validation';
import { DatabaseModule } from 'src/commons/databases/db.module';
import { HttpExceptionFilter } from 'src/commons/filters/httpExceptionFilter';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { LoggerInterceptor } from 'src/commons/interceptors/logger.interceptor';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { ExternalsModule } from 'src/externals/externals.module';
import { AuthModule } from './auth/auth.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { IncidentModule } from './modules/incident/incident.module';
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
    DashboardModule,
    IncidentModule,
    ClassificationModule,
    ExternalsModule,
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
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
