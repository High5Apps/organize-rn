import ECCModule from './ECCModule';

interface PublicKey {
  id: string;
  public: string;
}

async function generateKeys(publicKeyId: string): Promise<PublicKey> {
  const publicKeyValue = await ECCModule.generateKeys(publicKeyId);
  const publicKey: PublicKey = {
    id: publicKeyId,
    public: publicKeyValue,
  };
  return publicKey;
}

async function deletePrivateKey(publicKeyId: string): Promise<boolean> {
  const succeeded = await ECCModule.deletePrivateKey(publicKeyId);
  return succeeded;
}

async function getPublicKey(publicKeyId: string): Promise<string | undefined> {
  const publicKey = await ECCModule.getPublicKey(publicKeyId);
  return publicKey;
}

export default {
  generateKeys,
  deletePrivateKey,
  getPublicKey,
};
