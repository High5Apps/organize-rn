import React from 'react';
import { ScreenBackground, UserPreviewList } from '../../components';

export default function NewNominationScreen() {
  return (
    <ScreenBackground>
      <UserPreviewList onItemPress={console.log} />
    </ScreenBackground>
  );
}
