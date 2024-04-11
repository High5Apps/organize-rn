import { useCallback } from 'react';
import { Ballot } from './types';
import useCurrentUser from './CurrentUser';
import { createVote } from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';
import useSelectionUpdater from './SelectionUpdater';

type Props = {
  ballot?: Ballot;
  cacheBallot: (ballot: Ballot) => void;
};

export default function useVoteUpdater({ ballot, cacheBallot }: Props) {
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
      errorMessage = GENERIC_ERROR_MESSAGE;
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
    getSelectionInfo, onNewSelection: onNewCandidateSelection,
  } = useSelectionUpdater({
    initialSelection: ballot?.myVote,
    maxSelections: ballot?.maxCandidateIdsPerVote,
    onSyncSelection,
    options: ballot?.candidates.map(({ id }) => id),
  });

  return { getSelectionInfo, onNewCandidateSelection };
}
