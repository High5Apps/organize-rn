import React, { useCallback } from 'react';
import {
  ModerationItem, ModerationItemList, ScreenBackground,
} from '../../components';
import type { ModerationScreenProps } from '../../navigation';

export default function ModerationScreen({
  navigation,
}: ModerationScreenProps) {
  const onModerationItemPress = useCallback(
    ({ destination }: ModerationItem) => navigation.navigate(destination),
    [navigation],
  );

  return (
    <ScreenBackground>
      <ModerationItemList onModerationItemPress={onModerationItemPress} />
    </ScreenBackground>
  );
}
