import RSAModule from './RSAModule';

async function generateKeys(publicKeyId: string): Promise<void> {
  await RSAModule.generateKeys(publicKeyId);
}

export default {
  generateKeys,
};
