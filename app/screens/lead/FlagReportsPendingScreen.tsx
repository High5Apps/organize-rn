import React, { useCallback } from 'react';
import { FlagReportList, ScreenBackground } from '../../components';
import type { FlagReportsPendingScreenProps } from '../../navigation';
import { FlagReport } from '../../model';

export default function FlagReportsPendingScreen({
  navigation,
}: FlagReportsPendingScreenProps) {
  const onItemPress = useCallback((flagReport: FlagReport) => {
    const { flaggable: { category }, id } = flagReport;

    if (category === 'Ballot') {
      navigation.navigate('VoteStack', {
        screen: 'Ballot', initial: false, params: { ballotId: id },
      });
    } else if (category === 'Post') {
      navigation.navigate('DiscussStack', {
        screen: 'Post', initial: false, params: { postId: id },
      });
    } else {
      console.log({ flagReport });
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <FlagReportList handled={false} onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
