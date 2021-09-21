import * as crypto from 'crypto';

export default function decrypt(
  cipher_alg: string,
  key: string,
  iv: string,
  text: string,
  encoding: crypto.HexBase64BinaryEncoding = 'binary',
) {
  try {
    const decipher = crypto.createDecipheriv(cipher_alg, key, iv);
    const result = decipher.update(text, encoding);
    const final = decipher.final();
    const decrypted = Buffer.concat([result, final]);
    return decrypted.toString('utf-8');
  } catch (error) {
    return '';
  }
}
