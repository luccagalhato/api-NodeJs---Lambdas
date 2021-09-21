import { AxiosRequestConfig, Method } from 'axios';
import { JunoError } from '../errors';
import { Client } from '../http/client';

export class ResourceRequester {
  /**
   * @var @juno/Client
   */
  public client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * @param method HTTP Method.
   * @param url Relative to API base path.
   * @param options Options for the request.
   *
   * @return mixed
   */
  public async request<T>(
    method: Method,
    url: string,
    data?: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.request[method]<T>(url, data, options);
      return response.data;
    } catch (err) {
      if (err.response) {
        const message = err.response.data.details
          ? err.response.data.details.map((detail: any) => `${detail.message}`)
          : err.data;

        throw new JunoError(message, err.response.data);
      }
      throw err;
    }
  }
}
