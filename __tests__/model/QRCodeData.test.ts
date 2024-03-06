import {
  QRCodeDataFormatter, QRCodeDataParser, QRCodeValue,
} from '../../app/model';
import { CurrentUser } from '../../app/model/CurrentUser';
import { base64ToBase64Url } from '../../app/model/JWT';
import {
  QR_CODE_JWT_SCOPE, QR_CODE_TIME_TO_LIVE_SECONDS,
} from '../../app/model/QRCodeData';
import { fakeCurrentUserData, fakeGroupKey, fakeJwtString } from '../FakeData';

const currentTime = new Date().getTime();

jest.mock('../../app/model/CurrentUser');
const mockCurrentUser = CurrentUser as jest.Mock;
const mockCreateAuthToken = jest.fn().mockResolvedValue(fakeJwtString);
const mockDecryptGroupKey = jest.fn().mockResolvedValue(fakeGroupKey);
mockCurrentUser.mockReturnValue({
  ...fakeCurrentUserData,
  createAuthToken: mockCreateAuthToken,
  decryptGroupKey: mockDecryptGroupKey,
});

const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();

describe('toString', () => {
  let formattedString: string;

  beforeEach(async () => {
    const formatter = QRCodeDataFormatter({
      currentTime, currentUser: CurrentUser(fakeCurrentUserData, () => null),
    });
    formattedString = await formatter.toString();
  });

  it('contains jwt', () => {
    expect(formattedString).toContain(fakeJwtString);
  });

  it('contains url-safe base64-encoded groupKey', () => {
    const encodedGroupKey = encodeURIComponent(base64ToBase64Url(fakeGroupKey));
    expect(formattedString).toContain(encodedGroupKey);
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
      currentTime, currentUser: CurrentUser(fakeCurrentUserData, () => null),
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
    const parsedUrl = new URL(formattedString);
    parsedUrl.protocol = 'foo:';
    const input = parsedUrl.href;
    const parsed = QRCodeDataParser({ input }).parse();
    expect(parsed).toBeNull();
    expect(consoleWarnSpy).toBeCalled();
  });
});
