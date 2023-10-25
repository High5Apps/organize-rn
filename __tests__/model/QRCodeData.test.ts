import {
  QRCodeDataFormatter, QRCodeDataParser, QRCodeValue,
} from '../../app/model';
import {
  PROTOCOL_KEY, QR_CODE_JWT_SCOPE, QR_CODE_TIME_TO_LIVE_SECONDS, parseField,
  parseFields, toField, toFieldPrefix,
} from '../../app/model/QRCodeData';
import { fakeCurrentUser, fakeGroupKey, fakeJwtString } from '../FakeData';

const currentTime = new Date().getTime();

const mockCreateAuthToken = jest.fn().mockResolvedValue(fakeJwtString);
const mockCurrentUser = fakeCurrentUser;
mockCurrentUser.createAuthToken = mockCreateAuthToken;

const mockDecryptGroupKey = jest.fn().mockResolvedValue(fakeGroupKey);
mockCurrentUser.decryptGroupKey = mockDecryptGroupKey;

const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();

describe('toFieldPrefix', () => {
  it('correctly formats prefix', () => {
    const prefix = toFieldPrefix('KEY');
    expect(prefix).toBe('KEY:');
  });
});

describe('toField', () => {
  it('formats value', () => {
    const field = toField({ key: 'KEY', value: 'VALUE' });
    expect(field).toBe('KEY:VALUE;');
  });

  it('formats fields', () => {
    const field = toField({ key: 'KEY', fields: ['K1:V1;', 'K2:V2;'] });
    expect(field).toBe('KEY:K1:V1;K2:V2;;');
  });
});

describe('parseField', () => {
  it('parses value', () => {
    const value = parseField({ expectedKey: 'KEY', input: 'KEY:VALUE;' });
    expect(value).toBe('VALUE');
  });

  it('parses value field', () => {
    const value = parseField({ expectedKey: 'KEY', input: 'KEY:FOO:BAR;;' });
    expect(value).toBe('FOO:BAR;');
  });

  it('returns null on unexpected key', () => {
    const value = parseField({ expectedKey: 'BAD', input: 'KEY:VALUE;' });
    expect(value).toBeNull();
  });

  it('returns null when missing closing tag', () => {
    const value = parseField({ expectedKey: 'KEY', input: 'KEY:VALUE' });
    expect(value).toBeNull();
  });

  it('returns null when missing value', () => {
    const value = parseField({ expectedKey: 'KEY', input: 'KEY:;' });
    expect(value).toBeNull();
  });
});

describe('parseFields', () => {
  it('returns values', () => {
    expect(
      parseFields({ expectedKeys: ['K1', 'K2'], input: 'K1:V1;K2:V2;' }),
    ).toEqual(['V1', 'V2']);
  });

  it('returns null when only one expectedKey is given', () => {
    expect(
      parseFields({ expectedKeys: ['K1'], input: 'K1:V1;' }),
    ).toBeNull();
  });

  it('returns null when extra input after closing tag', () => {
    expect(
      parseFields({ expectedKeys: ['K1', 'K2'], input: 'K1:V1;K2:V2;BAD' }),
    ).toBeNull();
  });

  it('returns null when expected key count is different than field count', () => {
    expect(
      parseFields({ expectedKeys: ['K1', 'K2'], input: 'K1:V1;K2:V2;K3:V3;' }),
    ).toBeNull();

    expect(
      parseFields({ expectedKeys: ['K1', 'K2', 'K3'], input: 'K1:V1;K2:V2;' }),
    ).toBeNull();
  });

  it('returns null if any of the fields fail to parse', () => {
    expect(
      parseFields({ expectedKeys: ['K1', 'K2'], input: 'K1:;K2:V2;' }),
    ).toBeNull();

    expect(
      parseFields({ expectedKeys: ['K1', 'K2'], input: 'K1:V1;K2:;' }),
    ).toBeNull();
  });
});

describe('toString', () => {
  let formattedString: string;

  beforeEach(async () => {
    const formatter = QRCodeDataFormatter({
      currentTime, currentUser: mockCurrentUser,
    });
    formattedString = await formatter.toString();
  });

  it('contains jwt', () => {
    expect(formattedString).toContain(fakeJwtString);
  });

  it('contains groupKey', () => {
    expect(formattedString).toContain(fakeGroupKey);
  });

  describe('createAuthToken', () => {
    it('uses QR_CODE_JWT_SCOPE', () => {
      const expected = expect.objectContaining({ scope: QR_CODE_JWT_SCOPE });
      expect(mockCreateAuthToken).toBeCalledWith(expected);
    });

    it('does not use the * scope', () => {
      const unexpected = expect.objectContaining({ scope: '*' });
      expect(mockCreateAuthToken).not.toBeCalledWith(unexpected);
    });

    it('uses the current time', () => {
      const expected = expect.objectContaining({ currentTime });
      expect(mockCreateAuthToken).toBeCalledWith(expected);
    });

    it('uses QR_CODE_TIME_TO_LIVE_SECONDS', () => {
      expect(mockCreateAuthToken).toBeCalledWith(expect.objectContaining({
        timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
      }));
    });
  });
});

describe('parse', () => {
  let formattedString: string;
  let value: QRCodeValue;

  beforeAll(async () => {
    consoleWarnSpy.mockClear();
    const formatter = QRCodeDataFormatter({
      currentTime, currentUser: fakeCurrentUser,
    });
    formattedString = await formatter.toString();
    value = QRCodeDataParser({ input: formattedString }).parse()!;
    expect(consoleWarnSpy).not.toBeCalled();
  });

  it('parses jwt', () => {
    expect(value.jwt).toBe(fakeJwtString);
  });

  it('parses groupKey', () => {
    expect(value.groupKey).toBe(fakeGroupKey);
  });

  it('returns null for other protocols', () => {
    const badString = formattedString.replace(PROTOCOL_KEY, 'BAD');
    const badValue = QRCodeDataParser({ input: badString }).parse();
    expect(badValue).toBeNull();
    expect(consoleWarnSpy).toBeCalled();
  });
});
