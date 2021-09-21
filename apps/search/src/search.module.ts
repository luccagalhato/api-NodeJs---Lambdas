import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import "../../../config/database/databasse.config";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";
import JwtToken from "../../shared/security/jwt-token.security";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
  controllers: [SearchController],
  providers: [
    SearchService,
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
export class SearchModule {}
