import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Context, Handler } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { eventContext } from "aws-serverless-express/middleware";
import { Server } from "http";
import { SearchModule } from "./search.module";
import "../../../config/aws.config";

const express = require("express");
const binaryMimeTypes: string[] = [];
let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      SearchModule,
      new ExpressAdapter(expressApp)
    );
    nestApp.use(eventContext());
    nestApp.setGlobalPrefix("search");
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  delete event.multiValueHeaders;
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, "PROMISE").promise;
};
