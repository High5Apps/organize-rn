/* eslint-disable newline-per-chained-call */
import { Buffer } from 'buffer';
import { Scope, Signer } from '../types';

const BASE64_CHAR_62 = '+';
const BASE64_CHAR_63 = '/';
const BASE64URL_CHAR_62 = '-';
const BASE64URL_CHAR_63 = '_';

export function base64ToBase64Url(base64: string) {
  const base64Url = (
    base64
      .split(BASE64_CHAR_62).join(BASE64URL_CHAR_62)
      .split(BASE64_CHAR_63).join(BASE64URL_CHAR_63)
  );
  return base64Url;
}

export function base64UrlToBase64(base64Url: string) {
  const base64 = (
    base64Url
      .split(BASE64URL_CHAR_62).join(BASE64_CHAR_62)
      .split(BASE64URL_CHAR_63).join(BASE64_CHAR_63)
  );
  return base64;
}

export function utf8ToBase64Url(utf8: string) {
  const buffer = Buffer.from(utf8);

  // buffer@6.0.3 polyfill does not yet include the base64url encoding
  const base64 = buffer.toString('base64');

  return base64ToBase64Url(base64);
}

type Props = {
  expirationSecondsSinceEpoch: number;
  scope: Scope;
  signer: Signer;
  subject: string;
};

// JWT Standard: https://www.rfc-editor.org/rfc/rfc7519.html
export default function JWT({
  expirationSecondsSinceEpoch, scope: scp, signer, subject: sub,
}: Props) {
  async function toString() {
    const header = { alg: 'ES256' };

    const exp = Math.floor(expirationSecondsSinceEpoch);
    const payload = { exp, scp, sub };

    const encodedHeader = utf8ToBase64Url(JSON.stringify(header));
    const encodedPayload = utf8ToBase64Url(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;

    const signature = await signer({ message });
    const encodedSignature = base64ToBase64Url(signature);

    return `${message}.${encodedSignature}`;
  }

  return { toString };
}
