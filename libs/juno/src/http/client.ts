import apisauce, { ApisauceConfig } from 'apisauce';
import { AxiosInstance } from 'axios';

import { JunoError } from '../errors';

export class Client {
  request: AxiosInstance;
  constructor(config: ApisauceConfig) {
    try {
      this.request = apisauce.create(config).axiosInstance;
    } catch (err) {
      if (err.response) {
        throw new JunoError(err.response.data.message, err.response.data);
      }
      throw err;
    }
  }
}
