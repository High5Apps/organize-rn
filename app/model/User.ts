import { v4 as uuidv4 } from 'uuid';
import { fakePseudonym } from './FakeQRCodeData';
import JWT from './JWT';
import Keys from './Keys';
import type { Org, UserData } from './types';

export const defaultAuthTokenTTLSeconds = 60;

type Props = {
  id?: string;
  org?: Org;
  orgId: string;
  publicKeyId?: string;
};

type CreateAuthTokenProps = {
  currentTime?: number;
  timeToLiveSeconds?: number;
};

export default function User({
  id: initialId, org, orgId, publicKeyId,
}: Props) {
  const userData: UserData = {
    id: initialId || uuidv4(),
    orgId,
    pseudonym: fakePseudonym,
  };

  async function createAuthToken({
    currentTime: maybeCurrentTime, timeToLiveSeconds: maybeTTL,
  }: CreateAuthTokenProps | undefined = {}): Promise<string> {
    if (!publicKeyId) {
      throw new Error('Can only create auth token for users with a key pair');
    }

    const currentTime = maybeCurrentTime ?? new Date().getTime();
    const timeToLiveSeconds = maybeTTL ?? defaultAuthTokenTTLSeconds;

    const signer = (
      { message }: { message: string },
    ) => Keys().rsa.sign({ message, publicKeyId });

    const expirationSecondsSinceEpoch = (
      (currentTime / 1000) + timeToLiveSeconds
    );

    const jwt = JWT({
      expirationSecondsSinceEpoch,
      signer,
      subject: userData.id,
    });
    const jwtString = await jwt.toString();
    return jwtString;
  }

  async function deleteKeyPair() {
    let succeeded = false;

    if (publicKeyId) {
      succeeded = await Keys().rsa.delete(publicKeyId);
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
