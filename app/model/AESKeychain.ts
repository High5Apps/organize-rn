import AESModule from './AESModule';

async function encrypt(
  wrappedKey: string,
  wrapperKeyId: string,
  message: string,
): Promise<string> {
  const base64EncryptedMessage = await AESModule.encrypt(
    wrappedKey,
    wrapperKeyId,
    message,
  );
  return base64EncryptedMessage;
}

export default {
  encrypt,
};
