/* eslint-disable newline-per-chained-call */
import sha256 from 'crypto-js/sha256';
import { Buffer } from 'buffer';
import { Signer } from './types';

function base64ToBase64Url(base64: string) {
  const buffer = Buffer.from(base64, 'base64');
  const base64Url = buffer.toString('base64url');
  return base64Url;
}

export function utf8ToBase64Url(utf8: string) {
  const buffer = Buffer.from(utf8);
  const base64 = buffer.toString('base64url');
  return base64;
}

type Props = {
  expirationSecondsSinceEpoch: number;
  signer: Signer;
  subject: string;
};

// JWT Standard: https://www.rfc-editor.org/rfc/rfc7519.html
export default function JWT({
  expirationSecondsSinceEpoch: exp, signer, subject: sub,
}: Props) {
  async function toString() {
    const header = { alg: 'RS256', typ: 'JWT' };

    const payload = { sub, exp };

    const encodedHeader = utf8ToBase64Url(JSON.stringify(header));
    const encodedPayload = utf8ToBase64Url(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;

    const messageDigestWords = sha256(message);
    const messageDigest = messageDigestWords.toString();
    const signature = await signer({ message: messageDigest });
    const encodedSignature = base64ToBase64Url(signature);

    return `${message}.${encodedSignature}`;
  }

  return { toString };
}

export function base64UrlToUtf8(base64url: string) {
  const buffer = Buffer.from(base64url, 'base64url');
  const base64 = buffer.toString('utf8');
  return base64;
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
