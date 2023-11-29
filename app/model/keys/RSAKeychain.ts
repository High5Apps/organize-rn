import RSAModule from './RSAModule';

async function decrypt(
  publicKeyId: string,
  base64EncryptedMessage: string,
): Promise<string> {
  return RSAModule.decrypt(publicKeyId, base64EncryptedMessage);
}

async function deletePrivateKey(publicKeyId: string): Promise<boolean> {
  return RSAModule.deletePrivateKey(publicKeyId);
}

async function encrypt(publicKeyId: string, message: string): Promise<string> {
  return RSAModule.encrypt(publicKeyId, message);
}

async function generateKeys(publicKeyId: string): Promise<void> {
  await RSAModule.generateKeys(publicKeyId);
}

export default {
  decrypt,
  deletePrivateKey,
  encrypt,
  generateKeys,
};
