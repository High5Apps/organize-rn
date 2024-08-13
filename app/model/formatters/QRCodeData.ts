import type { CurrentUserType } from '../context';
import { base64ToBase64Url, base64UrlToBase64 } from './JWT';
import { isQRCodeValue, type QRCodeValue } from '../types';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';

// PROTOCOL should never be changed to https. Using a non-HTTP protocol lowers
// the risk of the group key accidentally being sent to the server.
const PROTOCOL = 'organize:';

const CONNECT_PATH = 'connect';
const URL_BASE = `${PROTOCOL}//${CONNECT_PATH}`;
const JWT_PARAM = 'jwt';
const GROUP_KEY_PARAM = 'gk';

type FormatterProps = {
  currentTime: number;
  currentUser: CurrentUserType;
};

export function QRCodeDataFormatter({
  currentTime, currentUser,
}: FormatterProps) {
  async function toString(): Promise<string> {
    if (!currentUser) {
      throw new Error('Expected QRCode user to be the current user');
    }

    const [jwtString, base64GroupKey] = await Promise.all([
      currentUser.createAuthToken({
        currentTime,
        timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
        scope: QR_CODE_JWT_SCOPE,
      }),
      currentUser.decryptGroupKey(),
    ]);

    const base64UrlGroupKey = base64ToBase64Url(base64GroupKey);

    const url = new URL(URL_BASE);
    url.searchParams.set(JWT_PARAM, jwtString);
    url.searchParams.set(GROUP_KEY_PARAM, base64UrlGroupKey);
    return url.href;
  }

  return { toString };
}

type ParserProps = {
  input: string;
};

export function QRCodeDataParser({ input }: ParserProps) {
  function parse(): QRCodeValue | null {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(input);
    } catch (_) {
      console.warn(`Failed to parse url from: ${input}`);
      return null;
    }

    const { protocol: parsedProtocol, searchParams } = parsedUrl;

    if (parsedProtocol !== PROTOCOL) {
      console.warn(`Unexpected protocol: ${parsedProtocol}`);
      return null;
    }

    const jwt = searchParams.get(JWT_PARAM);
    const base64UrlGroupKey = searchParams.get(GROUP_KEY_PARAM);

    if (jwt === null || base64UrlGroupKey === null) {
      return null;
    }

    const groupKey = base64UrlToBase64(base64UrlGroupKey);

    const value = { groupKey, jwt };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  return { parse };
}
