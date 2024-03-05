import UserBase from './UserBase';
import { Keys } from './keys';
import type {
  CurrentUserData, E2EDecryptor, E2EMultiDecryptor, E2EMultiEncryptor,
} from './types';

export default function User({
  authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
  org, orgId, pseudonym,
}: CurrentUserData) {
  const baseUser = UserBase({
    authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
  });

  const keys = Keys();

  async function deleteKeys() {
    let succeeded = false;

    try {
      const results = await Promise.all([
        keys.ecc.delete(authenticationKeyId),
        keys.rsa.delete(localEncryptionKeyId),
      ]);
      succeeded = results.every((result) => result);
    } catch (error) {
      console.error(error);
    }

    return succeeded;
  }

  async function decryptGroupKey() {
    const { message: groupKey } = await keys.rsa.decrypt({
      publicKeyId: localEncryptionKeyId,
      base64EncodedEncryptedMessage: encryptedGroupKey,
    });
    return groupKey;
  }

  const e2eDecrypt: E2EDecryptor = async (aesEncyptedData) => (
    keys.aes.decrypt({
      ...aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    })
  );

  const e2eDecryptMany: E2EMultiDecryptor = async (aesEncyptedData) => (
    keys.aes.decryptMany({
      encryptedMessages: aesEncyptedData,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    })
  );

  const e2eEncryptMany: E2EMultiEncryptor = async (messages: string[]) => (
    keys.aes.encryptMany({
      messages,
      wrappedKey: encryptedGroupKey,
      wrapperKeyId: localEncryptionKeyId,
    })
  );

  return {
    decryptGroupKey,
    deleteKeys,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncryptMany,
    org,
    orgId,
    pseudonym,
    ...baseUser,
  };
}

export type StorableUser = ReturnType<typeof User>;
