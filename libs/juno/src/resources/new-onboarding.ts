import { Resource } from './resource';

export class NewOnboardingResource extends Resource {
  public endpoint(): string {
    return 'onboarding/link-request';
  }

  public createOnboardingWhiteLabel(formParams = {}) {
    return this.create(formParams);
  }
}
