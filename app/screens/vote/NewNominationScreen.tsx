import React from 'react';
import { ScreenBackground, UserList } from '../../components';

export default function NewNominationScreen() {
  return (
    <ScreenBackground>
      <UserList onItemPress={console.log} />
    </ScreenBackground>
  );
}
