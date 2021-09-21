import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import JwtToken from '../../../shared/security/jwt-token.security';
import { HttpClientHelper } from '../../../shared/helpers/http-client.helper';

@Module({
  providers: [
    SearchService, HttpClientHelper,
    {
      provide: "IToken",
      useClass:  JwtToken
    },
    {
      provide: "HttpClient",
      useClass:  HttpClientHelper
    }
  ],
  controllers: [SearchController]
})
export class SearchModule { }
