import { Module } from "@nestjs/common";
import { GeolocationController } from "./geolocation.controller";
import { GeolocationService } from "./geolocation.service";
import { ConfigModule } from "@nestjs/config";
import JwtToken from "../../shared/security/jwt-token.security";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GeolocationController],
  providers: [
    GeolocationService,
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
export class GeolocationModule {}
