import { Resource } from './resource';

export class PlanResource extends Resource {
  public endpoint(): string {
    return 'plans';
  }

  public createPlan(formParams = {}) {
    return this.create(formParams);
  }

  public activation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'activation', formParams, token);
  }

  public deactivation(id: string, formParams = {}, token?: string) {
    return this.post(id, 'deactivation', formParams, token);
  }

  public getPlan(id: string) {
    return this.retrieve(id);
  }

  public getPlans(token?: string) {
    return this.all(token);
  }
}
