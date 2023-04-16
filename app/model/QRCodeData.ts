import { orgConnectionsURI, origin } from '../networking';
import {
  isCurrentUserData, isQRCodeValue, Org, QRCodeValue,
} from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';
const JWT_PARAM = 'jwt';

type FormatterProps = {
  currentTime: number;
  org: Org;
  currentUser: UserType;
};

export function QRCodeDataFormatter({
  currentTime, org, currentUser,
}: FormatterProps) {
  async function toUrl(): Promise<string> {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected QRCode user to be the current user');
    }

    const jwtString = await currentUser.createAuthToken({
      currentTime,
      timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
      scope: QR_CODE_JWT_SCOPE,
    });

    const url = new URL(orgConnectionsURI(org.id));
    url.searchParams.set(JWT_PARAM, jwtString);

    return url.href;
  }

  return { toUrl };
}

type ParserProps = {
  url: string;
};

export function QRCodeDataParser({ url }: ParserProps) {
  function parse(): QRCodeValue | null {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (_) {
      console.warn(`Failed to parse url from: ${url}`);
      return null;
    }

    const { origin: parsedOrigin, searchParams } = parsedUrl;

    if (parsedOrigin !== origin) {
      console.warn(`Unexpected origin: ${parsedOrigin}`);
      return null;
    }

    const jwt = searchParams.get(JWT_PARAM);

    const value = { jwt };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  return { parse };
}
