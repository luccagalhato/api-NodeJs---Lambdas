import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';

@Module({
  imports: [CognitoService],
  providers: [CognitoService],
  exports: [CognitoService]
})
export class CognitoModule { }
