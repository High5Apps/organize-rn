import { useCallback, useEffect, useState } from 'react';
import { Ballot, Candidate, isCurrentUserData } from './types';
import { useUserContext } from './UserContext';
import { createVote } from '../networking';

type Props = {
  ballot?: Ballot;
};

export default function useVoteUpdater({ ballot }: Props) {
  const [
    selectedCandidateIds, setSelectedCandidateIds,
  ] = useState<string[] | undefined>();

  const { currentUser } = useUserContext();

  useEffect(() => {
    if (ballot !== undefined) {
      setSelectedCandidateIds(ballot.myVote);
    }
  }, [ballot?.myVote]);

  const onNewCandidateSelection = useCallback(async ({
    id: candidateId,
  }: Candidate) => {
    if (ballot === undefined || !isCurrentUserData(currentUser)) { return; }

    const { maxCandidateIdsPerVote } = ballot;

    const initialSelectedCandidateIds = selectedCandidateIds;
    let updatedSelectedCandidateIds: string[] | undefined;

    // If only a single selection is allowed, deselect the previous selection
    if (maxCandidateIdsPerVote === 1) {
      if (!selectedCandidateIds?.includes(candidateId)) {
        updatedSelectedCandidateIds = [candidateId];
      }
    } else if (maxCandidateIdsPerVote > 1) {
      // If multiple selection is allowed, toggle candidate inclusion on
      // successive selections
      if (selectedCandidateIds?.includes(candidateId)) {
        updatedSelectedCandidateIds = selectedCandidateIds.filter(
          (cid) => cid !== candidateId,
        );
      } else {
        updatedSelectedCandidateIds = [
          ...(selectedCandidateIds ?? []), candidateId,
        ];
      }
    }

    if (updatedSelectedCandidateIds === undefined) { return; }

    setSelectedCandidateIds(updatedSelectedCandidateIds);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage } = await createVote({
      ballotId: ballot.id,
      candidateIds: updatedSelectedCandidateIds,
      jwt,
    });

    if (errorMessage !== undefined) {
      // On error, revert to the previous selection
      setSelectedCandidateIds(initialSelectedCandidateIds);

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [ballot, selectedCandidateIds]);

  return { onNewCandidateSelection, selectedCandidateIds };
}
