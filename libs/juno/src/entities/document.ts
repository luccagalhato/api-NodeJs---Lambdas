import { JunoEntity } from './entity';
import { DocumentApprovalStatus, DocumentsTypesLegalPerson, DocumentTypesPrivatePerson } from '../enums';

export interface Document extends JunoEntity {
  type: DocumentsTypesLegalPerson | DocumentTypesPrivatePerson;
  description: string;
  approvalStatus: DocumentApprovalStatus;
}