import { v4 as uuidv4 } from 'uuid';
import type { UserData } from './types';

type Props = {
  id?: string;
  orgId: string;
};

export default function User({
  id: initialId,
  orgId,
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
    pseudonym: () => 'Adorable Giraffe',
    ...userData,
  };
}

export type UserType = ReturnType<typeof User>;
