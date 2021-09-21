import  { HttpClientHelper } from "../helpers/http-client.helper";
import IToken from './token.interface';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { Inject } from '@nestjs/common';

export default class JwtToken implements IToken {

    constructor(@Inject('HttpClient') private httpClient: HttpClientHelper) { }

    async isValid(token: string, poolRegion: string, poolUserId: string): Promise<boolean> {
        try {
            const data = await this.httpClient
                .get(`https://cognito-idp.${poolRegion}.amazonaws.com/${poolUserId}/.well-known/jwks.json`)
            const keys = data["keys"];
            const pems = {};

            for (let i = 0; i < keys.length; i++) {
                const key_id = keys[i].kid;
                const modulus = keys[i].n;
                const exponent = keys[i].e;
                const key_type = keys[i].kty;
                const jwk = { kty: key_type, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }

            const decodedJwt = jwt.decode(token, { complete: true });
            if (!decodedJwt) {
                return false;
            }

            const kid = decodedJwt.header.kid;
            const pem = pems[kid];
            if (!pem) {
                return false;
            }

            await jwt.verify(token, pem);
            return true;
        } catch (error) {
            return false;
        }
    }

    isValidPattern(token: string): boolean {
        const regex = /([0-9a-zA-Z]){1,}\.([0-9a-zA-Z]){1,}\.([0-9a-zA-Z]){1,}/;
        return regex.test(token);
    }

    getValueByKeyInPayload(key: string, token: string) {
        if (!this.isValidPattern(token)) {
            return null;
        }
        let payload: string[] | string = token.split(".");
        payload = Buffer.from(payload[1], 'base64').toString();
        payload = JSON.parse(payload);
        return payload[key] || null;
    }

    getTimeExpiration(token: string) {
        let timeExpiration = this.getValueByKeyInPayload('exp', token);
        timeExpiration = timeExpiration * 1000 - Date.now();
        timeExpiration = timeExpiration / 1000;
        timeExpiration = Math.ceil(timeExpiration);
        return timeExpiration;
    }

}