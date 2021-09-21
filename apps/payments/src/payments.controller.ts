import {
  Controller,
  Body,
  Post,
  Put,
  Get,
  Param,
  UseGuards,
  Patch,
  Delete,
  HttpCode,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { PaymentsService } from './payments.service';
import { WebhookSignatureGuard } from '../../shared/security/webhook-signature.guard';
import {
  CreateWebhookDTO,
  DeleteWebhookDTO,
  UpdateWebhookDTO,
} from '../../shared/dto/webhook.dto';
import {
  ChargeDTO,
  FiltersChargeDTO,
  UpdateChargeSplitDTO,
} from '../../shared/dto/charge.dto';
import {
  CapturePaymentDTO,
  PaymentDTO,
  RefundDTO,
} from '../../shared/dto/payment.dto';
import {
  TransferBankAccountDTO,
  TransferDefaultBankDTO,
  TransferP2PDTO,
  TransferPixDTO,
} from '../../shared/dto/transfer.dto';
import {
  CreateDigitalAccountDTO,
  UpdateDigitalAccountDTO,
} from '../../shared/dto/digital-account.dto';

import AbstractController from '../../shared/helpers/extract-username-token';
import { AuthorizationGuard } from '../../shared/security/authorization.guard';
import { CardHashDTO } from '../../shared/dto/card.dto';
import { Roles } from '../../shared/decorators/role.decorator';
import Role from '../../shared/security/role.model';

@Controller()
export class PaymentsController extends AbstractController {
  private paymentsService: PaymentsService;

  constructor(paymentService: PaymentsService) {
    super();
    this.paymentsService = paymentService;
  }

  @Post('credit-card-hash')
  async cardHash(@Body('hash') cardData) {
    return this.paymentsService.creditCardHash(cardData);
  }

  @Post('add-credit-card')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async createCreditCardTokenization(
    @Body() cardHashData: CardHashDTO,
    @Req() request: Request,
  ) {
    const id = this.getValueByKeyInAccessTokenOfRequest('username', request);

    const [, accessToken] = request.headers['authorization'].split('Bearer ');
    const idToken = request.headers['idtoken'] as string;

    const cardHash = cardHashData.cardHash;
    
    return this.paymentsService.creditCardTokenization({
      id,
      cardHash,
      accessToken,
      idToken,
    });
  }

  @Get('charges')
  async listCharges(
    @Query('token') token?: string,
    @Query() params?: FiltersChargeDTO,
  ) {
    return this.paymentsService.listCharges(params, token);
  }

  @Get('charges/:id')
  async getCharge(@Param('id') id: string, @Query('token') token?: string) {
    return this.paymentsService.getChargeById(id, token);
  }

  @Post('charges')
  async createCharge(
    @Body() chargeData: ChargeDTO,
    @Query('token') token?: string,
  ) {
    return this.paymentsService.createCharge(chargeData, token);
  }

  @Put('charges/:id')
  async updateChargeSplit(
    @Param('id') id: string,
    @Body() chargeSplitData: UpdateChargeSplitDTO,
    @Query('token') token?: string,
  ) {
    return this.paymentsService.updateChargeSplit(id, chargeSplitData, token);
  }

  @Delete('charges/:id')
  @HttpCode(204)
  async cancelCharge(@Param('id') id: string, @Query('token') token?: string) {
    return this.paymentsService.cancelCharge(id, token);
  }

  @Post('payment')
  async createPayment(@Body() paymentData: PaymentDTO) {
    return this.paymentsService.createPaymentToCharge(paymentData);
  }

  @Put('payment/:id')
  async capturePayment(
    @Param('id') id: string,
    @Body() paymentData: CapturePaymentDTO,
  ) {
    return this.paymentsService.capturePayment(id, paymentData);
  }

  @Delete('payment/:id')
  async refundPayment(@Param('id') id: string, @Body() refundData: RefundDTO) {
    return this.paymentsService.refundPayment(id, refundData);
  }

  @Post('transfer')
  @Post('transfer/p2p')
  @Post('transfer/bank')
  @Post('transfer/pix')
  async createTransfer(
    @Body()
    transferData:
      | TransferDefaultBankDTO
      | TransferP2PDTO
      | TransferBankAccountDTO
      | TransferPixDTO,
    @Query('token') token?: string,
  ) {
    return this.paymentsService.createTransfer({ token, ...transferData });
  }

  @Get('balance')
  async checkBalance(@Query('token') token?: string) {
    return this.paymentsService.checkBalance(token);
  }

  @Get('digital-account')
  async getDigitalAccount(@Query('token') token?: string) {
    return this.paymentsService.getDigitalAccount(token);
  }

  @Post('digital-account')
  async createDigitalAccount(
    @Body() accountData: CreateDigitalAccountDTO,
    @Query('token') token?: string,
  ) {
    return this.paymentsService.createDigitalAccount(accountData, token);
  }

  @Patch('digital-account')
  async updateDigitalAccount(
    @Body() accountData: UpdateDigitalAccountDTO,
    @Query('token') token?: string,
  ) {
    return this.paymentsService.updateDigitalAccount(accountData, token);
  }

  @Get('webhook')
  async getPartnerWebhook(@Query('token') token?: string) {
    return this.paymentsService.getPartnerWebhook(token);
  }

  @Post('webhook')
  async createPartnerWebhook(@Body() webhookData: CreateWebhookDTO) {
    return this.paymentsService.createPartnerWebhook(webhookData);
  }

  @Patch('webhook/:id')
  async updatePartnerWebhook(
    @Param('id') id: string,
    @Body() webhookData: UpdateWebhookDTO,
  ) {
    return this.paymentsService.updatePartnerWebhook({ id, ...webhookData });
  }

  @Delete('webhook/:id')
  @HttpCode(204)
  async deletePartnerWebhook(
    @Param('id') id: string,
    @Body() webhookData: DeleteWebhookDTO,
  ) {
    return this.paymentsService.deletePartnerWebhook({ id, ...webhookData });
  }

  @Post('webhooks/notifications/:id')
  @UseGuards(WebhookSignatureGuard)
  async webhookNotification(@Body() body: any, @Param('id') id: string) {
    console.log({ body, partner_id: id });
  }
}
