import React, { useCallback } from 'react';
import { BallotTypeList, ScreenBackground } from '../../components';
import type { BallotTypeScreenProps } from '../../navigation';
import { BallotType } from '../../model';

type NavigationTarget =
  'OfficeAvailability' | 'NewMultipleChoiceBallot' | 'NewYesOrNoBallot';

export default function BallotTypeScreen({
  navigation,
}: BallotTypeScreenProps) {
  const onBallotTypeRowPress = useCallback(({ category }: BallotType) => {
    let screen: NavigationTarget;
    if (category === 'election') {
      screen = 'OfficeAvailability';
    } else if (category === 'multiple_choice') {
      screen = 'NewMultipleChoiceBallot';
    } else if (category === 'yes_no') {
      screen = 'NewYesOrNoBallot';
    } else {
      throw new Error(`Unhandled ballot category: ${category}`);
    }
    navigation.navigate(screen);
  }, [navigation]);

  return (
    <ScreenBackground>
      <BallotTypeList onBallotTypeRowPress={onBallotTypeRowPress} />
    </ScreenBackground>
  );
}
