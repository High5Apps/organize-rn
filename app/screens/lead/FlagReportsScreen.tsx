import React, { useCallback } from 'react';
import type {
  FlagReportTabsParamList, FlagReportTabsScreenProps,
} from '../../navigation';
import { FlagReport } from '../../model';
import { FlagReportList, ScreenBackground } from '../../components';

type Props<T extends keyof FlagReportTabsParamList> = {
  handled: boolean;
  navigation: FlagReportTabsScreenProps<T>['navigation'];
};

export default function FlagReportsScreen<
  T extends keyof FlagReportTabsParamList,
>({ handled, navigation }: Props<T>) {
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
    } else if (category === 'Comment') {
      navigation.navigate('DiscussStack', {
        screen: 'CommentThread', initial: false, params: { commentId: id },
      });
    } else {
      console.warn('WARNING: Unexpected FlagReport category');
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <FlagReportList handled={handled} onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
