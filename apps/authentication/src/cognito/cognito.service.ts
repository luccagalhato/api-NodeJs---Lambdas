import { HttpException } from "@nestjs/common";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
// import { createCollaborator } from '../../config/apisauce.collaborator';
import Role from "../../../shared/security/role.model";
import { AppTypeEnum } from "../../../shared/enums";
import { User } from "../../../shared/interfaces";
import { createClient } from "../../config/apisauce.client";
import { createCollaborator } from "../../../authentication/config/apisauce.collaborator";

function handlerAppType(appType: AppTypeEnum): CognitoUserPool {
  const userPoolId: string = process.env[`${appType}_POOL_ID`];
  const clientId: string = process.env[`${appType}_CLIENT_ID`];

  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  });
}

export class CognitoService {
  cognitoUserInstance(user: User): CognitoUser {
    const userData = {
      Username: user.email,
      Pool: handlerAppType(user.appType as AppTypeEnum),
    };

    return new CognitoUser(userData);
  }

  async resendConfirmationCode(user: User) {
    const cognitoUser = this.cognitoUserInstance(user);
    return cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        throw new HttpException("codigo não enviado!", 500);
      }
      return result;
    });
  }

  async deleteUser(user: User) {
    const cognitoUser = this.cognitoUserInstance(user);
    return await cognitoUser.deleteUser((err, result) => {
      if (err) {
        console.log(err);
        throw new HttpException("Cognito user não deletado!", 500);
      }
      return result;
    });
  }

  registerUser({
    email,
    password,
    phone_number,
    appType,
  }: User): Promise<CognitoUser> {
    const emailAttribute = new CognitoUserAttribute({
      Name: "email",
      Value: email,
    });
    const phoneAttribute = new CognitoUserAttribute({
      Name: "phone_number",
      Value: phone_number,
    });
    const profileAttribute = new CognitoUserAttribute({
      Name: "profile",
      Value: appType as string,
    });

    const userPool = handlerAppType(appType as AppTypeEnum);
    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [emailAttribute, phoneAttribute, profileAttribute],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.user);
          }
        }
      );
    });
  }

  async authenticateUser(user: User): Promise<CognitoUserSession> {
    const authenticationDetails = new AuthenticationDetails({
      Username: user.email,
      Password: user.password,
    });

    const newUser = this.cognitoUserInstance(user);

    return new Promise((resolve, reject) => {
      newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async confirmRegistration(user: User, code: string): Promise<any> {
    const cognitoUser = this.cognitoUserInstance(user);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async confirmRegistrationGettingLeed(user: User, code: string): Promise<any> {
    try {
      await this.confirmRegistration(user, code);
      const authUser = await this.authenticateUser(user);

      if (user.appType === Role.USER) {
        const client = await createClient(
          user,
          authUser.getAccessToken().getJwtToken(),
          authUser.getIdToken().getJwtToken()
        );
        return { ...authUser, client };
      } else if (user.appType === Role.COLLABORATOR) {
        const collaborator = await createCollaborator(
          user,
          authUser.getAccessToken().getJwtToken(),
          authUser.getIdToken().getJwtToken()
        );
        return { ...authUser, collaborator };
      } else if (user.appType === Role.PARTNER) {
        //
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error, 500);
    }
  }
}
