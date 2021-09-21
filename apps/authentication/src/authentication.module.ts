import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { ConfigModule } from "@nestjs/config";
import { CognitoService } from "./cognito/cognito.service";
import JwtToken from "../../shared/security/jwt-token.security";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";
import { CognitoModule } from "./cognito/cognito.module";

@Module({
  imports: [ConfigModule.forRoot(), CognitoModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: "IToken",
      useClass: JwtToken,
    },
    {
      provide: "HttpClient",
      useClass: HttpClientHelper,
    },
    CognitoService,
  ],
})
export class AuthenticationModule {}
