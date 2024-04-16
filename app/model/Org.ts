import { useState } from 'react';
import isEqual from 'react-fast-compare';
import { fetchOrg } from '../networking';
import { Org, OrgGraph } from './types';
import useCurrentUser from './CurrentUser';

export default function useOrg() {
  const [org, setOrg] = useState<Org>();
  const [orgGraph, setOrgGraph] = useState<OrgGraph>();

  const { currentUser, setCurrentUser } = useCurrentUser();

  async function refreshOrg() {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecrypt } = currentUser;
    const {
      errorMessage, org: fetchedOrg, orgGraph: fetchedOrgGraph,
    } = await fetchOrg({ e2eDecrypt, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (!isEqual(orgGraph, fetchedOrgGraph)) {
      setOrgGraph(fetchedOrgGraph);
    }

    if (!isEqual(org, fetchedOrg)) {
      setOrg(fetchedOrg);
      setCurrentUser({ ...currentUser, org: fetchedOrg });
    }
  }

  const nodeCount = (orgGraph?.userIds ?? []).length;
  const hasMultipleNodes = nodeCount > 1;

  return {
    org, orgGraph, hasMultipleNodes, refreshOrg,
  };
}
