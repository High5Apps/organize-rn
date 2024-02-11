import React, { useCallback } from 'react';
import { BallotTypeList, ScreenBackground } from '../../components';
import type { BallotTypeScreenProps } from '../../navigation';
import { BallotType, ballotTypeMap } from '../../model';

export default function BallotTypeScreen({
  navigation,
}: BallotTypeScreenProps) {
  const onBallotTypeRowPress = useCallback(({ category }: BallotType) => {
    const {
      newScreenName, subtypeSelectionScreenName,
    } = ballotTypeMap[category];
    const screen = subtypeSelectionScreenName ?? newScreenName;

    // @ts-ignore because params are only required for screens that use a
    // subtypeSelectionScreen first to determine the relevant params, instead of
    // navigating directly to the newScreen
    navigation.navigate(screen);
  }, [navigation]);

  return (
    <ScreenBackground>
      <BallotTypeList onBallotTypeRowPress={onBallotTypeRowPress} />
    </ScreenBackground>
  );
}
