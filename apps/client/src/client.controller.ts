import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";

import { PlainBody } from "../../shared/decorators";
import { ClientService } from "./client.service";
import {
  Clients,
  DeliveryAddress,
} from "../../shared/interfaces/clients.interface";
import { AuthorizationGuard } from "../../shared/security/authorization.guard";
import { Roles } from "../../shared/decorators/role.decorator";
import Role from "../../shared/security/role.model";
import { FormatedGoogleMapsAddress } from "../../shared/interfaces";
import { PushNotification } from "../../shared/notifications/push-notification.notification";
import AbstractController from "../../shared/helpers/extract-username-token";
import { CardTokenResponse } from "../../../libs/juno/src/responses";
import { confirmSNS } from "../../shared/aws/sns-methods";

@Controller()
export class ClientController extends AbstractController {
  private clientService: ClientService;
  private pushNotification: PushNotification;

  constructor(
    clientService: ClientService,
    pushNotification: PushNotification
  ) {
    super();
    this.clientService = clientService;
    this.pushNotification = pushNotification;
  }

  @Post("/create")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async createClient(
    @Body() clients: Clients,
    @Req() request
  ): Promise<Clients> {
    const id = this.getValueByKeyInAccessTokenOfRequest("username", request);
    clients.id = id;
    return await this.clientService.createClient(clients);
  }

  @Put("address/google-location/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async updateGoogleLocation(
    @Body() googleAddress: FormatedGoogleMapsAddress,
    @Param("id") id: string
  ): Promise<DeliveryAddress> {
    return await this.clientService.updateAddressGoogleLocation(
      id,
      googleAddress
    );
  }

  @Put("/address/lat-lng/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async updateAddressLatLon(
    @Body("lat") latitude: number,
    @Body("lng") longitude: number,
    @Param("id") id: string
  ): Promise<DeliveryAddress> {
    return await this.clientService.updateAddressLatLng(
      id,
      latitude,
      longitude
    );
  }

  @Put("/address/surname/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async updateAddressSurname(
    @Param("id") id: string,
    @Body("place_id") placeId: string,
    @Body("surname") surname: string,
    @Body("number") number: number,
    @Body("reference_point") referencePoint: string,
    @Body("complement") complement: string
  ): Promise<Clients> {
    return await this.clientService.updateAddressSurname(
      id,
      placeId,
      surname,
      number,
      referencePoint,
      complement
    );
  }

  @Put("/payment/credit-card/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async updateCreditCard(
    @Body() creditCard: CardTokenResponse,
    @Param("id") id: string
  ) {
    return await this.clientService.updatePaymentCreditCard(id, creditCard);
  }

  @Get("credit-cards")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async getUserCreditCards(@Req() request: Request) {
    const id = this.getValueByKeyInAccessTokenOfRequest("username", request);
    return this.clientService.getUserCreditCards(id);
  }

  @Get("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async findOne(@Param("id") id: string): Promise<any> {
    return await this.clientService.findOne(id);
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async findAll() {
    return await this.clientService.findAll();
  }

  @Put("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async update(
    @Param("id") id: string,
    @Body() client: Clients
  ): Promise<Clients> {
    return await this.clientService.update(id, client);
  }

  @Delete("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async remove(@Param("id") id: string): Promise<void> {
    return await this.clientService.remove(id);
  }

  @Post("sns-order-is-ready")
  snsOrderIsReady(@PlainBody() body, @Req() request): any {
    if (
      request.headers["x-amz-sns-message-type"] ===
        "SubscriptionConfirmation" &&
      request.headers["x-amz-sns-topic-arn"] === process.env.ORDER_READY_ARN
    ) {
      return this.clientService.confirmSNStopic(
        request.headers["x-amz-sns-topic-arn"],
        body.Token
      );
    } else if (request.headers["x-amz-sns-message-type"] === "Notification") {
      console.log(
        "Client - Order is Ready! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(
        `Invalid message type ${request.headers["x-amz-sns-topic-arn"]}. Expecting ${process.env.ORDER_READY_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`
      );
    }
  }

  @Post("sns-order-has-arrived")
  snsOrderHasArrived(@PlainBody() body, @Req() request): any {
    if (
      request.headers["x-amz-sns-message-type"] ===
        "SubscriptionConfirmation" &&
      request.headers["x-amz-sns-topic-arn"] === process.env.ORDER_ARRIVED_ARN
    ) {
      return this.clientService.confirmSNStopic(
        request.headers["x-amz-sns-topic-arn"],
        body.Token
      );
    } else if (request.headers["x-amz-sns-message-type"] === "Notification") {
      console.log(
        "Client - Order Has Arrived! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(
        `Invalid message type ${request.headers["x-amz-sns-topic-arn"]}. Expecting ${process.env.ORDER_ARRIVED_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`
      );
    }
  }

  @Post("sns-accepted-order")
  snsAcceptedOrder(@PlainBody() body, @Req() request): any {
    if (
      request.headers["x-amz-sns-message-type"] ===
        "SubscriptionConfirmation" &&
      request.headers["x-amz-sns-topic-arn"] === process.env.ACCEPT_ORDER_ARN
    ) {
      return this.clientService.confirmSNStopic(
        request.headers["x-amz-sns-topic-arn"],
        body.Token
      );
    } else if (request.headers["x-amz-sns-message-type"] === "Notification") {
      console.log(
        "Client - Order Accepted! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(
        `Invalid message type ${request.headers["x-amz-sns-topic-arn"]}. Expecting ${process.env.ACCEPT_ORDER_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`
      );
    }
  }

  @Post("sns-picked-order")
  snsOrderPicked(@PlainBody() body, @Req() request): any {
    if (
      request.headers["x-amz-sns-message-type"] ===
        "SubscriptionConfirmation" &&
      request.headers["x-amz-sns-topic-arn"] === process.env.ORDER_PICKED_ARN
    ) {
      return this.clientService.confirmSNStopic(
        request.headers["x-amz-sns-topic-arn"],
        body.Token
      );
    } else if (request.headers["x-amz-sns-message-type"] === "Notification") {
      console.log(
        "Client - Order Picked! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(
        `Invalid message type ${request.headers["x-amz-sns-topic-arn"]}. Expecting ${process.env.ORDER_PICKED_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`
      );
    }
  }

  @Post("sns-order-delivered")
  snsOrderDelivered(@PlainBody() body, @Req() request): any {
    if (
      request.headers["x-amz-sns-message-type"] ===
        "SubscriptionConfirmation" &&
      request.headers["x-amz-sns-topic-arn"] === process.env.ORDER_DELIVERED_ARN
    ) {
      return this.clientService.confirmSNStopic(
        request.headers["x-amz-sns-topic-arn"],
        body.Token
      );
    } else if (request.headers["x-amz-sns-message-type"] === "Notification") {
      console.log(
        "Client - Order Delivered! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(
        `Invalid message type ${request.headers["x-amz-sns-topic-arn"]}. Expecting ${process.env.ORDER_DELIVERED_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`
      );
    }
  }

  @Post("sns-on-partner")
  snsOnPartner(@PlainBody() body, @Req() request): any {
    if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation") && (request.headers['x-amz-sns-topic-arn'] === process.env.ARRIVE_ON_PARTNER)) {
      return this.clientService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
    } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
      console.log(
        "Client - Arrive on Partner! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(`Invalid message type ${request.headers['x-amz-sns-topic-arn']}. Expecting ${process.env.ARRIVE_ON_PARTNER}. Request type: ${request.headers["x-amz-sns-message-type"]}`);
    }
  }

  @Post("sns-refused-order")
  snsRefuseedOrder(@PlainBody() body, @Req() request): any {
    if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation") && (request.headers['x-amz-sns-topic-arn'] === process.env.REFUSE_ORDER_ARN)) {
      return this.clientService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
    } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
      console.log(
        "Client - Arrive on Partner! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(`Invalid message type ${request.headers['x-amz-sns-topic-arn']}. Expecting ${process.env.REFUSE_ORDER_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`);
    }
  }
}
