import {
  JUNO_API_BASE_URLS,
  JUNO_API_AUTH_URLS,
  JUNO_TOKEN,
  JUNO_CLIENT_ID,
  JUNO_SECRET,
  JUNO_ENV,
  JunoEnvironments,
} from '../constants';

export interface JunoConfig {
  /**
   * Juno integration token
   * @example used at X-Resource-Token header
   */
  token?: string;

  /**
   * Juno integration public token
   * @example used at CreateCardHash
   */
  publicToken?: string;

  /**
   * Juno ClientId
   */
  clientId?: string;

  /**
   * Juno Secret
   */
  secret?: string;

  /**
   * Enable requests to Sandbox
   */
  environment?: JunoEnvironments;

  /**
   * Juno OAuth Token
   * @example used at Bearer Authentication
   */
  oAuthToken: string;

  /**
   *
   * @param newOAuthToken function to update oAuthToken on Database
   */
  updateOAuthToken(newOAuthToken: string): Promise<any>;
}

export class Config {
  private static bearerToken: string;

  /**
   *
   * @param token string
   */
  public static setBearerToken(token: string) {
    if (!this.bearerToken) {
      this.bearerToken = token;
    }
  }

  /**
   *
   * @returns mixed
   */
  public static getAuthUrl() {
    return JUNO_API_AUTH_URLS[JUNO_ENV];
  }

  /**
   *
   * @returns mixed
   */
  public static getResourceUrl() {
    return JUNO_API_BASE_URLS[JUNO_ENV];
  }

  /**
   * Juno integration token
   * @example used at X-Resource-Token header
   */
  public static getPrivateToken() {
    return JUNO_TOKEN;
  }

  /**
   * Juno ClientId
   */
  public static getClientId() {
    return JUNO_CLIENT_ID;
  }

  /**
   * Juno Secret
   */
  public static getClientSecret() {
    return JUNO_SECRET;
  }

  /**
   * Enable requests to Sandbox
   */
  public static getEnvironment() {
    return JUNO_ENV;
  }

  /**
   *
   * @returns string
   */
  public static getBearerToken() {
    if (this.bearerToken) {
      return this.bearerToken;
    }
  }
}
