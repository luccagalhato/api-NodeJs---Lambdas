import { Resource } from './resource';

export class SubscriptionResource extends Resource {
  public endpoint(): string {
    return 'subscriptions';
  }

  public createSubscription(formParams = {}) {
    return this.create(formParams);
  }

  public simulation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'simulation', formParams, token);
  }

  public activation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'activation', formParams, token);
  }

  public deactivation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'deactivation', formParams, token);
  }

  public cancelation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'cancelation', formParams, token);
  }

  public completion(id: string, formParams = {}, token?: string) {
    return this.post(id, 'completion', formParams, token);
  }

  public getSubscription(id: string) {
    return this.retrieve(id);
  }

  public getSubscriptions(token?: string) {
    return this.all(token);
  }
}
