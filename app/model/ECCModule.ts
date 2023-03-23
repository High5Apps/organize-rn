import { NativeModules } from 'react-native';

const { ECCModule } = NativeModules;

interface ECCInterface {
  generateKeys(publicKeyId: string): Promise<string>;
}

export default ECCModule as ECCInterface;
