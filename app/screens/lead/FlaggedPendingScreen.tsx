import React from 'react';
import { FlaggedItemList, ScreenBackground } from '../../components';

export default function FlaggedPendingScreen() {
  return (
    <ScreenBackground>
      <FlaggedItemList onItemPress={console.log} />
    </ScreenBackground>
  );
}
