import { NativeModules } from 'react-native';

const { RSAModule } = NativeModules;

export interface RSAInterface {
  generateKeys(publicKeyId: string): Promise<void>;
}

export default RSAModule as RSAInterface;
