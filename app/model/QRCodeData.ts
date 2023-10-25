import { isCurrentUserData, isQRCodeValue, QRCodeValue } from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';
export const PROTOCOL_KEY = 'ORGANIZE';
const JWT_KEY = 'JWT';
const SEPARATOR = ':';
const CLOSE_TAG = ';';

export const toFieldPrefix = (key: string) => `${key}${SEPARATOR}`;

export function toField({ key, value }: { key: string; value: string; }) {
  return `${toFieldPrefix(key)}${value}${CLOSE_TAG}`;
}

export function parseField({
  expectedKey, input,
}: { expectedKey: string, input: string }): string | null {
  const expectedPrefix = toFieldPrefix(expectedKey);
  if (!input.startsWith(expectedPrefix)) {
    console.warn(`Failed to parse key: "${expectedKey}" from input: "${input}". Missing expected prefix: "${expectedPrefix}"`);
    return null;
  }

  if (!input.endsWith(CLOSE_TAG)) {
    console.warn(`Failed to parse key: "${expectedKey}" from input: "${input}". Missing closing tag: "${CLOSE_TAG}"`);
    return null;
  }

  const value = input.slice(expectedPrefix.length, -1);

  if (!value.length) {
    console.warn(`Failed to parse key: "${expectedKey}" from input: "${input}". Value was empty`);
    return null;
  }

  return value;
}

type FormatterProps = {
  currentTime: number;
  currentUser: UserType;
};

export function QRCodeDataFormatter({
  currentTime, currentUser,
}: FormatterProps) {
  async function toString(): Promise<string> {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected QRCode user to be the current user');
    }

    const jwtString = await currentUser.createAuthToken({
      currentTime,
      timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
      scope: QR_CODE_JWT_SCOPE,
    });

    const jwtField = toField({ key: JWT_KEY, value: jwtString });
    return toField({ key: PROTOCOL_KEY, value: jwtField });
  }

  return { toString };
}

type ParserProps = {
  input: string;
};

export function QRCodeDataParser({ input }: ParserProps) {
  function parse(): QRCodeValue | null {
    const maybeJwtField = parseField({ expectedKey: PROTOCOL_KEY, input });
    if (!maybeJwtField) {
      console.warn(`Unexpected protocol for input: ${input}`);
      return null;
    }

    const jwt = parseField({ expectedKey: JWT_KEY, input: maybeJwtField });
    const value = { jwt };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  return { parse };
}
