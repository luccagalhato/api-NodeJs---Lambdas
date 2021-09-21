import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JunoService } from '../../../libs/juno/src';
import {
  CreateChargeInput,
  CreateWebhookInput,
  UpdateWebhookInput,
  DeleteWebhookInput,
  UpdateChargeSplitInput,
  PaymentInput,
  RefundInput,
  CapturePaymentInput,
  CreateTransferInput,
  CreatePaymentAccountInput,
  CreateReceivingAccountInput,
  UpdateDigitalAccountInput,
} from '../../../libs/juno/src/inputs';
import IToken from '../../shared/security/token.interface';
import { GetChargesInput } from '../../../libs/juno/src/responses';
import { updatePaymentCreditCard } from '../services/apisauce.client';
import { TokenizationCardData } from '../../shared/interfaces/payment.interface';
import decrypt from '../../shared/helpers/decrypt-card';

@Injectable()
export class PaymentsService {
  private readonly junoService: JunoService;
  constructor(
    @Inject('IToken') private readonly jwtToken: IToken,
    @Inject('JUNO') junoService: JunoService,
  ) {
    this.junoService = junoService;
  }

  async creditCardHash(encryptedCard: string) {
    const junoCardHashService = this.junoService.getCardHashService();

    const key = process.env.ENCRYPT_CARD_DATA_KEY;
    const ivKey = key.substring(0, 16);
    const decrypted = decrypt('aes256', key, ivKey, encryptedCard, 'hex');

    const cardData = JSON.parse(decrypted);
    const cardHash = await junoCardHashService.getCardHash(cardData);

    return cardHash;
  }

  async creditCardTokenization({
    id,
    cardHash,
    accessToken,
    idToken,
  }: TokenizationCardData) {
    const junoCreditCardService = this.junoService.getCreditCardService();
    const cardToken = await junoCreditCardService.tokenizeCard({
      creditCardHash: cardHash,
    });

    if (cardToken) {
      return updatePaymentCreditCard(id, cardToken, accessToken, idToken);
    }

    throw new HttpException('Invalid CreditCard Hash', 400);
  }

  async createCharge(chargeData: CreateChargeInput, token?: string) {
    const junoChargeService = this.junoService.getChargeService();
    const charge = await junoChargeService.createCharge(chargeData, token);

    return charge;
  }

  async listCharges(filters?: GetChargesInput, token?: string) {
    const junoChargeService = this.junoService.getChargeService();
    const charges = await junoChargeService.getCharges(filters, token);

    return charges;
  }

  async getChargeById(id: string, token: string) {
    const junoChargeService = this.junoService.getChargeService();
    const charge = await junoChargeService.getChargeById(id, token);

    return charge;
  }

  async updateChargeSplit(
    id: string,
    chargeSplitData: Partial<UpdateChargeSplitInput>,
    token: string,
  ) {
    const junoChargeService = this.junoService.getChargeService();
    const charge = await junoChargeService.updateChargeSplit(
      id,
      chargeSplitData,
      token,
    );

    return charge;
  }

  async cancelCharge(id: string, token: string) {
    const junoChargeService = this.junoService.getChargeService();
    return junoChargeService.cancelCharge(id, token);
  }

  async createPaymentToCharge(paymentData: PaymentInput) {
    const junoPaymentService = this.junoService.getPaymentService();
    const payment = await junoPaymentService.createPayment(paymentData);

    return payment;
  }

  async capturePayment(id: string, paymentData: Partial<CapturePaymentInput>) {
    const junoPaymentService = this.junoService.getPaymentService();
    const payment = await junoPaymentService.capture(id, paymentData);

    return payment;
  }

  async refundPayment(id: string, paymentData: Partial<RefundInput>) {
    const junoPaymentService = this.junoService.getPaymentService();
    const payment = await junoPaymentService.refunds(id, paymentData);

    return payment;
  }

  async createTransfer(transferData: CreateTransferInput) {
    const junoTransferService = this.junoService.getTransferService();
    const transfer = await junoTransferService.createTransfer(transferData);

    return transfer;
  }

  async checkBalance(token: string) {
    const junoBalanceService = this.junoService.getBalanceService();
    const balance = await junoBalanceService.getBalance(token);

    return balance;
  }

  async createDigitalAccount(
    accountData: CreatePaymentAccountInput | CreateReceivingAccountInput,
    token: string,
  ) {
    const junoDigitalAccountService = this.junoService.getDigitalAccountsService();
    const account = await junoDigitalAccountService.createDigitalAccount(
      accountData,
      token,
    );

    return account;
  }

  async getDigitalAccount(token: string) {
    const junoDigitalAccountService = this.junoService.getDigitalAccountsService();
    const account = await junoDigitalAccountService.retrieveDigitalAccount(
      token,
    );

    return account;
  }

  async updateDigitalAccount(
    accountData: UpdateDigitalAccountInput,
    token: string,
  ) {
    const junoDigitalAccountService = this.junoService.getDigitalAccountsService();
    const account = await junoDigitalAccountService.updateDigitalAccount(
      accountData,
      token,
    );

    return account;
  }

  async getPartnerWebhook(data: string) {
    const junoNotificationsService = this.junoService.getNotificationsService();
    return junoNotificationsService.getWebhooks(data);
  }

  async createPartnerWebhook(data: CreateWebhookInput) {
    const junoNotificationsService = this.junoService.getNotificationsService();
    const webhook = await junoNotificationsService.createWebhook(data);

    return webhook;
  }

  async updatePartnerWebhook(data: UpdateWebhookInput) {
    const junoNotificationsService = this.junoService.getNotificationsService();
    const webhook = await junoNotificationsService.updateWebhook(data);

    return webhook;
  }

  async deletePartnerWebhook(data: DeleteWebhookInput) {
    const junoNotificationsService = this.junoService.getNotificationsService();
    return junoNotificationsService.removeWebhook(data);
  }
}
