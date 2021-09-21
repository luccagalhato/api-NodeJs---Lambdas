import { Resource } from './resource';

export class PixResource extends Resource {
  public endpoint(): string {
    return 'pix';
  }

  public createRandomKey(id = null, formParams = {}, token?: string) {
    return this.post(id, 'keys', formParams, token);
  }

  public createStaticQRCode(id = null, formParams = {}, token?: string) {
    return this.post(id, 'qrcodes/static', formParams, token);
  }
}
