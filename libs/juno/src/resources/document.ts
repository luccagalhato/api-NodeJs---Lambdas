import { ReadStream } from 'fs';
import { GetListResponse } from '../responses';
import { Resource } from './resource';

export class DocumentResource extends Resource {
  public endpoint(): string {
    return 'documents';
  }

  public getDocument(token?: string) {
    return this.all<GetListResponse<{ documents: Document[] }>>(token);
  }

  public getDocumentById(id: string, token?: string) {
    return this.getById<Document>(id, token);
  }

  public uploadDocument(id: string, readStreams: ReadStream[], token: string) {
    return this.postFormData<Document>(id, 'files', readStreams, token);
  }
}
