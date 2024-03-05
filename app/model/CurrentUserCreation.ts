import {
  createConnection, createOrg, createUser, getUser, UnpublishedOrg,
} from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';
import { Keys } from './keys';
import { CurrentUserData } from './types';
import UserBase from './UserBase';

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

  const baseUser = UserBase({
    authenticationKeyId, encryptedGroupKey, id: userId, localEncryptionKeyId,
  });

  let orgId: string;
  if (maybeOrgId) {
    orgId = maybeOrgId;
  } else {
    try {
      const jwt = await baseUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = baseUser;
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
      const jwt = await baseUser.createAuthToken({ scope: '*' });
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
    const jwt = await baseUser.createAuthToken({ scope: '*' });
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

  return {
    authenticationKeyId,
    encryptedGroupKey,
    id: userId,
    localEncryptionKeyId,
    org,
    orgId,
    pseudonym,
  };
}
