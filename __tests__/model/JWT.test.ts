import { JWT, JWTParser, Signer } from '../../app/model';
import { utf8ToBase64Url } from '../../app/model/JWT';
import { fakeJwtString } from '../FakeData';

const shimSigner: Signer = (
  { message }: { message: string },
) => Promise.resolve(utf8ToBase64Url(message));

describe('JWT', () => {
  let encodedHeader: string;
  let encodedPayload: string;
  let encodedSignature: string;

  beforeAll(async () => {
    const jwt = await JWT({
      expirationSecondsSinceEpoch: 1516239022,
      signer: shimSigner,
      subject: '1234567890',
    }).toString();
    [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');
  });

  it('has expected header', () => {
    expect(encodedHeader).toBe('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('has expected payload', () => {
    expect(encodedPayload).toBe(
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNTE2MjM5MDIyfQ',
    );
  });

  it('has expected signature', () => {
    expect(encodedSignature).toBe('NDlmMzMwNzkwN2I2MTVlMTIwODkyODlmOTRmMjJhNDg5NGM4MDllNzIwNTBjZTBmZmRlYTIyOGFlZWU0OGU5Yg');
  });
});

describe('JWTParser', () => {
  describe('subject', () => {
    it('should be null when input is null', () => {
      const { subject } = JWTParser(null);
      expect(subject).toBeNull();
    });

    it('should be null when not present', () => {
      const { subject } = JWTParser('');
      expect(subject).toBeNull();
    });

    it('should be correct when present', () => {
      const { subject } = JWTParser(fakeJwtString);
      expect(subject).toBe('eb78bddb-fcae-450d-8d80-407c047b2547');
    });
  });

  describe('expiration', () => {
    it('should be null when input is null', () => {
      const { expiration } = JWTParser(null);
      expect(expiration).toBeNull();
    });

    it('should be null when not present', () => {
      const { expiration } = JWTParser('');
      expect(expiration).toBeNull();
    });

    it('should be correct when present', () => {
      const { expiration } = JWTParser(fakeJwtString);
      expect(expiration).toBe(1657605679.718);
    });
  });
});
