import { RSAKeychain } from 'react-native-rsa-native';
import { v4 as uuidv4 } from 'uuid';

export default function Keys() {
  return {
    rsa: {
      async create(bits: number) {
        const publicKeyId = uuidv4();
        const keys = await RSAKeychain.generateKeys(publicKeyId, bits);
        return { publicKeyId, publicKey: keys.public };
      },
      async delete(publicKeyId: string) {
        const succeeded = await RSAKeychain.deletePrivateKey(publicKeyId);
        return succeeded;
      },
      async getPublicKey(publicKeyId: string) {
        const publicKey = await RSAKeychain.getPublicKey(publicKeyId);
        return publicKey;
      },
      async sign(
        { publicKeyId, message }: { publicKeyId: string, message: string },
      ) {
        const messageSignature = await RSAKeychain.signWithAlgorithm(message, publicKeyId, 'SHA256withRSA');
        return messageSignature;
      },
    },
  };
}
