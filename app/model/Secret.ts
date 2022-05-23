import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';

// 64 bytes is the same length as `rails secret`
export const DEFAULT_SECRET_LENGTH_BYTES = 64;

export default function Secret() {
  return {
    base64Url: (bytes: number = DEFAULT_SECRET_LENGTH_BYTES) => {
      const randomByteArray = CryptoJS.lib.WordArray.random(4 * bytes);
      const randomBuffer = Buffer.from(randomByteArray.words);
      const randomBase64 = randomBuffer.toString('base64');

      // https://en.wikipedia.org/wiki/Base64#URL_applications
      const randomBase64Url = (
        randomBase64
          .split('+').join('-')
          .split('/').join('_')
      );
      return randomBase64Url;
    },
  };
}
