import { useEffect, useState } from 'react';
import {
  createConnection, createOrg, createUser, ErrorResponse, getUser,
  isErrorResponse, UnpublishedOrg,
} from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';
import Keys from './Keys';
import User, { UserType } from './User';
import { getStoredUser, setStoredUser } from './UserStorage';

export type CreateCurrentUserProps = {
  orgId?: string;
  sharerJwt?: string;
  unpublishedOrg: UnpublishedOrg;
};

async function createCurrentUser({
  orgId: maybeOrgId,
  sharerJwt: maybeSharerJwt,
  unpublishedOrg,
}: CreateCurrentUserProps): Promise<UserType | string> {
  if ((maybeOrgId && !maybeSharerJwt) || (!maybeOrgId && maybeSharerJwt)) {
    console.error('Expected both sharerJwt and orgId if either is included');
    return GENERIC_ERROR_MESSAGE;
  }

  const {
    publicKey: authenticationKey, publicKeyId: authenticationKeyId,
  } = await Keys().ecc.create();

  let userId: string;
  try {
    const response = await createUser({ authenticationKey });

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

  // `as any` is needed since users are required to have an Org and pseudonym
  const partialUser = User({ authenticationKeyId, id: userId } as any);

  let orgId: string;
  if (maybeOrgId) {
    orgId = maybeOrgId;
  } else {
    try {
      const jwt = await partialUser.createAuthToken({ scope: '*' });
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
    const response = await getUser({ id: userId, jwt });

    if (isErrorResponse(response)) {
      return ErrorResponse(response).errorMessage;
    }

    pseudonym = response.pseudonym;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return GENERIC_ERROR_MESSAGE;
  }

  const user = User({
    authenticationKeyId, id: userId, org, orgId, pseudonym,
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
