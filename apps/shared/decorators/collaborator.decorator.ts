
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as rawbody from 'raw-body';

export const PlainBody = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const raw = await rawbody(request);
    const body = JSON.parse(raw.toString().trim());
    return body
  },
);