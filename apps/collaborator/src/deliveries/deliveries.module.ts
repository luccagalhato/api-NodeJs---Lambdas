import { Module } from "@nestjs/common";
import { HttpClientHelper } from "../../../shared/helpers/http-client.helper";
import JwtToken from "../../../shared/security/jwt-token.security";
import { DeliveriesController } from "./deliveries.controller";
import { DeliveriesService } from "./deliveries.service";

@Module({
  controllers: [DeliveriesController],
  providers: [
    DeliveriesService,
    {
      provide: "IToken",
      useClass: JwtToken,
    },
    {
      provide: "HttpClient",
      useClass: HttpClientHelper,
    },
  ],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
