import { useCallback } from 'react';
import { Ballot } from './types';
import { useCurrentUser } from './context';
import { createVote } from '../networking';
import getErrorMessage from './ErrorMessage';
import useSelectionUpdater from './SelectionUpdater';

type Props = {
  ballot?: Ballot;
  cacheBallot: (ballot: Ballot) => void;
  onSyncSelectionError: (errorMessage: string) => void;
};

export default function useVoteUpdater({
  ballot, cacheBallot, onSyncSelectionError,
}: Props) {
  const { currentUser } = useCurrentUser();

  const onSyncSelection = useCallback(async (candidateIds: string[]) => {
    if (!ballot || !currentUser) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage;
    try {
      ({ errorMessage } = await createVote({
        ballotId: ballot.id,
        candidateIds,
        jwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const updatedBallot = { ...ballot };
    updatedBallot.myVote = candidateIds;
    cacheBallot(updatedBallot);
  }, [ballot, cacheBallot, currentUser]);

  const {
    getSelectionInfo, onRowPressed,
  } = useSelectionUpdater({
    choices: ballot?.candidates.map(({ id }) => id),
    initialSelection: ballot?.myVote,
    maxSelections: ballot?.maxCandidateIdsPerVote,
    onSyncSelection,
    onSyncSelectionError,
  });

  return { getSelectionInfo, onRowPressed };
}
