import { Bank } from '../entities/bank';
import { Resource } from './resource';
import { GetListResponse } from '../responses';

export class DataResource extends Resource {
  public endpoint(): string {
    return 'data';
  }

  public getBanks() {
    return this.get<GetListResponse<{ banks: Bank[] }>>('banks');
  }

  public getCompanyTypes() {
    return this.get('company-types');
  }

  public getBusinessAreas() {
    return this.get('business-areas');
  }
}
