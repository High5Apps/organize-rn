import { v4 as uuidv4 } from 'uuid';
import JWT from './JWT';
import Keys from './Keys';
import type { Org, Scope, UserData } from './types';

export const defaultAuthTokenTTLSeconds = 60;

type Props = {
  id?: string;
  org?: Org;
  orgId: string;
  pseudonym: string;
  publicKeyId?: string;
};

type CreateAuthTokenProps = {
  currentTime?: number;
  scope: Scope;
  timeToLiveSeconds?: number;
};

export default function User({
  id: initialId, org, orgId, pseudonym, publicKeyId,
}: Props) {
  const userData: UserData = {
    id: initialId || uuidv4(),
    orgId,
    pseudonym,
  };

  async function createAuthToken({
    currentTime: maybeCurrentTime, scope, timeToLiveSeconds: maybeTTL,
  }: CreateAuthTokenProps): Promise<string> {
    if (!publicKeyId) {
      throw new Error('Can only create auth token for users with a key pair');
    }

    const currentTime = maybeCurrentTime ?? new Date().getTime();
    const timeToLiveSeconds = maybeTTL ?? defaultAuthTokenTTLSeconds;

    const signer = (
      { message }: { message: string },
    ) => Keys().ecc.sign({ message, publicKeyId });

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

  async function deleteKeyPair() {
    let succeeded = false;

    if (publicKeyId) {
      succeeded = await Keys().ecc.delete(publicKeyId);
    }

    return succeeded;
  }

  function equals(user: UserType): boolean {
    return user.id === userData.id
      && user.orgId === userData.orgId;
  }

  return {
    createAuthToken,
    deleteKeyPair,
    equals,
    org,
    publicKeyId,
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
