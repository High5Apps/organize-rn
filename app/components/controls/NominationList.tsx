import React, { useCallback, useMemo } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import {
  Nomination, getOffice, isDefined, nominationsTimeRemainingExpiredFormatter,
  nominationsTimeRemainingFormatter, useCurrentUser, useNominations,
} from '../../model';
import { useBallot, usePullToRefresh } from '../hooks';
import NominationRow from './NominationRow';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import TimeRemainingFooter from './TimeRemainingFooter';

type NominationSection = {
  title: string;
  data: Nomination[];
};

type Props = {
  ballotId: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function NominationList({
  ballotId, contentContainerStyle,
}: Props) {
  const { ballot, cacheBallot, updateBallot } = useBallot(ballotId);
  const {
    acceptedNominations, acceptOrDeclineNomination, declinedNominations,
    pendingNominations,
  } = useNominations(ballot, cacheBallot);
  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected current user'); }

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Nomination>) => (
    <NominationRow
      currentUserId={currentUser.id}
      item={item}
      onNominationUpdated={acceptOrDeclineNomination}
    />
  ), [currentUser.id, acceptOrDeclineNomination]);

  const ListEmptyComponent = useMemo(() => {
    if (!ballot?.office) { return null; }
    const officeTitle = getOffice(ballot.office).title;
    return (
      <ListEmptyMessage
        asteriskDelimitedMessage={`Be the first to **nominate a candidate** for ${officeTitle}.\n\nTap the button below to get started!`}
      />
    );
  }, [ballot?.office]);

  const ListFooterComponent = useMemo(() => {
    if (!ballot?.nominationsEndAt) { return null; }
    return (
      <TimeRemainingFooter
        endTime={ballot.nominationsEndAt}
        timeRemainingOptions={{
          expiredFormatter: nominationsTimeRemainingExpiredFormatter,
          formatter: nominationsTimeRemainingFormatter,
        }}
      />
    );
  }, [ballot?.nominationsEndAt]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: updateBallot,
    refreshOnMount: true,
  });

  const sections: NominationSection[] = useMemo(() => (
    [
      { title: 'Accepted by nominee', data: acceptedNominations },
      { title: 'Sent to nominee', data: pendingNominations },
      { title: 'Declined by nominee', data: declinedNominations },
    ]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [acceptedNominations, declinedNominations, pendingNominations]);

  return (
    <SectionList
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshControl={refreshControl}
      refreshing={refreshing}
      sections={sections}
      stickySectionHeadersEnabled
    />
  );
}

NominationList.defaultProps = {
  contentContainerStyle: {},
};
