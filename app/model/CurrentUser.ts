import { Dispatch, SetStateAction, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrentUserBase from './CurrentUserBase';
import {
  storeCurrentUserData, useCurrentUserDataContext, useUserContext,
} from './context';
import { Keys } from './keys';
import {
  CurrentUserData, E2EDecryptor, E2EMultiDecryptor, E2EMultiEncryptor, User,
} from './types';
import { getUser, leaveOrg } from '../networking';

export function CurrentUser(
  currentUserData: CurrentUserData,
  setCurrentUserData: Dispatch<SetStateAction<CurrentUserData | null>>,
  cacheUser: (user: User) => void,
) {
  const {
    authenticationKeyId, connectionCount, encryptedGroupKey, id, joinedAt,
    localEncryptionKeyId, offices, org, pseudonym, recruitCount,
  } = currentUserData;

  const currentUserBase = CurrentUserBase({
    authenticationKeyId, encryptedGroupKey, id, localEncryptionKeyId,
  });

  const user = (): User => ({
    connectionCount, id, joinedAt, offices, pseudonym, recruitCount,
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

  const logOut = async () => {
    const jwt = await currentUserBase.createAuthToken({ scope: '*' });
    const { errorMessage } = await leaveOrg({ jwt });
    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    await deleteKeys();
    storeCurrentUserData(null);
    setCurrentUserData(null);
    AsyncStorage.clear();
  };

  async function update() {
    const jwt = await currentUserBase.createAuthToken({ scope: '*' });
    const { errorMessage, user: fetchedUser } = await getUser({ id, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheUser(fetchedUser);

    if (!isEqual(user(), fetchedUser)) {
      setCurrentUserData((previousCurrentUserData) => {
        if (previousCurrentUserData === null) { return null; }
        return { ...previousCurrentUserData, ...fetchedUser };
      });
    }
  }

  return {
    ...currentUserBase,
    decryptGroupKey,
    deleteKeys,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncryptMany,
    logOut,
    org,
    update,
    user,
    ...user(),
  };
}

export type CurrentUserType = ReturnType<typeof CurrentUser>;

export default function useCurrentUser() {
  const { currentUserData, setCurrentUserData } = useCurrentUserDataContext();
  const { cacheUser } = useUserContext();

  const currentUser = useMemo(() => {
    if (!currentUserData) { return null; }
    return CurrentUser(currentUserData, setCurrentUserData, cacheUser);
  }, [currentUserData]);

  return { currentUser, setCurrentUser: setCurrentUserData };
}
