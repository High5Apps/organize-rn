import ECCModule from './ECCModule';

interface PublicKey {
  id: string;
  public: string;
}

async function deletePrivateKey(publicKeyId: string): Promise<boolean> {
  const succeeded = await ECCModule.deletePrivateKey(publicKeyId);
  return succeeded;
}

async function generateKeys(publicKeyId: string): Promise<PublicKey> {
  const publicKeyValue = await ECCModule.generateKeys(publicKeyId);
  const publicKey: PublicKey = {
    id: publicKeyId,
    public: publicKeyValue,
  };
  return publicKey;
}

async function getPublicKey(publicKeyId: string): Promise<string> {
  const publicKey = await ECCModule.getPublicKey(publicKeyId);

  // This is needed because some native modules (e.g. iOS) may not include a
  // trailing end-of-line character in their implementation of the PEM formatter
  if (!publicKey.endsWith('\n')) {
    return `${publicKey}\n`;
  }

  return publicKey;
}

async function sign(publicKeyId: string, message: string): Promise<string> {
  const signedMessage = await ECCModule.sign(publicKeyId, message);
  return signedMessage;
}

async function verify(
  publicKey: string,
  message: string,
  signature: string,
): Promise<boolean> {
  const isValid = await ECCModule.verify(publicKey, message, signature);
  return isValid;
}

export default {
  deletePrivateKey,
  generateKeys,
  getPublicKey,
  sign,
  verify,
};
