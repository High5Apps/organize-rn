import { NativeModules } from 'react-native';

const { ECCModule } = NativeModules;

export interface ECCInterface {
  deletePrivateKey(publicKeyId: string): Promise<boolean>;
  generateKeys(publicKeyId: string): Promise<string>;
  getPublicKey(publicKeyId: string): Promise<string>;
  sign(publicKeyId: string, message: string): Promise<string>;
  verify(
    publicKey: string, message: string, signature: string,
  ): Promise<boolean>;
}

export default ECCModule as ECCInterface;
