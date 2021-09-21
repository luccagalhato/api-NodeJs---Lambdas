import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import IToken from "../../shared/security/token.interface";
import { EmailResponse, User } from "../../shared/interfaces";
import { CognitoService } from "./cognito/cognito.service";
import { getClient } from "../config/apisauce.client";
import Role from "../../shared/security/role.model";
import { getDeliveryMan } from "../config/apisauce.collaborator";
import { createPartner, getPartner } from "../config/apisauce.partner";
import { CognitoUser, CognitoRefreshToken } from "amazon-cognito-identity-js";
import validate from "deep-email-validator";

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject("IToken") private readonly jwtToken: IToken,
    private readonly cognitoService: CognitoService
  ) {}

  async userAuthentication(credentials: User): Promise<any> {
    try {
      const user = await this.cognitoService.authenticateUser(credentials);
      return user;
    } catch (error) {
      if (error.code === "UserNotConfirmedException") {
        throw new HttpException(error, 200);
      }
      throw new HttpException(error, 200);
    }
  }

  async checkUserAuthenticationSignin(user: User): Promise<HttpException> {
    const authUser = await this.userAuthentication(user);
    const id = authUser.accessToken.payload.username;
    let problem;
    if (user.appType === Role.COLLABORATOR) {
      const { ok, data: deliveryMan, ...response } = await getDeliveryMan(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (ok) {
        throw new HttpException(
          {
            deliveryMan,
            id: id,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
            refreshToken: authUser.refreshToken.token,
          },
          201
        );
      }
    } else if (user.appType === Role.USER) {
      const { ok, data: client, ...response } = await getClient(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (ok) {
        throw new HttpException(
          {
            client,
            id: id,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
            refreshToken: authUser.refreshToken.token,
          },
          201
        );
      }
    } else if (user.appType === Role.PARTNER) {
      const { ok, data: partner, ...response } = await getPartner(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (problem === "SERVER_ERROR") {
        const userRegistered = await createPartner(
          user,
          authUser.accessToken.jwtToken,
          authUser.idToken.jwtToken
        );

        throw new HttpException(userRegistered, 403);
      }

      if (ok) {
        throw new HttpException(
          {
            partner,
            id: id,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
            refreshToken: authUser.refreshToken.token,
          },
          201
        );
      }
    }

    throw new HttpException(problem.originalError, problem.status);
  }

  async checkUserAuthentication(user: User): Promise<HttpException> {
    const authUser = await this.userAuthentication(user);
    const id = authUser.accessToken.payload.username;
    let problem;
    if (user.appType === Role.COLLABORATOR) {
      const { ok, data: deliveryMan, ...response } = await getDeliveryMan(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (ok) {
        throw new HttpException(
          {
            deliveryMan,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
          },
          403
        );
      }
    } else if (user.appType === Role.USER) {
      const { ok, data: client, ...response } = await getClient(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (ok) {
        throw new HttpException(
          {
            client,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
            refreshToken: authUser.refreshToken.token,
          },
          201
        );
      }
    } else if (user.appType === Role.PARTNER) {
      const { ok, data: partner, ...response } = await getPartner(
        id,
        authUser.accessToken.jwtToken,
        authUser.idToken.jwtToken
      );

      problem = response.problem;

      if (problem === "SERVER_ERROR") {
        const userRegistered = await createPartner(
          user,
          authUser.accessToken.jwtToken,
          authUser.idToken.jwtToken
        );

        throw new HttpException(userRegistered, 500);
      }

      if (ok) {
        throw new HttpException(
          {
            partner,
            accessToken: authUser.accessToken.jwtToken,
            idToken: authUser.idToken.jwtToken,
          },
          403
        );
      }
    }

    throw new HttpException(problem.originalError, problem.status);
  }

  async userRegistration(user: User): Promise<CognitoUser | HttpException> {
    try {
      await this.cognitoService.registerUser(user);
      return this.checkUserAuthentication(user);
    } catch (error) {
      console.log(error);
      if (error.code === "UsernameExistsException") {
        return this.checkUserAuthentication(user);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async confirmRegistration(user: User, code: string): Promise<any> {
    try {
      return await this.cognitoService.confirmRegistration(user, code);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async confirmRegistrationGetLeed(user: User, code: string): Promise<any> {
    try {
      const authUser = await this.cognitoService.confirmRegistrationGettingLeed(
        user,
        code
      );

      const id = authUser.accessToken.payload.username;

      if (user.appType === Role.USER) {
        return {
          id,
          client: authUser.client,
          refreshToken: authUser.refreshToken.token,
          accessToken: authUser.accessToken.jwtToken,
          idToken: authUser.idToken.jwtToken,
        };
      }

      if (user.appType === Role.COLLABORATOR) {
        return {
          id,
          deliveryMan: authUser.collaborator,
          refreshToken: authUser.refreshToken.token,
          accessToken: authUser.accessToken.jwtToken,
          idToken: authUser.idToken.jwtToken,
        };
      }

      return {
        id,
        refreshToken: authUser.refreshToken.token,
        accessToken: authUser.accessToken.jwtToken,
        idToken: authUser.idToken.jwtToken,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async removeCognitoUser(user: User) {
    return this.cognitoService.deleteUser(user);
  }

  async resendConfirmationCode(user: User) {
    return this.cognitoService.resendConfirmationCode(user);
  }

  async emailValidation(user: User): Promise<EmailResponse | HttpException> {
    try {
      let responseData: EmailResponse;
      if (await this.isValidEmailAddress(user.email)) {
        responseData = {
          isValidEmail: true,
        };
      } else {
        responseData = {
          isValidEmail: false,
        };
      }
      return responseData;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async isValidEmailAddress(email: string) {
    try {
      const validEmail = await validate(email);
      console.log(validEmail.valid);
      return validEmail.valid;
    } catch (error) {
      throw new InternalServerErrorException("Email address validation error");
    }
  }

  async refreshToken(user: User, refresh_token: string) {
    const cUser = this.cognitoService.cognitoUserInstance(user);
    const refreshToken = new CognitoRefreshToken({
      RefreshToken: refresh_token,
    });

    return new Promise((resolve, reject) => {
      cUser.refreshSession(refreshToken, function(err, session) {
        console.log(err, session);
        if (err) {
          reject(err);
        } else {
          resolve({
            accessToken: session.accessToken.jwtToken,
            idToken: session.idToken.jwtToken,
            refreshToken: session.refreshToken.token,
          });
        }
      });
    });
  }
}
