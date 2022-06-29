import { v4 as uuidv4 } from 'uuid';
import Keys from './Keys';
import type { Org, UserData } from './types';

type Props = {
  id?: string;
  org?: Org;
  orgId: string;
  publicKeyId?: string;
};

export default function User({
  id: initialId, org, orgId, publicKeyId,
}: Props) {
  const userData: UserData = {
    id: initialId || uuidv4(),
    orgId,
  };

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
    deleteKeyPair,
    equals,
    org,
    pseudonym: () => 'Adorable Giraffe',
    publicKeyId,
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
