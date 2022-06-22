import { v4 as uuidv4 } from 'uuid';
import type { Org, UserData } from './types';

type Props = {
  id?: string;
  org?: Org;
  orgId: string;
};

export default function User({
  id: initialId, org, orgId,
}: Props) {
  const userData: UserData = {
    id: initialId || uuidv4(),
    orgId,
  };

  function equals(user: UserType): boolean {
    return user.id === userData.id
      && user.orgId === userData.orgId;
  }

  return {
    equals,
    org,
    pseudonym: () => 'Adorable Giraffe',
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
