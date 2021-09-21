import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { CollaboratorService } from "./collaborator.service";
import { PlainBody } from "../../shared/decorators";
import { publishSNS } from "../../shared/aws/sns-methods";
import { Collaborator } from "../../shared/interfaces";
import { Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { DeliveriesService } from "./deliveries/deliveries.service";
import { AuthorizationGuard } from "../../shared/security/authorization.guard";
import { Roles } from "../../shared/decorators/role.decorator";
import Role from "../../shared/security/role.model";
import { HandlerException } from "../../shared/exceptions/handler.exception";
import AbstractController from "../../shared/helpers/extract-username-token";

@Controller()
export class CollaboratorController extends AbstractController {
  constructor(
    private readonly collaboratorService: CollaboratorService,
    private readonly deliveriesService: DeliveriesService
  ) {
    super();
  }

  @Get("/:id/is-online")
  @UseFilters(new HandlerException())
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async isOnline(@Param("id") id) {
    const register = await this.collaboratorService.findOne(id);
    return register.is_online;
  }

  @Patch("/:id/is-online")
  @UseFilters(new HandlerException())
  @HttpCode(204)
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async updateIsOnline(@Param("id") id) {
    return await this.collaboratorService.updateIsOnline(id);
  }

  @Get("/:id/have-new-deliveries")
  @UseFilters(new HandlerException())
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async haveNewDeliveries(@Param("id") id) {
    return await this.collaboratorService.haveNewDeliveries(id);
  }

  @Get("/:id/historic")
  @UseFilters(new HandlerException())
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async historic(@Param("id") id) {
    return await this.collaboratorService.historic(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async create(
    @Body() collaborator: Collaborator,
    @Req() request
  ): Promise<any> {
    const id = this.getValueByKeyInAccessTokenOfRequest("username", request);
    collaborator.id = id;
    return await this.collaboratorService.create(collaborator);
  }

  @Put("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async update(
    @Param("id") id: string,
    @Body() collaborator: any
  ): Promise<Collaborator> {
    return await this.collaboratorService.update(id, collaborator);
  }

  @Put("geo-location/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async updateGeoLocation(
    @Param("id") id: string,
    @Body() collaborator: any
  ): Promise<Collaborator> {
    return await this.collaboratorService.updateGeoLocation(id, collaborator);
  }

  @Get("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR, Role.PARTNER)
  async findOne(@Param("id") id: string): Promise<any> {
    return this.collaboratorService.findOne(id);
  }

  @Delete("/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async remove(@Param("id") id: string): Promise<void> {
    return await this.collaboratorService.remove(id);
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async findAll(
    @Query() query: Partial<Collaborator>
  ): Promise<ScanResponse<Collaborator> | Scan<Collaborator>> {
    return await this.collaboratorService.findAll(query);
  }

  @Get("find-closest-collaborator/:latitude/:longitude")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async getClosestCollaborator(
    @Param("latitude") latitude: number,
    @Param("longitude") longitude: number
  ) {
    return await this.collaboratorService.getClosestCollaborator(
      latitude,
      longitude
    );
  }

  @Patch("accept-delivery")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async acceptDelivery(
    @Body("deliveryId") deliveryId: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.acceptDelivery(deliveryId, latitude, longitude);
  }

  @Patch("refuse-delivery")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async snsRefuseDelivery(
    @Body("orderId") orderId: string,
    @Body("deliveryId") deliveryId: string,
    @Body("refuseReason") refuseReason: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.refuseDelivery(deliveryId, orderId, latitude, longitude, refuseReason);
  }

  @Patch("partner-arrive")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async snsPartnerArrive(
    @Body("orderId") orderId: string,
    @Body("deliveryId") deliveryId: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.partnerArrive(deliveryId, orderId, latitude, longitude);
  }

  @Patch("picked-order")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async snsPickedOrder(
    @Body("orderId") orderId: string,
    @Body("deliveryId") deliveryId: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.pickedOrder(deliveryId, orderId, latitude, longitude);
  }

  @Patch("order-has-arrived")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async snsWaitingClient(
    @Body("orderId") orderId: string,
    @Body("deliveryId") deliveryId: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.waitingClient(deliveryId, orderId, latitude, longitude);
  }

  @Patch("delivered-order")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.COLLABORATOR)
  async snsOrderDelivered(
    @Body("orderId") orderId: string,
    @Body("deliveryId") deliveryId: string,
    @Body("latitude") latitude: number,
    @Body("longitude") longitude: number
  ) {
    await this.collaboratorService.deliveredOrder(deliveryId, orderId, latitude, longitude);
  }

  @Post("sns-accepted-order")
  snsNotifyOrderAccepted(@PlainBody() body, @Req() request): any {
  const topicArn = process.env.ACCEPT_ORDER_ARN
  if (request.headers['x-amz-sns-topic-arn'] === topicArn) {
    if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation")) {
      return this.collaboratorService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
    } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
      console.info(
        "Collaborator - Order is Ready!",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(`Invalid message type ${request.headers["x-amz-sns-message-type"]}`);
    }
  } else {
    throw new Error(`Invalid message arn ${request.headers['x-amz-sns-topic-arn']}. Expecting ${topicArn}`);
  }
}

  @Post("sns-order-is-ready")
  snsNotifyOrderIsReady(@PlainBody() body, @Req() request): any {
    const topicArn = process.env.ORDER_READY_ARN
    if (request.headers['x-amz-sns-topic-arn'] === topicArn) {
      if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation")) {
        return this.collaboratorService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
      } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
        console.info(
          "Collaborator - Order is Ready!",
          body.Message,
          body.MessageAttributes
        );
      } else {
        throw new Error(`Invalid message type ${request.headers["x-amz-sns-message-type"]}`);
      }
    } else {
      throw new Error(`Invalid message arn ${request.headers['x-amz-sns-topic-arn']}. Expecting ${topicArn}`);
    }
  }
}
