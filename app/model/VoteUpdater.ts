import { useCallback, useEffect, useState } from 'react';
import { Ballot, Candidate, isCurrentUserData } from './types';
import { useUserContext } from './UserContext';
import { createVote } from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';

type Props = {
  ballot?: Ballot;
};

function quickDifference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return [...a].filter((value) => !setB.has(value));
}

export default function useVoteUpdater({ ballot }: Props) {
  const [
    selectedCandidateIds, setSelectedCandidateIds,
  ] = useState<string[] | undefined>();
  const [
    waitingForSelectedCandidateIds, setWaitingForSelectedCandidateIds,
  ] = useState<string[]>([]);
  const [
    waitingForDeselectedCandidateIds, setWaitingForDeselectedCandidateIds,
  ] = useState<string[]>([]);

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

    setWaitingForDeselectedCandidateIds(
      quickDifference(selectedCandidateIds ?? [], updatedSelectedCandidateIds),
    );
    setWaitingForSelectedCandidateIds(
      quickDifference(updatedSelectedCandidateIds, selectedCandidateIds ?? []),
    );

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage;
    try {
      ({ errorMessage } = await createVote({
        ballotId: ballot.id,
        candidateIds: updatedSelectedCandidateIds,
        jwt,
      }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    setWaitingForSelectedCandidateIds([]);
    setWaitingForDeselectedCandidateIds([]);

    if (errorMessage !== undefined) {
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    setSelectedCandidateIds(updatedSelectedCandidateIds);
  }, [ballot, selectedCandidateIds]);

  return {
    onNewCandidateSelection,
    selectedCandidateIds,
    waitingForDeselectedCandidateIds,
    waitingForSelectedCandidateIds,
  };
}
