import { NativeModules } from 'react-native';

const { AESModule } = NativeModules;

export interface AESInterface {
  encrypt(
    wrappedKey: string, wrapperKeyId: string, message: string,
  ): Promise<string>;
}

export default AESModule as AESInterface;
