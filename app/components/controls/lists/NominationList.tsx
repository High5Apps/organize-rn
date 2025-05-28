import React, { useCallback, useMemo } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import {
  Nomination, getOffice, isDefined, nominationsTimeRemainingExpiredFormatter,
  nominationsTimeRemainingFormatter, useCurrentUser, useBallot, useNominations,
} from '../../../model';
import { NominationRow } from './rows';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import useTimeRemainingFooter from '../TimeRemainingFooter';
import type { AnnounceButtonType, DiscussButtonType } from '../buttons';
import usePullToRefresh from './PullToRefresh';
import { renderSectionHeader } from '../SectionHeader';
import { useTranslation } from '../../../i18n';

type NominationSection = {
  title: string;
  data: Nomination[];
};

type Props = {
  AnnounceButton: AnnounceButtonType;
  ballotId: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  DiscussButton: DiscussButtonType;
};

export default function NominationList({
  AnnounceButton, ballotId, contentContainerStyle = {}, DiscussButton,
}: Props) {
  const { ballot, cacheBallot, refreshBallot } = useBallot(ballotId);
  const {
    acceptedNominations, acceptOrDeclineNomination, declinedNominations,
    pendingNominations,
  } = useNominations(ballot, cacheBallot);
  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected current user'); }

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Nomination>) => (
    <NominationRow
      AnnounceButton={AnnounceButton}
      currentUserId={currentUser.id}
      DiscussButton={DiscussButton}
      item={item}
      onNominationUpdated={acceptOrDeclineNomination}
    />
  ), [
    acceptOrDeclineNomination, AnnounceButton, currentUser.id, DiscussButton,
  ]);

  const { t } = useTranslation();

  const ListEmptyComponent = useMemo(() => {
    if (!ballot?.office) { return null; }
    const officeTitle = getOffice(ballot.office).title;
    return (
      <ListEmptyMessage
        asteriskDelimitedMessage={t('hint.emptyNominations', { officeTitle })}
      />
    );
  }, [ballot?.office, t]);

  const { TimeRemainingFooter, refreshTimeRemaining } = useTimeRemainingFooter();
  const ListFooterComponent = useMemo(() => (
    <TimeRemainingFooter
      endTime={ballot?.nominationsEndAt}
      timeRemainingOptions={{
        expiredFormatter: nominationsTimeRemainingExpiredFormatter,
        formatter: nominationsTimeRemainingFormatter,
      }}
    />
  ), [ballot?.nominationsEndAt, TimeRemainingFooter]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      await refreshBallot();
      refreshTimeRemaining();
    },
    refreshOnMount: true,
  });

  const sections: NominationSection[] = useMemo(() => (
    [
      { title: t('hint.nomination.accepted'), data: acceptedNominations },
      { title: t('hint.nomination.sent'), data: pendingNominations },
      { title: t('hint.nomination.declined'), data: declinedNominations },
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
