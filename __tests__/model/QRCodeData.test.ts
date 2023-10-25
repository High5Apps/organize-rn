import {
  QRCodeDataFormatter, QRCodeDataParser, QRCodeValue,
} from '../../app/model';
import {
  PROTOCOL_KEY, QR_CODE_JWT_SCOPE, QR_CODE_TIME_TO_LIVE_SECONDS, parseField,
  toField, toFieldPrefix,
} from '../../app/model/QRCodeData';
import { fakeCurrentUser, fakeJwtString } from '../FakeData';

const currentTime = new Date().getTime();

const mockCreateAuthToken = jest.fn().mockResolvedValue(fakeJwtString);
const mockCurrentUser = fakeCurrentUser;
mockCurrentUser.createAuthToken = mockCreateAuthToken;

const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();

describe('toFieldPrefix', () => {
  it('correctly formats prefix', () => {
    const prefix = toFieldPrefix('KEY');
    expect(prefix).toBe('KEY:');
  });
});

describe('toField', () => {
  it('correctly formats field', () => {
    const field = toField({ key: 'KEY', value: 'VALUE' });
    expect(field).toBe('KEY:VALUE;');
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
    const parsedField = parseField({ expectedKey: 'BAD', input: 'KEY:VALUE;' });
    expect(parsedField).toBeNull();
  });

  it('returns null when missing closing tag', () => {
    const parsedField = parseField({ expectedKey: 'KEY', input: 'KEY:VALUE' });
    expect(parsedField).toBeNull();
  });

  it('returns null when missing value', () => {
    const parsedField = parseField({ expectedKey: 'KEY', input: 'KEY:;' });
    expect(parsedField).toBeNull();
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

  it('returns null for other protocols', () => {
    const badString = formattedString.replace(PROTOCOL_KEY, 'BAD');
    const badValue = QRCodeDataParser({ input: badString }).parse();
    expect(badValue).toBeNull();
    expect(consoleWarnSpy).toBeCalled();
  });
});
