import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import JwtToken from '../../../shared/security/jwt-token.security';
import { HttpClientHelper } from '../../../shared/helpers/http-client.helper';

@Module({
  providers: [
    OrdersService,
    {
      provide: "IToken",
      useClass:  JwtToken
    },
    {
      provide: "HttpClient",
      useClass:  HttpClientHelper
    }
  ],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule { }
