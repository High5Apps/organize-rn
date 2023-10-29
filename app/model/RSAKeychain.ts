import RSAModule from './RSAModule';

async function deletePrivateKey(publicKeyId: string): Promise<boolean> {
  const succeeded = await RSAModule.deletePrivateKey(publicKeyId);
  return succeeded;
}

async function generateKeys(publicKeyId: string): Promise<void> {
  await RSAModule.generateKeys(publicKeyId);
}

export default {
  deletePrivateKey,
  generateKeys,
};
