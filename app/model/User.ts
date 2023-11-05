import { v4 as uuidv4 } from 'uuid';
import { AESEncryptedData } from './AESModule';
import JWT from './JWT';
import Keys from './Keys';
import type { Org, Scope, UserData } from './types';

export const defaultAuthTokenTTLSeconds = 60;

type Props = {
  authenticationKeyId?: string;
  encryptedGroupKey?: string;
  id?: string;
  localEncryptionKeyId?: string;
  org?: Org;
  orgId: string;
  pseudonym: string;
};

type CreateAuthTokenProps = {
  currentTime?: number;
  scope: Scope;
  timeToLiveSeconds?: number;
};

export default function User({
  authenticationKeyId, encryptedGroupKey, id: initialId, localEncryptionKeyId,
  org, orgId, pseudonym,
}: Props) {
  const userData: UserData = {
    id: initialId || uuidv4(),
    orgId,
    pseudonym,
  };
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
      subject: userData.id,
    });
    const jwtString = await jwt.toString();
    return jwtString;
  }

  async function deleteKeys() {
    let succeeded = false;

    if (authenticationKeyId && localEncryptionKeyId) {
      try {
        const results = await Promise.all([
          keys.ecc.delete(authenticationKeyId),
          keys.rsa.delete(localEncryptionKeyId),
        ]);
        succeeded = results.every((result) => result);
      } catch (error) {
        console.error(error);
      }
    }

    return succeeded;
  }

  function equals(user: UserType): boolean {
    return user.id === userData.id
      && user.orgId === userData.orgId;
  }

  async function decryptGroupKey() {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only decryptGroupKey for users with a localEncryptionKeyId and encryptedGroupKey');
    }

    const { message: groupKey } = await keys.rsa.decrypt({
      publicKeyId: localEncryptionKeyId,
      base64EncodedEncryptedMessage: encryptedGroupKey,
    });
    return groupKey;
  }

  async function e2eDecrypt(aesEncyptedData: AESEncryptedData) {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    const message = await keys.aes.decrypt({
      ...aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
    return message;
  }

  async function e2eDecryptMany(aesEncyptedData: (AESEncryptedData | null)[]) {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    const messages = await keys.aes.decryptMany({
      encryptedMessages: aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
    return messages;
  }

  async function e2eEncrypt(message: string) {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    return keys.aes.encrypt({
      message,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
  }

  return {
    authenticationKeyId,
    createAuthToken,
    decryptGroupKey,
    deleteKeys,
    encryptedGroupKey,
    equals,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncrypt,
    localEncryptionKeyId,
    org,
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
