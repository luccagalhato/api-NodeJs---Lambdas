import { Inject } from "@nestjs/common";
import IToken from "../security/token.interface";

abstract class AbstractController {

    @Inject("IToken")
    protected jwtToken: IToken

    getValueByKeyInAccessTokenOfRequest(key: string, request) {
        return this.jwtToken.getValueByKeyInPayload(key, request.headers["authorization"]);
    }
}

export default AbstractController;