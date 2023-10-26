import AESModule, { EncryptReturn } from './AESModule';

async function encrypt(
  wrappedKey: string,
  wrapperKeyId: string,
  message: string,
): Promise<EncryptReturn> {
  return AESModule.encrypt(wrappedKey, wrapperKeyId, message);
}

export default {
  encrypt,
};
