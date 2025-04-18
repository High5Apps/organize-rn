import { Dispatch, SetStateAction, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrentUserBase from '../../CurrentUserBase';
import {
  storeCurrentUserData, useCurrentUserDataContext, useResetContext,
  useUserContext,
} from '../providers';
import { Keys } from '../../keys';
import { CurrentUserData, User } from '../../types';
import {
  E2EDecryptor, E2EMultiDecryptor, E2EMultiEncryptor, getUser, leaveOrg,
  verifyOrg,
} from '../../../networking';
import getErrorMessage from '../../ErrorMessage';
import { deleteAllDocuments } from '../../ReplaceableFile';

export function CurrentUser(
  currentUserData: CurrentUserData,
  setCurrentUserData: Dispatch<SetStateAction<CurrentUserData | null>>,
  cacheUser: (user: User) => void,
  resetContext: () => void,
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

  async function deleteDocuments() {
    let succeeded = false;

    try {
      await deleteAllDocuments();
      succeeded = true;
    } catch (error) {
      console.error(error);
    }

    return succeeded;
  }

  const keys = Keys();

  async function deleteKeys() {
    let succeeded = false;

    try {
      const results = await Promise.allSettled([
        keys.ecc.delete(authenticationKeyId),
        keys.rsa.delete(localEncryptionKeyId),
      ]);
      succeeded = results.every((result) => result.status === 'fulfilled');
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

  const getEccPublicKey = async () => (
    keys.ecc.getPublicKey(authenticationKeyId)
  );

  const logOut = async () => {
    const jwt = await currentUserBase.createAuthToken({ scope: '*' });
    const { errorMessage } = await leaveOrg({ jwt });
    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    await Promise.allSettled([deleteKeys(), deleteDocuments()]);
    storeCurrentUserData(null);
    resetContext();
    AsyncStorage.clear();
  };

  async function refresh() {
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

  async function verify(code: string) {
    const jwt = await currentUserBase.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    try {
      ({ errorMessage } = await verifyOrg({ code, jwt }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    setCurrentUserData((previousCurrentUserData) => {
      if (previousCurrentUserData === null) { return null; }

      const { unverified, ...verifiedOrg } = previousCurrentUserData.org;
      return { ...previousCurrentUserData, org: verifiedOrg };
    });
  }

  return {
    ...currentUserBase,
    decryptGroupKey,
    deleteKeys,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncryptMany,
    getEccPublicKey,
    logOut,
    org,
    refresh,
    user,
    ...user(),
    verify,
  };
}

export type CurrentUserType = ReturnType<typeof CurrentUser>;

export default function useCurrentUser() {
  const { currentUserData, setCurrentUserData } = useCurrentUserDataContext();
  const { cacheUser } = useUserContext();
  const { resetContext } = useResetContext();

  const currentUser = useMemo(() => {
    if (!currentUserData) { return null; }
    return CurrentUser(
      currentUserData,
      setCurrentUserData,
      cacheUser,
      resetContext,
    );
  }, [currentUserData]);

  return { currentUser, setCurrentUser: setCurrentUserData };
}
