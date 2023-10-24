import { v4 as uuidv4 } from 'uuid';
import JWT from './JWT';
import Keys from './Keys';
import type { Org, Scope, UserData } from './types';

export const defaultAuthTokenTTLSeconds = 60;

type Props = {
  authenticationKeyId?: string;
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
  authenticationKeyId, id: initialId, localEncryptionKeyId, org, orgId,
  pseudonym,
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

  return {
    authenticationKeyId,
    createAuthToken,
    deleteKeys,
    equals,
    localEncryptionKeyId,
    org,
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
