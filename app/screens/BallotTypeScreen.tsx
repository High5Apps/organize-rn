import React, { useCallback } from 'react';
import { BallotTypeList, ScreenBackground } from '../components';
import type { BallotTypeScreenProps, VoteStackParamList } from '../navigation';
import { BallotType } from '../model';

export default function BallotTypeScreen({
  navigation,
}: BallotTypeScreenProps) {
  const onBallotTypeRowPress = useCallback(({ category }: BallotType) => {
    let screen: keyof VoteStackParamList;
    if (category === 'yesOrNo') {
      screen = 'NewYesOrNoBallot';
    } else {
      console.warn('Unhandled BallotCategory');
      return;
    }
    navigation.navigate(screen);
  }, [navigation]);

  return (
    <ScreenBackground>
      <BallotTypeList onBallotTypeRowPress={onBallotTypeRowPress} />
    </ScreenBackground>
  );
}
