import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';

export class Swagger {
  static setup(app) {
    const defaultThemeSwagger = process.env.SWAGGER_THEME || 'dark';
    const theme = new SwaggerTheme();

    const config = new DocumentBuilder()
      .setTitle('Classificador Web')
      .setDescription('Api voltada para a Aplicação Classificador Web.')
      .setVersion('1.0')
      .addTag('Aqui vamos gerenciar as rotas da aplicação.')
      .addCookieAuth('access_token')
      .addApiKey(
        { type: 'apiKey', name: 'x-csrf-token', in: 'header' },
        'x-csrf-token',
      )
      .build();

    const optionsTheme = {
      explorer: true,
      customCss: theme.getBuffer(defaultThemeSwagger as SwaggerThemeName),
      swaggerOptions: {
        persistAuthorization: true,
      }
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, optionsTheme);
  }
}
