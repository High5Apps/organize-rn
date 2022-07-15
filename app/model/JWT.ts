/* eslint-disable newline-per-chained-call */
import sha256 from 'crypto-js/sha256';
import { Buffer } from 'buffer';
import { Signer } from './types';

function base64ToBase64Url(base64: string) {
  // https://en.wikipedia.org/wiki/Base64#URL_applications
  const base64Url = (
    base64
      .split('+').join('-')
      .split('/').join('_')
      .split('=').join('')
  );
  return base64Url;
}

export function utf8ToBase64Url(utf8: string) {
  const buffer = Buffer.from(utf8);
  const base64 = buffer.toString('base64');
  return base64ToBase64Url(base64);
}

type Props = {
  expirationSecondsSinceEpoch: number;
  signer: Signer;
  subject: string;
};

// JWT Standard: https://www.rfc-editor.org/rfc/rfc7519.html
export default function JWT({
  expirationSecondsSinceEpoch: exp, signer, subject,
}: Props) {
  async function toString() {
    const header = { alg: 'RS256', typ: 'JWT' };

    const payload = { sub: subject, exp };

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
