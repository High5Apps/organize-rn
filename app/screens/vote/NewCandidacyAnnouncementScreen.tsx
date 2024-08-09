import React, { useCallback } from 'react';
import { useBallot } from '../../components';
import type { NewCandidacyAnnouncementScreenProps } from '../../navigation';
import { getOffice, type Post } from '../../model';
import { NewPostScreenBase } from '../discuss';

export default function NewCandidacyAnnouncementScreen({
  navigation, route,
}: NewCandidacyAnnouncementScreenProps) {
  const {
    ballotId, candidateId,
  } = route.params ?? {};
  const { ballot, cacheBallot } = useBallot(ballotId);
  if (ballot?.category !== 'election') {
    throw new Error('Expected election to be cached');
  }

  const nomination = ballot.nominations?.find(
    ({ candidate }) => candidateId === candidate?.id,
  );
  if (!nomination) { throw new Error('Expected nomination to have candidate'); }

  const { pseudonym } = nomination.nominee;
  const officeTitle = getOffice(ballot.office).title;
  const title = `${pseudonym} is running for ${officeTitle}`;

  const onPostCreated = useCallback((post: Post) => {
    const updatedNomination = { ...nomination };
    updatedNomination.candidate!.postId = post.id;
    cacheBallot({
      ...ballot,
      nominations: ballot.nominations?.map(
        (n) => ((n.id === nomination.id) ? updatedNomination : n),
      ),
    });
    navigation.goBack();
  }, [ballot, navigation]);

  return (
    <NewPostScreenBase
      candidateId={candidateId}
      initialCategory="general"
      initialPostTitle={title}
      onPostCreated={onPostCreated}
    />
  );
}
