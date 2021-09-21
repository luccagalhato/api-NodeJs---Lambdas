import { JunoService } from "../../../libs/juno/src";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { serverConfigModel } from "../../shared/models/serverConfigs.model";
import JwtToken from "../../shared/security/jwt-token.security";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    PaymentsService,
    {
      provide: "IToken",
      useClass: JwtToken,
    },
    {
      provide: "HttpClient",
      useClass: HttpClientHelper,
    },
    {
      provide: "JUNO",
      useFactory: async () => {
        const [serverConfig] = await serverConfigModel
          .scan()
          .attributes(["gatewayToken"])
          .exec();

        const updateOAuthToken = async (newOAuthToken: string) => {
          serverConfigModel.transaction.update({ gatewayToken: newOAuthToken });
        };

        const junoService = new JunoService({
          oAuthToken: serverConfig.gatewayToken,
          updateOAuthToken,
        });
        return junoService;
      },
    },
  ],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
