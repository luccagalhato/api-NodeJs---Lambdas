import { Controller, Post, Body, HttpException } from "@nestjs/common";
import { CognitoUser } from "amazon-cognito-identity-js";
import { AuthenticatedUser } from "../../shared/@types";
import { EmailResponse, User } from "../../shared/interfaces";
import { AuthenticationService } from "./authentication.service";

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("sign-in")
  async userAuthentication(
    @Body() user: User
  ): Promise<CognitoUser | HttpException> {
    return this.authenticationService.checkUserAuthenticationSignin(user);
  }

  @Post("sign-up")
  async userRegistration(@Body() user: User): Promise<CognitoUser | HttpException> {
    return await this.authenticationService.userRegistration(user);
  }

  @Post("confirm-sign-up")
  async confirmSignUp(
    @Body("user") user: User,
    @Body("code") code: string
  ): Promise<any> {
    return await this.authenticationService.confirmRegistration(user, code);
  }

  @Post("resend-code")
  async resendConfimationCode(@Body() user: User): Promise<any> {
    return await this.authenticationService.resendConfirmationCode(user);
  }

  @Post("delete")
  async remove(@Body() user: User): Promise<any> {
    return await this.authenticationService.removeCognitoUser(user);
  }

  @Post("confirm-sign-up-getting-leed")
  async confirmSignUpGettingLeed(
    @Body("user") user: User,
    @Body("code") code: string
  ): Promise<any> {
    return await this.authenticationService.confirmRegistrationGetLeed(
      user,
      code
    );
  }

  @Post("email")
  async emailRegistration(@Body() user: User): Promise<EmailResponse | HttpException> {
    return await this.authenticationService.emailValidation(user);
  }

  @Post("refresh-token")
  async refreshToken(
    @Body("user") user: User,
    @Body("refreshToken") refresh_token: string): Promise<any> {
      return await this.authenticationService.refreshToken(user, refresh_token);
  }
}
