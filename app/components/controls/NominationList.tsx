import React, { useCallback, useMemo } from 'react';
import {
  Alert, ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import {
  GENERIC_ERROR_MESSAGE, Nomination, getOffice, isDefined,
  nominationsTimeRemainingExpiredFormatter, nominationsTimeRemainingFormatter,
  useCurrentUser, useNominations,
} from '../../model';
import { useBallot, usePullToRefresh } from '../hooks';
import NominationRow, { NonPendingNomination } from './NominationRow';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import TimeRemainingFooter from './TimeRemainingFooter';
import { updateNomination } from '../../networking';

const ERROR_ALERT_TITLE = 'Failed to accept or decline nomination. Please try again.';

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
    acceptedNominations, declinedNominations, pendingNominations,
  } = useNominations(ballot);
  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected current user'); }

  const onNominationUpdated = useCallback(
    async (updatedNomination: NonPendingNomination) => {
      if (!ballot) { return; }

      // Optimistically cache the updatedNomination on the ballot
      cacheBallot({
        ...ballot,
        nominations: ballot.nominations?.map((n) => (
          n.id === updatedNomination.id ? updatedNomination : n
        )),
      });

      const jwt = await currentUser.createAuthToken({ scope: '*' });

      let errorMessage: string | undefined;
      try {
        ({ errorMessage } = await updateNomination({
          accepted: updatedNomination.accepted,
          jwt,
          id: updatedNomination.id,
        }));
      } catch (error) {
        errorMessage = GENERIC_ERROR_MESSAGE;
      }

      if (errorMessage) {
        // On error, revert the ballot back to what it was before the
        // optimistic caching
        cacheBallot(ballot);
        Alert.alert(ERROR_ALERT_TITLE, errorMessage);
      }
    },
    [ballot, cacheBallot, currentUser],
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Nomination>) => (
    <NominationRow
      currentUserId={currentUser.id}
      item={item}
      onNominationUpdated={onNominationUpdated}
    />
  ), [currentUser.id, onNominationUpdated]);

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
