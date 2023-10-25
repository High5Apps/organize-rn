import {
  isCurrentUserData, isNonNull, isQRCodeValue, QRCodeValue,
} from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';
export const PROTOCOL_KEY = 'ORGANIZE';
const JWT_KEY = 'JWT';
const GROUP_KEY_KEY = 'GK';
const SEPARATOR = ':';
const CLOSE_TAG = ';';

export const toFieldPrefix = (key: string) => `${key}${SEPARATOR}`;

type ToFieldProps = {
  key: string; value: string; fields?: never;
} | {
  key: string; value?: never; fields: string[];
};
export function toField({ fields, key, value: maybeValue }: ToFieldProps) {
  const value = maybeValue ?? fields.join('');
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

export function parseFields({
  expectedKeys, input,
}: { expectedKeys: string[], input: string }): string[] | null {
  if (expectedKeys.length < 2) {
    console.warn(`Expected expectedKeys to have at least 2 keys: ${expectedKeys}`);
    return null;
  }

  // Note: n + 1 entries are expected when splitting an input with n delimiters
  // e.g. 'FOO:BAR;ZIM:ZAM;'.split(';') => ['FOO:BAR', 'ZIM:ZAM', '']
  const fields = input.split(CLOSE_TAG);
  const extraEntry = fields.pop();
  if (extraEntry !== '') {
    console.warn(`Expected no value after closing tag for input: ${input}`);
    return null;
  }

  if (fields.length !== expectedKeys.length) {
    console.warn(`Expected number of fields in input (${fields.length}) to equal number of expectedKeys (${expectedKeys.length})`);
    return null;
  }

  const values = fields.map((field, i) => parseField({
    // Calling split(CLOSE_TAG) above removes them, so need to add them back
    expectedKey: expectedKeys[i], input: `${field}${CLOSE_TAG}`,
  })).filter(isNonNull);

  if (values.length !== expectedKeys.length) {
    console.warn('Expected all fields to parse successfully');
    return null;
  }

  return values;
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

    const groupKey = await currentUser.decryptGroupKey();
    const groupKeyField = toField({ key: GROUP_KEY_KEY, value: groupKey });

    return toField({ key: PROTOCOL_KEY, fields: [jwtField, groupKeyField] });
  }

  return { toString };
}

type ParserProps = {
  input: string;
};

export function QRCodeDataParser({ input }: ParserProps) {
  function parse(): QRCodeValue | null {
    const maybeInnerFields = parseField({ expectedKey: PROTOCOL_KEY, input });
    if (!maybeInnerFields) {
      console.warn(`Unexpected protocol for input: ${input}`);
      return null;
    }

    const innerFields = maybeInnerFields;
    const innerFieldValues = parseFields({
      expectedKeys: [JWT_KEY, GROUP_KEY_KEY], input: innerFields,
    });

    if (!innerFieldValues) {
      console.warn(`Failed to parse ${JWT_KEY} or ${GROUP_KEY_KEY}`);
      return null;
    }

    const [jwt, groupKey] = innerFieldValues;

    const value = { groupKey, jwt };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  return { parse };
}
