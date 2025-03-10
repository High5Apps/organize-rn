import { useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useCurrentUser } from './context';
import { fetchOrgGraph, OrgGraph } from '../networking';

export default function useOrgGraph() {
  const [orgGraph, setOrgGraph] = useState<OrgGraph>();

  const { currentUser } = useCurrentUser();

  const refreshOrgGraph = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, orgGraph: fetchedOrgGraph,
    } = await fetchOrgGraph({ jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (!isEqual(orgGraph, fetchedOrgGraph)) {
      setOrgGraph(fetchedOrgGraph);
    }
  }, [currentUser, orgGraph]);

  const nodeCount = (orgGraph?.userIds ?? []).length;
  const hasMultipleNodes = nodeCount > 1;

  return { orgGraph, hasMultipleNodes, refreshOrgGraph };
}
