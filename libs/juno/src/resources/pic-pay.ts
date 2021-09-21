import { Resource } from './resource';

export class PicPayResource extends Resource {
  public endpoint(): string {
    return 'qrcode';
  }

  public createQRCode(formParams = {}, token?: string) {
    return this.create(formParams, token);
  }

  public cancelQRCode(id: string, formParams = {}, token?: string) {
    return this.post(id, 'cancel', formParams, token);
  }
}
