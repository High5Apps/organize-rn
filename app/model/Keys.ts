import { RSAKeychain } from 'react-native-rsa-native';
import { v4 as uuidv4 } from 'uuid';
import ECCKeychain from './ECCKeychain';

export default function Keys() {
  return {
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
        await RSAKeychain.generateKeys(publicKeyId, 2048);
        return { publicKeyId };
      },
      async delete(publicKeyId: string) {
        const succeeded = await RSAKeychain.deletePrivateKey(publicKeyId);
        return succeeded;
      },
      async encrypt({
        publicKeyId, message,
      }: { publicKeyId: string; message: string; }) {
        const encryptedMessage = await RSAKeychain.encrypt(
          message,
          publicKeyId,
        );
        const withoutWhitespace = encryptedMessage.replace(/\s/g, '');
        return { base64EncodedEncryptedMessage: withoutWhitespace };
      },
      async decrypt({
        base64EncodedEncryptedMessage, publicKeyId,
      }: { publicKeyId: string; base64EncodedEncryptedMessage: string; }) {
        const message = await RSAKeychain.decrypt(
          base64EncodedEncryptedMessage,
          publicKeyId,
        );
        return { message };
      },
    },
  };
}
