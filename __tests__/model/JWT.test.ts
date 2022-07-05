import { JWT, Signer } from '../../app/model';
import { utf8ToBase64Url } from '../../app/model/JWT';

const shimSigner: Signer = (
  { message }: { message: string },
) => Promise.resolve(utf8ToBase64Url(message));

describe('JWT', () => {
  let encodedHeader: string;
  let encodedPayload: string;
  let encodedSignature: string;

  beforeAll(async () => {
    const jwt = await JWT({
      currentTimeMilliseconds: 1516239022000,
      lifespanSeconds: 0,
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
