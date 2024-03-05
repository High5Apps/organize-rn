import UserBase from './UserBase';
import { Keys } from './keys';
import type {
  CurrentUserData, E2EDecryptor, E2EMultiDecryptor,
  E2EMultiEncryptor, UserData,
} from './types';

export default function User({
  authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
  org, orgId, pseudonym,
}: CurrentUserData) {
  const baseUser = UserBase({
    authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
  });

  const userData: UserData = {
    id,
    orgId,
    pseudonym,
  };
  const keys = Keys();

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

  function equals(user: CurrentUserData): boolean {
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

  const e2eDecrypt: E2EDecryptor = async (aesEncyptedData) => {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    const message = await keys.aes.decrypt({
      ...aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
    return message;
  };

  const e2eDecryptMany: E2EMultiDecryptor = async (aesEncyptedData) => {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encrypt for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    const messages = await keys.aes.decryptMany({
      encryptedMessages: aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
    return messages;
  };

  const e2eEncryptMany: E2EMultiEncryptor = async (messages: string[]) => {
    if (!localEncryptionKeyId || !encryptedGroupKey) {
      throw new Error('Can only encryptMany for users with a localEncryptionKeyId and encryptedGroupKey');
    }
    return keys.aes.encryptMany({
      messages,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    });
  };

  return {
    decryptGroupKey,
    deleteKeys,
    equals,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncryptMany,
    org,
    ...baseUser,
    ...userData,
  };
}

export type StorableUser = ReturnType<typeof User>;
