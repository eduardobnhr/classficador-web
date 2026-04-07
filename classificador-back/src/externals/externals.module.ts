import { Module } from '@nestjs/common';
import { ApiClassificacaoPythonService } from 'src/externals/api-classificacao-python/api-classificacao-python.service';
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [HttpModule],
    providers: [ApiClassificacaoPythonService],
    exports: [ApiClassificacaoPythonService],
})
export class ExternalsModule { }
