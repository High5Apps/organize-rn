/* eslint-disable newline-per-chained-call */
import { Buffer } from 'buffer';
import { Scope, Signer } from './types';

const BASE64_CHAR_62 = '+';
const BASE64_CHAR_63 = '/';
const BASE64URL_CHAR_62 = '-';
const BASE64URL_CHAR_63 = '_';
const BASE64_PADDING = '=';

function base64ToBase64Url(base64: string) {
  const base64Url = (
    base64
      .split(BASE64_CHAR_62).join(BASE64URL_CHAR_62)
      .split(BASE64_CHAR_63).join(BASE64URL_CHAR_63)
      .split(BASE64_PADDING).join('')
  );
  return base64Url;
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

export function base64UrlToUtf8(base64Url: string) {
  const base64 = (
    base64Url
      .split(BASE64URL_CHAR_62).join(BASE64_CHAR_62)
      .split(BASE64URL_CHAR_63).join(BASE64_CHAR_63)
      .split(BASE64_PADDING).join('')
  );

  // buffer@6.0.3 polyfill does not yet include the base64url encoding
  const buffer = Buffer.from(base64, 'base64');
  const utf8 = buffer.toString('utf8');
  return utf8;
}

export function JWTParser(jwt: string | null) {
  const encodedPayload = jwt?.split('.')[1];

  let payload = { exp: null, sub: null };
  try {
    const payloadJson = base64UrlToUtf8(encodedPayload || '');
    payload = JSON.parse(payloadJson);
  } catch {}

  const expiration: string | null = payload.exp;
  const subject: number | null = payload.sub;

  return { expiration, subject };
}
