import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PushNotification } from "../../shared/notifications/push-notification.notification";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";
import JwtToken from "../../shared/security/jwt-token.security";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { OrdersModule } from "./orders/orders.module";
import { SearchModule } from "./search/search.module";
@Module({
  imports: [ConfigModule.forRoot(), OrdersModule, SearchModule],
  controllers: [ClientController],
  providers: [
    ClientService,
    PushNotification,
    {
      provide: "IToken",
      useClass: JwtToken,
    },
    {
      provide: "HttpClient",
      useClass: HttpClientHelper,
    },
  ],
})
export class ClientModule {}
