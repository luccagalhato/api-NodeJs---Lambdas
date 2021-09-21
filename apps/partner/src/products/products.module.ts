import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import JwtToken from '../../../shared/security/jwt-token.security';
import { HttpClientHelper } from '../../../shared/helpers/http-client.helper';

@Module({
  providers: [
    ProductsService,
    {
      provide: "IToken",
      useClass:  JwtToken
    },
    {
      provide: "HttpClient",
      useClass:  HttpClientHelper
    }
  ],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule {}
