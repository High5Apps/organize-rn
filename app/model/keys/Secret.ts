import CryptoJS from 'crypto-js';

export default function Secret() {
  return {
    base64: (bytes: number) => (
      CryptoJS.lib.WordArray.random(bytes).toString(CryptoJS.enc.Base64)
    ),
  };
}
