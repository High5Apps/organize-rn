import React from 'react';
import { ModerationItemList, ScreenBackground } from '../../components';

export default function ModerationScreen() {
  return (
    <ScreenBackground>
      <ModerationItemList onModerationItemPress={console.log} />
    </ScreenBackground>
  );
}
