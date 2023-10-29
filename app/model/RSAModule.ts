import { NativeModules } from 'react-native';

const { RSAModule } = NativeModules;

export interface RSAInterface {
  deletePrivateKey(publicKeyId: string): Promise<boolean>;
  generateKeys(publicKeyId: string): Promise<void>;
}

export default RSAModule as RSAInterface;
