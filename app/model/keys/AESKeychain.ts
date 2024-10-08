import { AESEncryptedData } from '../../networking';
import AESModule from './AESModule';

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
  encryptedMessages: (AESEncryptedData | null)[],
): Promise<(string | null)[]> {
  return AESModule.decryptMany(
    wrappedKey,
    wrapperKeyId,
    encryptedMessages,
  );
}

async function decryptWithExposedKey(
  base64Key: string,
  base64EncryptedMessage: string,
  base64InitializationVector: string,
  base64IntegrityCheck: string,
): Promise<string> {
  return AESModule.decryptWithExposedKey(
    base64Key,
    base64EncryptedMessage,
    base64InitializationVector,
    base64IntegrityCheck,
  );
}

async function encrypt(
  wrappedKey: string,
  wrapperKeyId: string,
  message: string,
): Promise<AESEncryptedData> {
  return AESModule.encrypt(wrappedKey, wrapperKeyId, message);
}

async function encryptMany(
  wrappedKey: string,
  wrapperKeyId: string,
  messages: string[],
): Promise<AESEncryptedData[]> {
  return AESModule.encryptMany(wrappedKey, wrapperKeyId, messages);
}

async function generateKey(): Promise<string> {
  return AESModule.generateKey();
}

export default {
  decrypt,
  decryptMany,
  decryptWithExposedKey,
  encrypt,
  encryptMany,
  generateKey,
};
