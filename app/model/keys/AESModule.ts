import { NativeModules } from 'react-native';

const { AESModule } = NativeModules;

export type AESEncryptedData = {
  base64EncryptedMessage: string;
  base64InitializationVector: string;
  base64IntegrityCheck: string;
};

export type AESMessage = {
  message: string;
};

export type AESWrappedKey = {
  wrappedKey: string,
  wrapperKeyId: string,
};

export interface AESInterface {
  decrypt(
    wrappedKey: string,
    wrapperKeyId: string,
    base64EncryptedMessage: string,
    base64InitializationVector: string,
    base64IntegrityCheck: string,
  ): Promise<string>;
  decryptMany(
    wrappedKey: string,
    wrapperKeyId: string,
    encryptedMessages: (AESEncryptedData | null)[],
  ): Promise<(string | null)[]>;
  decryptWithExposedKey(
    base64Key: string,
    base64EncryptedMessage: string,
    base64InitializationVector: string,
    base64IntegrityCheck: string,
  ): Promise<string>;
  encrypt(
    wrappedKey: string, wrapperKeyId: string, message: string,
  ): Promise<AESEncryptedData>;
  encryptMany(
    wrappedKey: string,
    wrapperKeyId: string,
    messages: string[],
  ): Promise<AESEncryptedData[]>
}

export default AESModule as AESInterface;