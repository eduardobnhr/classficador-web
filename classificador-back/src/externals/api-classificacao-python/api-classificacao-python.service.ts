import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IApiClassificacaoPythonResponse } from 'src/models/interfaces/externals/api-classificacao-python.interface';

@Injectable()
export class ApiClassificacaoPythonService {
  private mlApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.mlApiUrl = String(this.configService.get<string>('API_URL_CLASSIFICACAO_PYTHON'));
  }

  async predictIncident(title: string, description: string): Promise<IApiClassificacaoPythonResponse> {
    try {
      const payload = { title, description };

      const { data } = await firstValueFrom(
        this.httpService.post<IApiClassificacaoPythonResponse>(this.mlApiUrl, payload)
      );

      return data;
    } catch (error) {
      throw new HttpException(
        'Erro na integração com o classificador externo',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}