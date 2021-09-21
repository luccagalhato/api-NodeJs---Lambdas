import { AxiosInstance } from 'axios';
import * as jwt from 'jsonwebtoken';
import { JunoError } from '../errors';
import { GenerateOauthTokenResponse } from '../inputs';
import { RequestHelper } from '../helpers';
import { Config } from '../config';
import { Client } from '../http/client';

interface AuthResourceConstructor {
  junoAuthClient: Client;
  clientId: string;
  secret: string;
  oAuthToken: string;
  updateOAuthToken(token: string): Promise<void>;
}

export class AuthResource {
  private readonly basicToken: string;
  private oAuthTokenData: GenerateOauthTokenResponse;
  private junoClient: AxiosInstance;
  private oAuthToken: string;
  private updateOAuthToken: any;

  constructor({
    junoAuthClient,
    clientId,
    secret,
    oAuthToken,
    updateOAuthToken,
  }: AuthResourceConstructor) {
    this.junoClient = junoAuthClient.request;
    this.basicToken = Buffer.from(`${clientId}:${secret}`).toString('base64');
    this.oAuthToken = oAuthToken;
    this.updateOAuthToken = updateOAuthToken;
  }

  private async doRequest<T>(endpoint: string, payload: any): Promise<T> {
    try {
      const encodedPayload = RequestHelper.toEncodedUrlFormat(payload);
      const { data } = await this.junoClient.post(endpoint, encodedPayload, {
        baseURL: Config.getAuthUrl(),
        headers: {
          Authorization: `Basic ${this.basicToken}`,
        },
      });

      return data;
    } catch (err) {
      if (err.response) {
        throw new JunoError(err.response.data.message, err.response.data);
      }
      throw err;
    }
  }

  private async generateOAuthToken() {
    this.oAuthTokenData = await this.doRequest<GenerateOauthTokenResponse>(
      '/oauth/token',
      {
        grant_type: 'client_credentials',
      },
    );

    this.oAuthToken = this.oAuthTokenData.access_token;
    Config.setBearerToken(this.oAuthToken);
    this.updateOAuthToken(this.oAuthToken);
    return this.oAuthToken;
  }

  private async refreshOAuthToken() {
    try {
      const decoded = jwt.decode(this.oAuthToken) as Record<string, any>;
      const currentTime = Date.now() / 1000;

      if (decoded?.exp < currentTime) {
        return this.generateOAuthToken();
      }

      return this.oAuthToken;
    } catch (err) {
      return this.generateOAuthToken();
    }
  }

  public async getOAuthToken() {
    if (!this.oAuthToken) {
      return this.generateOAuthToken();
    }

    return this.refreshOAuthToken();
  }
}
