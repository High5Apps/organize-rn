import { NativeModules } from 'react-native';

const { ECCModule } = NativeModules;

interface ECCInterface {
  generateKeys(publicKeyId: string): Promise<string>;
  getPublicKey(publicKeyId: string): Promise<string | undefined>;
}

export default ECCModule as ECCInterface;
