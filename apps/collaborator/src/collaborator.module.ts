import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";
import JwtToken from "../../shared/security/jwt-token.security";
import { CollaboratorController } from "./collaborator.controller";
import { CollaboratorService } from "./collaborator.service";
import { DeliveriesModule } from "./deliveries/deliveries.module";

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ".env" }), DeliveriesModule],
  controllers: [CollaboratorController],
  providers: [
    CollaboratorService,
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
export class CollaboratorModule {}
