import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import {
  Ballot, Nomination, NonPendingNomination, isDefined,
} from './types';
import { UpdateNominationResponse, updateNomination } from '../networking';
import useCurrentUser from './CurrentUser';
import { getErrorMessage } from './Errors';

const ERROR_ALERT_TITLE = 'Failed to accept or decline nomination. Please try again.';

const isNominator = (currentUserId: string, nomination: Nomination) => (
  nomination.nominator.id === currentUserId
);
const isNominee = (currentUserId: string, nomination: Nomination) => (
  nomination.nominee.id === currentUserId
);

type Props = {
  currentUserId: string,
  nominations: Nomination[],
  replacing?: Nomination,
};

// Reorder so that the current user's nomination is first if it exists, followed
// by any nominations created by the current user, followed by the rest
function reorderNominations({ currentUserId, nominations, replacing }: Props) {
  const nomineeNomination = nominations.find(
    (nomination) => isNominee(currentUserId, nomination),
  );
  const nominatorNominations = nominations.filter(
    (nomination) => isNominator(currentUserId, nomination),
  );
  const otherNominations = nominations.filter(
    (nomination) => (
      !isNominee(currentUserId, nomination)
        && !isNominator(currentUserId, nomination)
    ),
  );

  const reorderedNominations = [
    nomineeNomination, ...nominatorNominations, ...otherNominations,
  ].filter(isDefined);

  if (!replacing) {
    return reorderedNominations;
  }

  return reorderedNominations.map((nomination) => (
    nomination.id === replacing.id ? replacing : nomination
  ));
}

export default function useNominations(
  ballot: Ballot | undefined,
  cacheBallot: (ballot: Ballot) => void,
) {
  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected current user'); }

  const {
    acceptedNominations, declinedNominations, pendingNominations,
  } = useMemo(() => {
    if (!ballot?.nominations) {
      return {
        acceptedNominations: [],
        declinedNominations: [],
        pendingNominations: [],
      };
    }

    const reorderedNominations = reorderNominations({
      currentUserId: currentUser.id, nominations: ballot.nominations,
    });

    return {
      acceptedNominations: reorderedNominations.filter(
        (nomination) => nomination.accepted,
      ),
      declinedNominations: reorderedNominations.filter(
        (nomination) => nomination.accepted === false,
      ),
      pendingNominations: reorderedNominations.filter(
        (nomination) => nomination.accepted === null,
      ),
    };
  }, [ballot?.nominations]);

  const acceptOrDeclineNomination = useCallback(
    async (updatedNomination: NonPendingNomination) => {
      if (!ballot?.nominations) { return; }

      // Optimistically cache the updatedNomination on the ballot
      cacheBallot({
        ...ballot,
        nominations: reorderNominations({
          currentUserId: currentUser.id,
          nominations: ballot.nominations,
          replacing: updatedNomination,
        }),
      });

      const jwt = await currentUser.createAuthToken({ scope: '*' });

      let errorMessage: string | undefined;
      let response: UpdateNominationResponse | undefined;
      try {
        ({ errorMessage, response } = await updateNomination({
          accepted: updatedNomination.accepted,
          jwt,
          id: updatedNomination.id,
        }));
      } catch (error) {
        errorMessage = getErrorMessage(error);
      }

      if (errorMessage) {
        // On error, revert the ballot back to what it was before the
        // optimistic caching
        cacheBallot(ballot);
        Alert.alert(ERROR_ALERT_TITLE, errorMessage);
      } else if (response?.candidate.id) {
        // Cache the newly created candidate on the nomination
        cacheBallot({
          ...ballot,
          nominations: reorderNominations({
            currentUserId: currentUser.id,
            nominations: ballot.nominations,
            replacing: {
              ...updatedNomination,
              candidate: {
                id: response.candidate.id,
                userId: currentUser.id,
                title: currentUser.pseudonym,
              },
            },
          }),
        });
      }
    },
    [ballot, cacheBallot, currentUser],
  );

  return {
    acceptedNominations,
    acceptOrDeclineNomination,
    declinedNominations,
    pendingNominations,
  };
}
