import { useMemo } from 'react';
import { Ballot } from './types';

export default function useNominations(ballot?: Ballot) {
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

  return { acceptedNominations, declinedNominations, pendingNominations };
}
