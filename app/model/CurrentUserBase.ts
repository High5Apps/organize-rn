import { JWT } from './formatters';
import { Keys } from './keys';
import { E2EEncryptor, Scope, CurrentUserBaseData } from './types';

export const defaultAuthTokenTTLSeconds = 60;

type CreateAuthTokenProps = {
  currentTime?: number;
  scope: Scope;
  timeToLiveSeconds?: number;
};

export default function CurrentUserBase({
  authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
}: CurrentUserBaseData) {
  const keys = Keys();

  async function createAuthToken({
    currentTime: maybeCurrentTime, scope, timeToLiveSeconds: maybeTTL,
  }: CreateAuthTokenProps): Promise<string> {
    if (!authenticationKeyId) {
      throw new Error(
        'Can only create auth token for users with an authenticationKeyId',
      );
    }

    const currentTime = maybeCurrentTime ?? new Date().getTime();
    const timeToLiveSeconds = maybeTTL ?? defaultAuthTokenTTLSeconds;

    const signer = (
      { message }: { message: string },
    ) => keys.ecc.sign({ message, publicKeyId: authenticationKeyId });

    const expirationSecondsSinceEpoch = (
      (currentTime / 1000) + timeToLiveSeconds
    );

    const jwt = JWT({
      expirationSecondsSinceEpoch,
      scope,
      signer,
      subject: id,
    });
    const jwtString = await jwt.toString();
    return jwtString;
  }

  const e2eEncrypt: E2EEncryptor = async (message: string) => {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    return keys.aes.encrypt({
      message,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
  };

  return {
    authenticationKeyId,
    createAuthToken,
    e2eEncrypt,
    encryptedGroupKey,
    id,
    localEncryptionKeyId,
  };
}
