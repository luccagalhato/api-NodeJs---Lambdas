import { AxiosInstance } from 'axios';
import * as crypto from 'isomorphic-webcrypto';
import { decode } from 'base-64';

import { JunoError } from '../errors';
import { Client } from '../http/client';
import { RequestHelper } from '../helpers/request';
import { JUNO_ENV } from '../constants';
import { CardData } from '../inputs';
import { CardHashResponse } from '../responses';

interface CardHashContructor {
  publicToken: string;
  junoClient: Client;
}

export class CardHashResource {
  private publicToken: string;
  private junoClient: AxiosInstance;
  private chars: string;

  constructor({ publicToken, junoClient }: CardHashContructor) {
    this.publicToken = publicToken;
    this.junoClient = junoClient.request;

    this.chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  }

  static getAlgorithm() {
    return { name: 'RSA-OAEP', hash: { name: 'SHA-256' } };
  }

  private async configureRequest<T = any>(uri: string) {
    const baseURL =
      'sandbox' === JUNO_ENV
        ? 'https://sandbox.boletobancario.com/boletofacil/integration/api'
        : 'https://www.boletobancario.com/boletofacil/integration/api';

    return this.junoClient.post<T>(`${baseURL}/${uri}`, undefined, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async getCardHash(cardData: CardData) {
    const publicKey = await this.fetchPublicKey();
    const encriptedPublicKey = await this.importKey(publicKey);

    const cardBuffer = this.stringToArrayBuffer(JSON.stringify(cardData));
    const encryptedCard = await this.encryptCardData(
      encriptedPublicKey,
      cardBuffer,
    );

    return await this.fetchCardHash(encryptedCard);
  }

  private async fetchPublicKey(): Promise<string> {
    const params = RequestHelper.toEncodedUrlFormat({
      publicToken: this.publicToken,
      version: '0.0.2',
    });

    try {
      const { data } = await this.configureRequest(`get-public-encryption-key.json?${params}`);

      return data.data;
    } catch (err) {
      if (err.response) {
        throw new JunoError(
          err.response.data.message ||
            'Erro ao gerar a chave pública na API de pagamentos',
          err.response.data,
        );
      }
      throw err;
    }
  }

  private async fetchCardHash(encryptedCard: string) {
    const params = RequestHelper.toEncodedUrlFormat({
      publicToken: this.publicToken,
      encryptedData: encryptedCard,
    });

    try {
      const { data } = await this.configureRequest<CardHashResponse>(
        `get-credit-card-hash.json?${params}`,
      );

      return data;
    } catch (err) {
      if (err.response) {
        throw new JunoError(
          err.response.data.message ||
            'Não foi possível gerar o hash do cartão',
          err.response.data,
        );
      }
      throw err;
    }
  }

  private async importKey(pemPublicKey: string): Promise<CryptoKey> {
    const algorithm = CardHashResource.getAlgorithm();

    const key = await crypto.subtle.importKey(
      'spki',
      this.pemToArrayBuffer(pemPublicKey),
      algorithm,
      false,
      ['encrypt'],
    );

    return key;
  }

  private async encryptCardData(
    publicKey: CryptoKey,
    encodedCardData: ArrayBuffer,
  ): Promise<string> {
    const algorithm = CardHashResource.getAlgorithm();
    const encrypted = await crypto.subtle.encrypt(
      algorithm,
      publicKey,
      encodedCardData,
    );

    return this.encodeAb(encrypted);
  }

  private removeLines(str: string) {
    return str.replace(/(\r\n|\n|\r)/gm, '');
  }

  private base64ToArrayBuffer(b64: string) {
    const byteString = decode(b64);
    const byteArray = this.stringToArrayBuffer(byteString);

    return byteArray;
  }

  private pemToArrayBuffer(pem: string) {
    const b64Lines = this.removeLines(pem);
    const b64Prefix = b64Lines.replace('-----BEGIN PUBLIC KEY-----', '');
    const b64Final = b64Prefix.replace('-----END PUBLIC KEY-----', '');
    return this.base64ToArrayBuffer(b64Final);
  }

  private stringToArrayBuffer(str: string) {
    const byteArray = new ArrayBuffer(str.length);
    const bufferArray = new Uint8Array(byteArray);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufferArray[i] = str.charCodeAt(i);
    }
    return byteArray;
  }

  private encodeAb(arrayBuffer: ArrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let i: number;
    let base64 = '';
    const len = bytes.length;
    for (i = 0; i < len; i += 3) {
      base64 += this.chars[bytes[i] >> 2];
      base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += this.chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
  }
}
