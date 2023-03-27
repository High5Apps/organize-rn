import { NativeModules } from 'react-native';

const { ECCModule } = NativeModules;

export interface ECCInterface {
  generateKeys(publicKeyId: string): Promise<string>;
  deletePrivateKey(publicKeyId: string): Promise<boolean>;
  getPublicKey(publicKeyId: string): Promise<string>;
  sign(publicKeyId: string, message: string): Promise<string>;
}

export default ECCModule as ECCInterface;
