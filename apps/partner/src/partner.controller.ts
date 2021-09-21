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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders/orders.service';
import { PlainBody } from '../../shared/decorators';
import { Partners, Products } from '../../shared/interfaces';
import { PartnerService } from './partner.service';
import { AuthorizationGuard } from '../../shared/security/authorization.guard';
import Role from '../../shared/security/role.model';
import { Roles } from '../../shared/decorators/role.decorator';
import { HandlerException } from '../../shared/exceptions/handler.exception';
import { PartnerDto } from '../../shared/dto/partner.dto';
import { CatalogsService } from './catalogs/catalogs.service';
import { DocumentModelType } from '../../shared/@types';
import { ProductsService } from './products/products.service';
import AbstractController from '../../shared/helpers/extract-username-token';
import { confirmSNS } from '../../shared/aws/sns-methods';
import { env } from 'process';

@Controller()
export class PartnerController extends AbstractController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly orderService: OrdersService,
    private readonly catalogsService: CatalogsService,
    private readonly productService: ProductsService,
  ) {
    super();
  }

  @Get('/:id/is-online')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  @UseFilters(new HandlerException())
  async isOnline(@Param('id') id: string) {
    const partner: Partners = await this.partnerService.findOne(id);
    return partner.is_online;
  }

  @Patch('/:id/is-online')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  @UseFilters(new HandlerException())
  @HttpCode(204)
  async updateIsOnline(@Param('id') id: string) {
    return await this.partnerService.updateIsOnline(id);
  }

  @Get('/products/:id')
  //@UseGuards(AuthorizationGuard)
  @Roles(Role.USER, Role.PARTNER, Role.COLLABORATOR)
  async searchProduct(@Param('id') id: string): Promise<Products> {
    return await this.productService.showProduct(id);
  }

  @Get('/products')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER, Role.PARTNER, Role.COLLABORATOR)
  async findAllProducts(): Promise<DocumentModelType<Products>> {
    return await this.productService.showAllProducts();
  }

  @Get('/:id/catalog')
  //@UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getCatalog(@Param('id') id: string): Promise<DocumentModelType<any>> {
    console.log(id);
    return await this.catalogsService.getCatalogByPartern(id);
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async findAll(
    @Query('city') city: string,
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('categories') categories: string,
  ): Promise<any> {
    return await this.partnerService.findAll(
      city,
      {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      },
      categories,
    );
  }

  @Get('/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async findOne(@Param('id') id: string): Promise<Partners> {
    return await this.partnerService.findOne(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async create(@Body() partner: PartnerDto, @Req() request) {
    const id = this.getValueByKeyInAccessTokenOfRequest('username', request);
    partner.id = id;
    return await this.partnerService.create(partner);
  }

  @Put('/:id')
  @UsePipes(
    new ValidationPipe({ transform: true, dismissDefaultMessages: true }),
  )
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async update(
    @Param('id') partnerId: string,
    @Body() partner: PartnerDto,
  ): Promise<Partners> {
    return await this.partnerService.update(partnerId, partner);
  }

  @Delete('/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.partnerService.delete(id);
  }

  // TODO: Get PartnerId from user Token
  @Patch('accepted-order')
  async snsConfirmOrder(
    @Body('orderId') orderId: string,
    @Body('partnerId') partnerId: string,
    @Body('deliveryId') deliveryId: string,
  ): Promise<void> {
    await this.partnerService.snsConfirmOrder(orderId, partnerId, deliveryId);
  }

  @Patch('refused-order')
  async snsRefuseOrder(
    @Body('orderId') orderId: string,
    @Body('partnerId') partnerId: string,
    @Body('deliveryId') deliveryId: string,
    @Body('refuseReason') refuseReason: string,
  ): Promise<void> {
    await this.partnerService.snsRefuseOrder(orderId, partnerId, deliveryId, refuseReason);
  }

  @Get('/all/in-operational')
  async getAllInOperation(
    @Query('city') city: string,
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    return await this.partnerService.getAllInOperation(city, {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });
  }

  @Get('/is-open/:id')
  async isInOperation(@Param('id') id) {
    return await this.partnerService.isInOperation(id);
  }

  @Get('/operational-time/:id')
  async getOperationTime(@Param('id') id) {
    return await this.partnerService.getOperationTime(id);
  }

  @Post('order-is-ready')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async orderIsReadyNotify(
    @Body('deliveryId') deliveryId: string,
    @Body('orderId') orderId: string,
  ): Promise<void> {
    await this.partnerService.snsOrderIsReady(deliveryId, orderId);
  }

  @Post('sns-created-order')
  snsCreatedOrder(@PlainBody() body, @Req() request): any {
    if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation") && (request.headers['x-amz-sns-topic-arn'] === process.env.CREATE_ORDER_ARN)) {
      return this.partnerService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
    } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
      console.log(
        "Partner - Order Created! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(`Invalid message type ${request.headers['x-amz-sns-topic-arn']}. Expecting ${process.env.CREATE_ORDER_ARN}. Request type: ${request.headers["x-amz-sns-message-type"]}`);
    }
  }

  @Post("sns-on-partner")
  snsOnPartner(@PlainBody() body, @Req() request): any {
    if ((request.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation") && (request.headers['x-amz-sns-topic-arn'] === process.env.ARRIVE_ON_PARTNER)) {
      return this.partnerService.confirmSNStopic(request.headers['x-amz-sns-topic-arn'], body.Token);
    } else if (request.headers['x-amz-sns-message-type'] === 'Notification') {
      console.log(
        "Partner - Arrive on Partner! Message: ",
        body.Message,
        body.MessageAttributes
      );
    } else {
      throw new Error(`Invalid message type ${request.headers['x-amz-sns-topic-arn']}. Expecting ${process.env.ARRIVE_ON_PARTNER}. Request type: ${request.headers["x-amz-sns-message-type"]}`);
    }
  }
}
