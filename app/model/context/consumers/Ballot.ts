import { useCallback, useMemo } from 'react';
import {
  createNomination as _createNomination, createTerm, fetchBallot,
} from '../../../networking';
import { useBallotContext } from '../providers';
import useCurrentUser from './CurrentUser';
import type { Ballot, Nomination, Result } from '../../types';
import getErrorMessage from '../../ErrorMessage';

type CreateNominationProps = {
  nomineeId: string;
  nomineePseudonym: string;
};

type UpdateResultProps = {
  updatedResult: Result;
};

export default function useBallot(ballotId: string) {
  const { cacheBallot, getCachedBallot } = useBallotContext();

  const ballot = useMemo(
    () => getCachedBallot(ballotId),
    [ballotId, getCachedBallot],
  );

  const { currentUser } = useCurrentUser();

  const createNomination = useCallback(async ({
    nomineeId, nomineePseudonym,
  }: CreateNominationProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }
    if (!ballot) { throw new Error('Expected ballot to be cached'); }

    let errorMessage: string | undefined;
    let nominationId: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      ({ id: nominationId, errorMessage } = await _createNomination({
        ballotId, jwt, nomineeId,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const nomination: Nomination = {
      accepted: null,
      id: nominationId!,
      nominator: {
        id: currentUser.id,
        pseudonym: currentUser.pseudonym,
      },
      nominee: {
        id: nomineeId,
        pseudonym: nomineePseudonym,
      },
    };
    const updatedBallot = { ...ballot };
    updatedBallot.nominations = [nomination, ...(ballot.nominations ?? [])];
    cacheBallot(updatedBallot);
    return nomination;
  }, [ballot, currentUser]);

  const refreshBallot = useCallback(async () => {
    if (!currentUser) { return; }
    const { createAuthToken, e2eDecrypt, e2eDecryptMany } = currentUser;

    const jwt = await createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let fetchedBallot: Ballot | undefined;
    try {
      ({ ballot: fetchedBallot, errorMessage } = await fetchBallot({
        ballotId, e2eDecrypt, e2eDecryptMany, jwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else if (fetchedBallot) {
      cacheBallot(fetchedBallot);
    }
  }, [ballotId, currentUser]);

  const updateResultOptimistically = useCallback(async ({
    updatedResult,
  }: UpdateResultProps) => {
    if (!ballot || !currentUser || updatedResult.acceptedOffice === undefined) {
      return;
    }

    // Optimistically cache the updated ballot. Note there's no need to update
    // currentUser.offices because the term cannot have started yet.
    cacheBallot({
      ...ballot,
      results: ballot.results?.map((result) => (
        (result.candidate.id !== updatedResult.candidate.id)
          ? result : updatedResult)),
    });

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    try {
      ({ errorMessage } = await createTerm({
        accepted: updatedResult.acceptedOffice, ballotId: ballot.id, jwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage) {
      // On error, revert ballot back to what it was before the optimistic
      // update
      cacheBallot(ballot);

      throw new Error(errorMessage);
    }
  }, [ballot, currentUser]);

  return {
    ballot,
    cacheBallot,
    createNomination,
    getCachedBallot,
    refreshBallot,
    updateResultOptimistically,
  };
}
