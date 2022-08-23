import { useEffect, useState } from 'react';
import {
  createOrg, createUser, ErrorResponse, isErrorResponse, UnpublishedOrg,
} from '../networking';
import Keys from './Keys';
import User, { UserType } from './User';
import { getStoredUser, setStoredUser } from './UserStorage';

const GENERIC_ERROR_MESSAGE = 'Something unexpected happened. Please try again later.';

export type CreateCurrentUserProps = {
  orgId?: string;
  unpublishedOrg: UnpublishedOrg;
};

async function createCurrentUser({
  orgId: maybeOrgId,
  unpublishedOrg,
}: CreateCurrentUserProps): Promise<UserType | string> {
  const { publicKey, publicKeyId } = await Keys().rsa.create(2048);

  let userId: string;
  try {
    const response = await createUser({ publicKey });

    if (isErrorResponse(response)) {
      return ErrorResponse(response).errorMessage;
    }

    userId = response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return GENERIC_ERROR_MESSAGE;
  }

  let orgId: string;
  if (maybeOrgId) {
    orgId = maybeOrgId;
  } else {
    try {
      // `as any` is needed since users are required to have an Org
      const userWithoutOrg = User({ id: userId, publicKeyId } as any);
      const jwt = await userWithoutOrg.createAuthToken();

      const response = await createOrg({ ...unpublishedOrg, jwt });

      if (isErrorResponse(response)) {
        return ErrorResponse(response).errorMessage;
      }

      orgId = response;
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

  const user = User({
    id: userId, org, orgId, publicKeyId,
  });
  return user;
}

export default function useCurrentUser(user: UserType | null = null) {
  const [
    currentUser, setCurrentUser,
  ] = useState<UserType | null >(user || null);
  const [initialized, setInitialized] = useState(false);

  const logOut = async () => {
    await currentUser?.deleteKeyPair();
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
