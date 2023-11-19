import { useMemo, useState } from 'react';
import useModelCache, { getIdsFrom } from './ModelCache';
import { Candidate, isCurrentUserData, isDefined } from './types';
import { useUserContext } from './UserContext';
import { fetchCandidates } from '../networking';

export default function useCandidates(ballotId: string) {
  // Note that this cache is only accessible to this instance of useCandidates,
  // i.e. it doesn't use any app-wide context. It isn't technically needed but
  // makes it easier to transition to using an app-wide context later if needed.
  const {
    cacheModels: cacheCandidates, getCachedModel: getCachedCandidate,
  } = useModelCache<Candidate>();

  const [candidateIds, setCandidateIds] = useState<string[]>([]);
  const candidates = useMemo(
    () => candidateIds.map(getCachedCandidate).filter(isDefined),
    [candidateIds, getCachedCandidate],
  );
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function updateCandidates() {
    if (!isCurrentUserData(currentUser) || !ballotId) { return; }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, candidates: fetchedCandidates,
    } = await fetchCandidates({ e2eDecryptMany, jwt, ballotId });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheCandidates(fetchedCandidates);
    setCandidateIds(getIdsFrom(fetchedCandidates));
    setReady(true);
  }

  return { candidates, ready, updateCandidates };
}
