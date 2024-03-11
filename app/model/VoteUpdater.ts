import { useCallback, useMemo, useState } from 'react';
import { Ballot, Candidate } from './types';
import useCurrentUser from './CurrentUser';
import { createVote } from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';

type Props = {
  ballot?: Ballot;
  cacheBallot: (ballot: Ballot) => void;
};

function quickDifference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return [...a].filter((value) => !setB.has(value));
}

export default function useVoteUpdater({ ballot, cacheBallot }: Props) {
  const selectedCandidateIds = useMemo(() => ballot?.myVote, [ballot?.myVote]);
  const [
    waitingForSelectedCandidateIds, setWaitingForSelectedCandidateIds,
  ] = useState<string[]>([]);
  const [
    waitingForDeselectedCandidateIds, setWaitingForDeselectedCandidateIds,
  ] = useState<string[]>([]);

  const { currentUser } = useCurrentUser();

  const onNewCandidateSelection = useCallback(async ({
    id: candidateId,
  }: Candidate) => {
    if (ballot === undefined || !currentUser) { return; }

    const { candidates, maxCandidateIdsPerVote } = ballot;

    // Toggle selections when multiple selections are allowed or when there's
    // only a single candidate to choose from
    const shouldToggleSelections = (maxCandidateIdsPerVote > 1)
      || (candidates?.length === 1);

    let updatedSelectedCandidateIds: string[];

    if (shouldToggleSelections) {
      if (selectedCandidateIds?.includes(candidateId)) {
        // Remove candidate when it was previously included
        updatedSelectedCandidateIds = selectedCandidateIds.filter(
          (cid) => cid !== candidateId,
        );
      } else {
        // Add candidate when it wasn't previously included
        updatedSelectedCandidateIds = [
          ...(selectedCandidateIds ?? []), candidateId,
        ];
      }
    } else {
      // Return early when the selection was unchanged
      const wasAlreadySelected = (selectedCandidateIds?.length === 1)
        && (selectedCandidateIds[0] === candidateId);
      if (wasAlreadySelected) { return; }

      // Only include the selected candidate
      updatedSelectedCandidateIds = [candidateId];
    }

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

    const updatedBallot = { ...ballot };
    updatedBallot.myVote = updatedSelectedCandidateIds;
    cacheBallot(updatedBallot);
  }, [ballot, selectedCandidateIds]);

  return {
    onNewCandidateSelection,
    selectedCandidateIds,
    waitingForDeselectedCandidateIds,
    waitingForSelectedCandidateIds,
  };
}
