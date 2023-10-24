import { Secret } from '../../app/model';

function decodedByteCount(base64String: string) {
  const paddingLength = base64String.split('=').length - 1;
  return (3 * (base64String.length / 4)) - paddingLength;
}

describe('Secret', () => {
  describe('base64', () => {
    it('includes only valid characters', () => {
      const secret = Secret().base64(32);
      expect(secret).toMatch(/^[a-zA-Z0-9/+]+={0,2}$/);
    });
  });

  it('returns the correct number of bytes', () => {
    [...Array(100).keys()].forEach((bytes) => {
      const secret = Secret().base64(bytes);
      expect(decodedByteCount(secret)).toEqual(bytes);
    });
  });
});
