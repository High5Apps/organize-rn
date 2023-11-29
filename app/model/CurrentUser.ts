import { useEffect, useState } from 'react';
import {
  createConnection, createOrg, createUser, getUser, UnpublishedOrg,
} from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';
import { Keys } from './keys';
import User, { UserType } from './User';
import { getStoredUser, setStoredUser } from './UserStorage';

export type CreateCurrentUserProps = {
  groupKey?: never;
  orgId?: never;
  sharerJwt?: never;
  unpublishedOrg: UnpublishedOrg;
} | {
  groupKey: string;
  orgId: string;
  sharerJwt: string;
  unpublishedOrg: UnpublishedOrg;
};

async function createCurrentUser({
  groupKey: maybeGroupKey,
  orgId: maybeOrgId,
  sharerJwt: maybeSharerJwt,
  unpublishedOrg,
}: CreateCurrentUserProps): Promise<UserType | string> {
  const keys = Keys();
  const {
    publicKey: authenticationKey, publicKeyId: authenticationKeyId,
  } = await keys.ecc.create();

  let userId: string;
  try {
    const { errorMessage, id } = await createUser({ authenticationKey });

    if (errorMessage !== undefined) {
      return errorMessage;
    }

    userId = id;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return GENERIC_ERROR_MESSAGE;
  }

  const groupKey = maybeGroupKey ?? keys.aes.create();
  const { publicKeyId: localEncryptionKeyId } = await keys.rsa.create();
  const {
    base64EncodedEncryptedMessage: encryptedGroupKey,
  } = await keys.rsa.encrypt({
    publicKeyId: localEncryptionKeyId, message: groupKey,
  });

  // `as any` is needed since users are required to have an Org and pseudonym
  const partialUser = User({
    authenticationKeyId, encryptedGroupKey, id: userId, localEncryptionKeyId,
  } as any);

  let orgId: string;
  if (maybeOrgId) {
    orgId = maybeOrgId;
  } else {
    try {
      const jwt = await partialUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = partialUser;
      const { errorMessage, id } = await createOrg({
        ...unpublishedOrg, e2eEncrypt, jwt,
      });

      if (errorMessage !== undefined) {
        return errorMessage;
      }

      orgId = id;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return GENERIC_ERROR_MESSAGE;
    }
  }

  const org = {
    id: orgId,
    ...unpublishedOrg,
  };

  if (maybeSharerJwt) {
    const sharerJwt = maybeSharerJwt;
    try {
      const jwt = await partialUser.createAuthToken({ scope: '*' });
      const { errorMessage: maybeErrorMessage } = await createConnection({
        jwt, sharerJwt,
      });

      if (maybeErrorMessage) {
        return maybeErrorMessage;
      }
    } catch (error) {
      console.error(error);
      return GENERIC_ERROR_MESSAGE;
    }
  }

  let pseudonym: string;
  try {
    const jwt = await partialUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, user: fetchedUser,
    } = await getUser({ id: userId, jwt });

    if (errorMessage !== undefined) {
      return errorMessage;
    }

    pseudonym = fetchedUser.pseudonym;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return GENERIC_ERROR_MESSAGE;
  }

  const user = User({
    authenticationKeyId,
    encryptedGroupKey,
    id: userId,
    localEncryptionKeyId,
    org,
    orgId,
    pseudonym,
  });
  return user;
}

export default function useCurrentUser(user: UserType | null = null) {
  const [
    currentUser, setCurrentUser,
  ] = useState<UserType | null >(user || null);
  const [initialized, setInitialized] = useState(false);

  const logOut = async () => {
    await currentUser?.deleteKeys();
    setStoredUser(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function initializeCurrentUser() {
      let storedUser = null;

      try {
        storedUser = await getStoredUser();
      } catch (e) {
        console.warn(e);
      }

      if (subscribed) {
        setCurrentUser(storedUser);
        setInitialized(true);
      }
    }

    if (!currentUser) {
      initializeCurrentUser();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Don't want to accidentally delete the stored user
    if (currentUser) {
      setStoredUser(currentUser);
    }
  }, [currentUser]);

  return {
    createCurrentUser, currentUser, initialized, logOut, setCurrentUser,
  };
}
