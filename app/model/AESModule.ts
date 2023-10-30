import { NativeModules } from 'react-native';

const { AESModule } = NativeModules;

export type EncryptReturn = {
  base64EncryptedMessage: string;
  base64InitializationVector: string;
  base64IntegrityCheck: string;
};

export interface AESInterface {
  decrypt(
    wrappedKey: string,
    wrapperKeyId: string,
    base64EncryptedMessage: string,
    base64InitializationVector: string,
    base64IntegrityCheck: string,
  ): Promise<string>;
  encrypt(
    wrappedKey: string, wrapperKeyId: string, message: string,
  ): Promise<EncryptReturn>;
}

export default AESModule as AESInterface;
