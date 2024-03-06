import {
  createConnection, createOrg, createUser, getUser, UnpublishedOrg,
} from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';
import { Keys } from './keys';
import { CurrentUserData, User } from './types';
import CurrentUserBase from './CurrentUserBase';

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

export default async function createCurrentUser({
  groupKey: maybeGroupKey,
  orgId: maybeOrgId,
  sharerJwt: maybeSharerJwt,
  unpublishedOrg,
}: CreateCurrentUserProps): Promise<CurrentUserData | string> {
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

  const currentUserBase = CurrentUserBase({
    authenticationKeyId, encryptedGroupKey, id: userId, localEncryptionKeyId,
  });

  let orgId: string;
  if (maybeOrgId) {
    orgId = maybeOrgId;
  } else {
    try {
      const jwt = await currentUserBase.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUserBase;
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
      const jwt = await currentUserBase.createAuthToken({ scope: '*' });
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

  let fetchedUser: User;
  try {
    const jwt = await currentUserBase.createAuthToken({ scope: '*' });
    const errorMessageOrUser = await getUser({ id: userId, jwt });
    const { errorMessage } = errorMessageOrUser;

    if (errorMessage !== undefined) {
      return errorMessage;
    }

    fetchedUser = errorMessageOrUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return GENERIC_ERROR_MESSAGE;
  }

  return {
    authenticationKeyId,
    encryptedGroupKey,
    ...fetchedUser,
    id: userId,
    localEncryptionKeyId,
    org,
    orgId,
  };
}