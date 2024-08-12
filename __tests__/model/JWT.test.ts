import { JWT, Signer } from '../../app/model';
import { utf8ToBase64Url } from '../../app/model/formatters/JWT';

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
      scope: '*',
      signer: shimSigner,
      subject: '1234567890',
    }).toString();
    [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');
  });

  it('has expected header', () => {
    expect(encodedHeader).toBe('eyJhbGciOiJFUzI1NiJ9');
  });

  it('has expected payload', () => {
    expect(encodedPayload).toBe(
      'eyJleHAiOjE1MTYyMzkwMjIsInNjcCI6IioiLCJzdWIiOiIxMjM0NTY3ODkwIn0=',
    );
  });

  it('has expected signature', () => {
    expect(encodedSignature).toBe('ZXlKaGJHY2lPaUpGVXpJMU5pSjkuZXlKbGVIQWlPakUxTVRZeU16a3dNaklzSW5OamNDSTZJaW9pTENKemRXSWlPaUl4TWpNME5UWTNPRGt3SW4wPQ==');
  });
});
