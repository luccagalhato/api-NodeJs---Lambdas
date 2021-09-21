import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamooseModule } from "nestjs-dynamoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [DynamooseModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
