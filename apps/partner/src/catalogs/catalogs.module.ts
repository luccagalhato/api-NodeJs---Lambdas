import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import JwtToken from '../../../shared/security/jwt-token.security';
import { HttpClientHelper } from '../../../shared/helpers/http-client.helper';

@Module({
  providers: [
    CatalogsService,
    {
      provide: "IToken",
      useClass:  JwtToken
    },
    {
      provide: "HttpClient",
      useClass:  HttpClientHelper
    }
  ],
  controllers: [CatalogsController],
  exports: [CatalogsService]
})
export class CatalogsModule {}
