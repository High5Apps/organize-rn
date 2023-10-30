import { v4 as uuidv4 } from 'uuid';
import ECCKeychain from './ECCKeychain';
import RSAKeychain from './RSAKeychain';
import Secret from './Secret';

const KEY_STRENGTH_256_BIT_IN_BYTES = 256 / 8;

export default function Keys() {
  return {
    aes: {
      create() {
        return Secret().base64(KEY_STRENGTH_256_BIT_IN_BYTES);
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
