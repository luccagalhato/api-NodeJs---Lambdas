import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AppTypeEnum } from '../../../shared/enums';
import { User } from '../../../shared/interfaces';

export function handlerAppType(appType: AppTypeEnum): CognitoUserPool {
  const userPoolId: string = process.env[`${appType}_USER_POOL_ID`];
  const clientId: string = process.env[`${appType}_CLIENT_ID`];

  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId
  })
}

export function cognitoUserInstance(user: User): CognitoUser {
  const userData = {
    Username: user.email,
    Pool: this.handlerAppType(user.appType),
  };

  return new CognitoUser(userData);
}