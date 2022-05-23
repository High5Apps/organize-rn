import { Secret } from '../../app/model';
import { DEFAULT_SECRET_LENGTH_BYTES } from '../../app/model/Secret';

function decodedByteCount(base64String: string) {
  const paddingLength = base64String.split('=').length - 1;
  return (3 * (base64String.length / 4)) - paddingLength;
}

describe('Secret', () => {
  describe('base64Url', () => {
    it('includes only valid characters', () => {
      const secret = Secret().base64Url();
      expect(secret).toMatch(/^[a-zA-Z0-9_-]+={0,2}$/);
    });

    it('returns the correct number of bytes', () => {
      [...Array(20).keys()].forEach((bytes) => {
        const secret = Secret().base64Url(bytes);
        expect(decodedByteCount(secret)).toEqual(bytes);
      });
    });

    it('defaults to using DEFAULT_SECRET_LENGTH_BYTES', () => {
      const secret = Secret().base64Url();
      expect(decodedByteCount(secret)).toEqual(DEFAULT_SECRET_LENGTH_BYTES);
    });
  });
});
