import { Module } from "@nestjs/common";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { DynamooseModule } from "nestjs-dynamoose";
import { ProductsModule } from "./products/products.module";
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from "./orders/orders.module";
import { CatalogsModule } from "./catalogs/catalogs.module";
import { CategoriesModule } from "./categories/categories.module";
import "../../../config/database/databasse.config";
import JwtToken from "../../shared/security/jwt-token.security";
import { HttpClientHelper } from "../../shared/helpers/http-client.helper";
@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot(),
    ProductsModule,
    OrdersModule,
    CatalogsModule,
    CategoriesModule,
  ],
  controllers: [PartnerController],
  providers: [
    PartnerService,
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
export class PartnerModule {}
