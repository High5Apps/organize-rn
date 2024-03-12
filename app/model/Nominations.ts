import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Ballot, NonPendingNomination } from './types';
import { updateNomination } from '../networking';
import useCurrentUser from './CurrentUser';
import { GENERIC_ERROR_MESSAGE } from './Errors';

const ERROR_ALERT_TITLE = 'Failed to accept or decline nomination. Please try again.';

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
    const { nominations } = ballot;
    return {
      acceptedNominations: nominations.filter((n) => n.accepted),
      declinedNominations: nominations.filter((n) => n.accepted === false),
      pendingNominations: nominations.filter((n) => n.accepted === null),
    };
  }, [ballot?.nominations]);

  const acceptOrDeclineNomination = useCallback(
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

  return {
    acceptedNominations,
    acceptOrDeclineNomination,
    declinedNominations,
    pendingNominations,
  };
}
