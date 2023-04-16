import {
  QRCodeDataFormatter, QRCodeDataParser, QRCodeValue,
} from '../../app/model';
import { JWTParser } from '../../app/model/JWT';
import { QR_CODE_JWT_SCOPE, QR_CODE_TIME_TO_LIVE_SECONDS } from '../../app/model/QRCodeData';
import {
  fakeCurrentUser, fakeJwtExpiration, fakeJwtString, fakeJwtSubject, fakeOrg,
} from '../FakeData';

const currentTime = new Date().getTime();

const mockCreateAuthToken = jest.fn().mockResolvedValue(fakeJwtString);
const mockCurrentUser = fakeCurrentUser;
mockCurrentUser.createAuthToken = mockCreateAuthToken;

jest.mock('../../app/model/JWT');
const mockJwtParser = JWTParser as jest.Mock;
mockJwtParser.mockReturnValue({
  expiration: fakeJwtExpiration,
  subject: fakeJwtSubject,
});

const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();

describe('toUrl', () => {
  let url: string;

  beforeEach(async () => {
    const formatter = QRCodeDataFormatter({
      currentTime, org: fakeOrg, currentUser: mockCurrentUser,
    });
    url = await formatter.toUrl();
  });

  it('contains jwt', () => {
    expect(url).toContain(fakeJwtString);
  });

  it('contains org.id', () => {
    expect(url).toContain(fakeOrg.name);
  });

  it('contains org.name', () => {
    expect(url).toContain(fakeOrg.name);
  });

  it('contains org.potentialMemberEstimate', () => {
    expect(url).toContain(fakeOrg.potentialMemberEstimate);
  });

  it('contains org.potentialMemberDefinition', () => {
    expect(url).toContain(fakeOrg.potentialMemberDefinition);
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
  let url: string;
  let value: QRCodeValue;

  beforeAll(async () => {
    const formatter = QRCodeDataFormatter({
      currentTime, org: fakeOrg, currentUser: fakeCurrentUser,
    });
    url = await formatter.toUrl();
    value = QRCodeDataParser({ url }).parse()!;
    expect(consoleWarnSpy).not.toBeCalled();
  });

  it('returns null for unexpected urls', () => {
    const urls = [
      'badUrl',
      'app://foo',
      'https://example.com',
    ];
    urls.forEach((badUrl, i) => {
      const badValue = QRCodeDataParser({ url: badUrl }).parse();
      expect(badValue).toBeNull();
      expect(consoleWarnSpy).toBeCalledTimes(i + 1);
    });
  });

  it('returns null for other hosts', () => {
    const parsedUrl = new URL(url);
    parsedUrl.host = 'example.com';
    const otherUrl = parsedUrl.href;
    const parsed = QRCodeDataParser({ url: otherUrl }).parse();
    expect(parsed).toBeNull();
    expect(consoleWarnSpy).toBeCalled();
  });

  it('parses jwt', () => {
    expect(value.jwt).toBe(fakeJwtString);
  });

  it('parses org.id', () => {
    expect(value.org.id).toBe(fakeOrg.id);
  });

  it('parses org.name', () => {
    expect(value.org.name).toBe(fakeOrg.name);
  });

  it('parses org.potentialMemberEstimate', () => {
    expect(value.org.potentialMemberEstimate)
      .toBe(fakeOrg.potentialMemberEstimate);
  });

  it('parses org.potentialMemberDefinition', () => {
    expect(value.org.potentialMemberDefinition)
      .toBe(fakeOrg.potentialMemberDefinition);
  });
});
