import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import Crypto from 'crypto';

import { partnerModel } from '../models';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const junoSignature = request.headers['X-Signature'];
    const eventContent = request.body;
    const partnerId = request.params.id;

    const partner = await partnerModel.get({ id: partnerId });

    const secret = partner.payment_info.webhook.secret;

    const crypto = Crypto.createHmac('SHA-256', secret);
    const todoSignature = crypto.update(eventContent).digest('hex');

    if (junoSignature !== todoSignature) {
      return false;
    }

    return true;
  }
}
