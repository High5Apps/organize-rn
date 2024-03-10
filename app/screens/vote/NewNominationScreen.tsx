import React from 'react';
import { ScreenBackground, UserList } from '../../components';
import type { NewNominationScreenProps } from '../../navigation';

export default function NewNominationScreen({
  route,
}: NewNominationScreenProps) {
  const { ballotId } = route.params;
  return (
    <ScreenBackground>
      <UserList onItemPress={({ id }) => console.log({ id, ballotId })} />
    </ScreenBackground>
  );
}
