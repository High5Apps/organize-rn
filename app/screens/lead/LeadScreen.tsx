import React, { useCallback } from 'react';
import { LeadItem, LeadItemList, ScreenBackground } from '../../components';
import type { LeadScreenProps } from '../../navigation';

export default function LeadScreen({ navigation }: LeadScreenProps) {
  const onLeadItemPress = useCallback(({ destination }: LeadItem) => {
    navigation.navigate(destination);
  }, [navigation]);

  return (
    <ScreenBackground>
      <LeadItemList onLeadItemPress={onLeadItemPress} />
    </ScreenBackground>
  );
}
