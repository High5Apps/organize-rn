import { v4 as uuidv4 } from 'uuid';
import AESKeychain from './AESKeychain';
import ECCKeychain from './ECCKeychain';
import RSAKeychain from './RSAKeychain';
import { AESMessage, AESWrappedKey } from './AESModule';
import { AESEncryptedData } from '../../networking';

export default function Keys() {
  return {
    aes: {
      create() {
        return AESKeychain.generateKey();
      },
      async decrypt({
        base64EncryptedMessage, base64InitializationVector,
        base64IntegrityCheck, wrappedKey, wrapperKeyId,
      }: AESEncryptedData & AESWrappedKey) {
        return AESKeychain.decrypt(
          wrappedKey,
          wrapperKeyId,
          base64EncryptedMessage,
          base64InitializationVector,
          base64IntegrityCheck,
        );
      },
      async decryptMany({
        encryptedMessages, wrappedKey, wrapperKeyId,
      }: { encryptedMessages: (AESEncryptedData | null)[] } & AESWrappedKey) {
        return AESKeychain.decryptMany(
          wrappedKey,
          wrapperKeyId,
          encryptedMessages,
        );
      },
      async decryptWithExposedKey({
        base64EncryptedMessage, base64InitializationVector,
        base64IntegrityCheck, base64Key,
      }: AESEncryptedData & { base64Key: string }) {
        return AESKeychain.decryptWithExposedKey(
          base64Key,
          base64EncryptedMessage,
          base64InitializationVector,
          base64IntegrityCheck,
        );
      },
      async encrypt({
        message, wrappedKey, wrapperKeyId,
      }: AESMessage & AESWrappedKey) {
        return AESKeychain.encrypt(wrappedKey, wrapperKeyId, message);
      },
      async encryptMany({
        messages, wrappedKey, wrapperKeyId,
      }: AESWrappedKey & { messages: string[] }) {
        return AESKeychain.encryptMany(wrappedKey, wrapperKeyId, messages);
      },
    },
    ecc: {
      async create() {
        const publicKeyId = uuidv4();
        const keys = await ECCKeychain.generateKeys(publicKeyId);
        return { publicKeyId, publicKey: keys.public };
      },
      async delete(publicKeyId: string) {
        const succeeded = await ECCKeychain.deletePrivateKey(publicKeyId);
        return succeeded;
      },
      async getPublicKey(publicKeyId: string) {
        const publicKey = await ECCKeychain.getPublicKey(publicKeyId);
        return publicKey;
      },
      async sign({
        publicKeyId, message,
      }: { publicKeyId: string; message: string; }) {
        const messageSignature = await ECCKeychain.sign(publicKeyId, message);
        return messageSignature;
      },
      async verify({
        message, publicKey, signature,
      }: { message: string; publicKey: string; signature: string; }) {
        const isValid = await ECCKeychain.verify(publicKey, message, signature);
        return isValid;
      },
    },
    rsa: {
      async create() {
        const publicKeyId = uuidv4();
        await RSAKeychain.generateKeys(publicKeyId);
        return { publicKeyId };
      },
      async delete(publicKeyId: string) {
        const succeeded = await RSAKeychain.deletePrivateKey(publicKeyId);
        return succeeded;
      },
      async encrypt({
        publicKeyId, message,
      }: { publicKeyId: string; message: string; }) {
        const base64EncodedEncryptedMessage = await RSAKeychain.encrypt(
          publicKeyId,
          message,
        );
        return { base64EncodedEncryptedMessage };
      },
      async decrypt({
        base64EncodedEncryptedMessage, publicKeyId,
      }: { publicKeyId: string; base64EncodedEncryptedMessage: string; }) {
        const message = await RSAKeychain.decrypt(
          publicKeyId,
          base64EncodedEncryptedMessage,
        );
        return { message };
      },
    },
  };
}
