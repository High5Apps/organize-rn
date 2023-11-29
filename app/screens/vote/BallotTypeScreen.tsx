import React, { useCallback } from 'react';
import { BallotTypeList, ScreenBackground } from '../../components';
import type { BallotTypeScreenProps } from '../../navigation';
import { BallotType, ballotTypeMap } from '../../model';

export default function BallotTypeScreen({
  navigation,
}: BallotTypeScreenProps) {
  const onBallotTypeRowPress = useCallback(({ category }: BallotType) => {
    const { newScreenName: screen } = ballotTypeMap[category];
    navigation.navigate(screen);
  }, [navigation]);

  return (
    <ScreenBackground>
      <BallotTypeList onBallotTypeRowPress={onBallotTypeRowPress} />
    </ScreenBackground>
  );
}
