import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import IToken from "./token.interface";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject("IToken") private token: IToken
  ) {}

  async canActivate(context: ExecutionContext) {
    return await this.isUserAuthorizated(context);
  }

  private async isUserAuthorizated(context): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken: string = request.headers["authorization"];
    const idToken: string = request.headers["idtoken"];

    // const isMencionatedAccessToken = accessToken != null || accessToken != undefined;
    // const isMencionatedIdToken = idToken != null || idToken != undefined;
    if (!accessToken || !idToken) {
      return false;
    }

    accessToken = accessToken.replace("Bearer", "").trim();
    const idCognitoUser = this.token.getValueByKeyInPayload(
      "username",
      accessToken
    );
    if (!idCognitoUser) {
      return false;
    }

    const userProfile = this.token.getValueByKeyInPayload("profile", idToken);
    const poolId = process.env[`${userProfile}_POOL_ID`];
    const isValidToken = await this.token.isValid(
      accessToken,
      process.env.REGION,
      poolId
    );
    if (!isValidToken) {
      return false;
    }

    const profilesAllowed = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    );
    return profilesAllowed.indexOf(userProfile) >= 0;
  }
}
