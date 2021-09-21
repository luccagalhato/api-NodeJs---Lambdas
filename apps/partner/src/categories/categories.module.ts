import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import JwtToken from '../../../shared/security/jwt-token.security';
import { HttpClientHelper } from '../../../shared/helpers/http-client.helper';

@Module({
  providers: [
    CategoriesService,
    {
      provide: "IToken",
      useClass:  JwtToken
    },
    {
      provide: "HttpClient",
      useClass:  HttpClientHelper
    }
  ],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
