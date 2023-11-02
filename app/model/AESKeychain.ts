import AESModule, { AESEncryptedData } from './AESModule';

async function decrypt(
  wrappedKey: string,
  wrapperKeyId: string,
  base64EncryptedMessage: string,
  base64InitializationVector: string,
  base64IntegrityCheck: string,
): Promise<string> {
  return AESModule.decrypt(
    wrappedKey,
    wrapperKeyId,
    base64EncryptedMessage,
    base64InitializationVector,
    base64IntegrityCheck,
  );
}

async function decryptMany(
  wrappedKey: string,
  wrapperKeyId: string,
  encryptedMessages: AESEncryptedData[],
): Promise<string[]> {
  return AESModule.decryptMany(
    wrappedKey,
    wrapperKeyId,
    encryptedMessages,
  );
}

async function encrypt(
  wrappedKey: string,
  wrapperKeyId: string,
  message: string,
): Promise<AESEncryptedData> {
  return AESModule.encrypt(wrappedKey, wrapperKeyId, message);
}

export default {
  decrypt,
  decryptMany,
  encrypt,
};
