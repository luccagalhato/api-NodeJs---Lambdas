import { Injectable } from '@nestjs/common';
import { format as formatStr } from 'util';

import { JunoConfig } from './config';
import {
  JUNO_API_AUTH_URLS,
  JUNO_API_BASE_URLS,
  JUNO_CLIENT_ID,
  JUNO_ENV,
  JUNO_SECRET,
  JUNO_TOKEN,
  JUNO_PUBLIC_TOKEN,
  JunoEnvironments,
} from './constants';
import { JunoEnvironmentError } from './errors';
import { Client } from './http/client';
import {
  AuthResource,
  BalanceResource,
  CardHashResource,
  ChargeResource,
  DataResource,
  DigitalAccountResource,
  NotificationsResource,
  TransfersResource,
  PaymentResource,
  CreditCardResource,
  NewOnboardingResource,
  PicPayResource,
  PixResource,
  PlanResource,
  SubscriptionResource,
} from './resources';
import { DocumentResource } from './resources/document';
import { ResourceConstructor } from './resources/resource';

@Injectable()
export class JunoService {
  private readonly balance: BalanceResource;
  private readonly cardHash: CardHashResource;
  private readonly charge: ChargeResource;
  private readonly creditCard: CreditCardResource;
  private readonly data: DataResource;
  private readonly digitalAccount: DigitalAccountResource;
  private readonly document: DocumentResource;
  private readonly newOnboarding: NewOnboardingResource;
  private readonly notifications: NotificationsResource;
  private readonly payment: PaymentResource;
  private readonly picPay: PicPayResource;
  private readonly pix: PixResource;
  private readonly plan: PlanResource;
  private readonly subscription: SubscriptionResource;
  private readonly transfer: TransfersResource;

  constructor(config: JunoConfig) {
    const {
      environment,
      clientId,
      secret,
      token,
      publicToken,
      oAuthToken,
      updateOAuthToken,
    } = JunoService.mergeConfigWithEnvironment(config);

    const junoAuthClient = JunoService.createJunoAuthClient(environment);
    const junoClient = JunoService.createJunoClient(environment);

    const authResource = new AuthResource({
      junoAuthClient,
      clientId,
      secret,
      oAuthToken,
      updateOAuthToken,
    });

    const resourceConstructor: ResourceConstructor = {
      junoClient,
      token,
      authResource,
      oAuthToken,
      publicToken,
    };

    this.balance = new BalanceResource(resourceConstructor);
    this.charge = new ChargeResource(resourceConstructor);
    this.cardHash = new CardHashResource(resourceConstructor);
    this.creditCard = new CreditCardResource(resourceConstructor);
    this.data = new DataResource(resourceConstructor);
    this.digitalAccount = new DigitalAccountResource(resourceConstructor);
    this.document = new DocumentResource(resourceConstructor);
    this.notifications = new NotificationsResource(resourceConstructor);
    this.newOnboarding = new NewOnboardingResource(resourceConstructor);
    this.payment = new PaymentResource(resourceConstructor);
    this.picPay = new PicPayResource(resourceConstructor);
    this.pix = new PixResource(resourceConstructor);
    this.plan = new PlanResource(resourceConstructor);
    this.subscription = new SubscriptionResource(resourceConstructor);
    this.transfer = new TransfersResource(resourceConstructor);
  }

  private static mergeConfigWithEnvironment(config: JunoConfig) {
    const configWithEnv = {
      token: JUNO_TOKEN,
      publicToken: JUNO_PUBLIC_TOKEN,
      clientId: JUNO_CLIENT_ID,
      secret: JUNO_SECRET,
      environment: JUNO_ENV,
      ...config,
    };

    JunoService.validateEnvironment(configWithEnv);

    return configWithEnv;
  }

  private static createJunoClient(environment: JunoEnvironments) {
    return new Client({
      baseURL: JunoService.setEndpoint(environment),
    });
  }

  private static createJunoAuthClient(environment: JunoEnvironments) {
    return new Client({
      baseURL: JunoService.setAuthEndpoint(environment),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private static validateEnvironment({
    token,
    publicToken,
    clientId,
    secret,
    environment,
  }: JunoConfig) {
    if (!token || typeof token !== 'string') {
      throw new JunoEnvironmentError(
        `JUNO_TOKEN environment variable is invalid (${token}).`,
      );
    }

    if (!publicToken || typeof publicToken !== 'string') {
      throw new JunoEnvironmentError(
        `JUNO_PUBLIC_TOKEN environment variable is invalid (${publicToken}).`,
      );
    }

    if (!clientId || typeof clientId !== 'string') {
      throw new JunoEnvironmentError(
        `JUNO_CLIENT_ID environment variable is invalid (${clientId}).`,
      );
    }

    if (!secret || typeof secret !== 'string') {
      throw new JunoEnvironmentError(
        `JUNO_SECRET environment variable is invalid (${secret}).`,
      );
    }

    const values = Object.values(JunoEnvironments);

    if (!environment || !values.includes(environment)) {
      const message =
        'JUNO_ENV environment variable is invalid (%s), it must be either (%s).';
      throw new JunoEnvironmentError(
        formatStr(message, environment, values.join('|')),
      );
    }
  }

  private static setAuthEndpoint(environment: JunoEnvironments) {
    if (!Object.values(JunoEnvironments).includes(environment)) {
      throw new JunoEnvironmentError('Invalid JUNO_ENV.');
    }

    return JUNO_API_AUTH_URLS[environment];
  }

  private static setEndpoint(environment: JunoEnvironments) {
    if (!Object.values(JunoEnvironments).includes(environment)) {
      throw new JunoEnvironmentError('Invalid JUNO_ENV.');
    }

    return JUNO_API_BASE_URLS[environment];
  }

  public getBalanceService() {
    return this.balance;
  }

  public getCardHashService() {
    return this.cardHash;
  }

  public getChargeService() {
    return this.charge;
  }

  public getCreditCardService() {
    return this.creditCard;
  }

  public getDataService() {
    return this.data;
  }

  public getDigitalAccountsService() {
    return this.digitalAccount;
  }

  public getDocumentService() {
    return this.document;
  }

  public getNewOnboardingService() {
    return this.newOnboarding;
  }

  public getPaymentService() {
    return this.payment;
  }

  public getPicPayService() {
    return this.picPay;
  }

  public getPixService() {
    return this.pix;
  }

  public getPlanService() {
    return this.plan;
  }

  public getSubscriptionService() {
    return this.subscription;
  }

  public getTransferService() {
    return this.transfer;
  }

  public getNotificationsService() {
    return this.notifications;
  }
}
