import { AxiosRequestConfig } from 'axios';
import { ReadStream } from 'fs';
import * as FormData from 'form-data';
import { Config } from '../config';
import { AuthResource } from './auth';
import { ResourceRequester } from './resource-requester';
import { Client } from '../http/client';

export interface ResourceConstructor {
  junoClient: Client;
  token: string;
  publicToken: string;
  authResource: AuthResource;
  oAuthToken: string;
}

export abstract class Resource {
  /**
   * @var @juno/ResourceRequester
   */
  public resourceRequester: ResourceRequester;

  protected readonly junoClient: Client;
  protected readonly token: string;
  private authResource: AuthResource;

  constructor({
    junoClient,
    token,
    authResource,
    oAuthToken,
  }: ResourceConstructor) {
    this.junoClient = junoClient;
    this.token = token;
    this.authResource = authResource;

    Config.setBearerToken(oAuthToken);

    this.resourceRequester = new ResourceRequester(this.junoClient);
  }

  private async getRequestConfig(
    token: string,
    headers: Record<string, string> = {},
  ): Promise<AxiosRequestConfig> {
    const accessToken = await this.authResource.getOAuthToken();

    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        'X-Resource-Token': token || Config.getPrivateToken(),
        'X-Api-Version': '2',
        'Content-Type': 'application/json',
      },
    };
  }

  public abstract endpoint(): string;

  public url(id = null, action = null) {
    let endpoint = this.endpoint();

    if (!endpoint) {
      throw new Error('endpoint not defined.');
    }

    if (id) {
      endpoint = `${endpoint}/${id}`;
    }

    if (action) {
      endpoint = `${endpoint}/${action}`;
    }

    return endpoint;
  }

  /**
   * Create a new resource.
   *
   * @param formParams The request body.
   *
   * @return mixed
   */
  protected async create<T>(formParams = {}, token?: string) {
    return this.resourceRequester.request<T>(
      'post',
      this.url(),
      formParams,
      await this.getRequestConfig(token),
    );
  }

  /**
   * Retrieve all resources.
   *
   * @param params Pagination and Filter parameters.
   *
   * @return mixed
   */
  protected async allByQuery<T>(params = {}, token?: string) {
    return this.resourceRequester.request<T>('get', this.url(), {
      ...params,
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Retrieve all resources with no params required.
   *
   * @return mixed
   */
  protected async all<T>(token: string) {
    return this.resourceRequester.request<T>('get', this.url(), {
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Retrieve a specific resource.
   *
   * @param id The resource's id.
   *
   * @return mixed
   */
  protected async retrieve<T>(token: string, id = null) {
    return this.resourceRequester.request<T>('get', this.url(id), {
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Update a specific resource by using patch.
   *
   * @param id The resource's id.
   * @param formParams The request body.
   *
   * @return mixed
   */
  protected async updateSome<T>(
    formParams = {},
    token?: string,
    id = null,
    action = null,
  ) {
    return this.resourceRequester.request<T>(
      'patch',
      this.url(id, action),
      formParams,
      await this.getRequestConfig(token),
    );
  }

  /**
   * Update a specific resource.
   *
   * @param id The resource's id.
   * @param formParams The request body.
   *
   * @return mixed
   */
  protected async update<T>(
    formParams = {},
    token?: string,
    id = null,
    action = null,
  ) {
    return this.resourceRequester.request<T>(
      'put',
      this.url(id, action),
      formParams,
      await this.getRequestConfig(token),
    );
  }

  /**
   * Delete a specific resource.
   *
   * @param id The resource's id.
   * @param formParams The request body.
   *
   * @return mixed
   */
  protected async delete<T>(
    id = null,
    action = null,
    formParams = {},
    token?: string,
  ) {
    return this.resourceRequester.request<T>('delete', this.url(id, action), {
      ...formParams,
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Make a get request to an additional endpoint for a specific resource.
   *
   * @param id The resource's id.
   * @param additionalEndpoint Additional endpoint that will be appended to the URL.
   *
   * @return mixed
   */
  protected async getById<T>(token: string, id = null, action = null) {
    return this.resourceRequester.request<T>('get', this.url(id, action), {
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Make a get request to an additional endpoint for a specific resource.
   *
   * @param additionalEndpoint Additional endpoint that will be appended to the URL.
   *
   * @return mixed
   */
  protected async get<T>(token?: string, action = null) {
    return this.resourceRequester.request<T>('get', this.url(action), {
      ...(await this.getRequestConfig(token)),
    });
  }

  /**
   * Make a post request to an additional endpoint for a specific resource.
   *
   * @param id The resource's id.
   * @param additionalEndpoint Additional endpoint that will be appended to the URL.
   * @param formParams The request body.
   *
   * @return mixed
   */
  protected async post<T>(
    id = null,
    action = null,
    formParams = {},
    token: string,
  ) {
    return this.resourceRequester.request<T>(
      'post',
      this.url(id, action),
      formParams,
      await this.getRequestConfig(token),
    );
  }

  protected async postFormData<T>(
    id = null,
    action = null,
    readStreams: ReadStream[],
    token?: string,
  ): Promise<T> {
    const form = new FormData();
    readStreams.forEach(readStream => form.append('files', readStream));

    return this.resourceRequester.request<T>(
      'post',
      this.url(id, action),
      form,
      await this.getRequestConfig(token, form.getHeaders()),
    );
  }

  public getInstance() {
    return this;
  }
}
