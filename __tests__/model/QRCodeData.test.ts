import {
  QRCodeDataFormatter, QRCodeDataParser, QRCodeValue,
} from '../../app/model';
import {
  fakeJwtExpiration, fakeJwtString, fakeJwtSubject,
} from '../../app/model/FakeQRCodeValue';
import JWT, { JWTParser } from '../../app/model/JWT';
import { fakeCurrentUser, fakeOrg } from '../FakeData';

const currentTime = new Date().getTime();

jest.mock('../../app/model/JWT');
const mockJwt = JWT as jest.Mock;
const mockToString = jest.fn().mockReturnValue(fakeJwtString);
mockJwt.mockReturnValue({ toString: mockToString });

const mockJwtParser = JWTParser as jest.Mock;
mockJwtParser.mockReturnValue({
  expiration: fakeJwtExpiration,
  subject: fakeJwtSubject,
});

const consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();

describe('toUrl', () => {
  let url: string;

  beforeAll(async () => {
    const formatter = QRCodeDataFormatter({
      currentTime, org: fakeOrg, currentUser: fakeCurrentUser,
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

  it('contains org.potentialMemberCount', () => {
    expect(url).toContain(fakeOrg.potentialMemberCount);
  });

  it('contains org.potentialMemberDefinition', () => {
    expect(url).toContain(fakeOrg.potentialMemberDefinition);
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

  it('parses org.potentialMemberCount', () => {
    expect(value.org.potentialMemberCount)
      .toBe(fakeOrg.potentialMemberCount);
  });

  it('parses org.potentialMemberDefinition', () => {
    expect(value.org.potentialMemberDefinition)
      .toBe(fakeOrg.potentialMemberDefinition);
  });
});
