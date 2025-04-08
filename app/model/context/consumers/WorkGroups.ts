import { useState } from 'react';
import { WorkGroup } from '../../types';
import useCurrentUser from './CurrentUser';
import { fetchWorkGroups } from '../../../networking';
import { useWorkGroupContext } from '../providers';
import useModels, { getIdsFrom } from './Models';

export default function useWorkGroups() {
  const {
    cacheWorkGroup, cacheWorkGroups, getCachedWorkGroup,
  } = useWorkGroupContext();
  const {
    models: workGroups, setIds: setWorkGroupIds,
  } = useModels<WorkGroup>({ getCachedModel: getCachedWorkGroup });
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function refreshWorkGroups() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, workGroups: fetchedWorkGroups,
    } = await fetchWorkGroups({ e2eDecryptMany, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheWorkGroups(fetchedWorkGroups);

    // Sort alphabetically by jobTitle, then by shift, then by department with
    // ones lacking departments first, then by member count, then finally by id
    // to ensure the sort is stable even if all other fields were equal.
    const sortedWorkGroups = fetchedWorkGroups.sort((wg1, wg2) => (
      wg1.jobTitle.localeCompare(wg2.jobTitle)
        || wg1.shift.localeCompare(wg2.shift)
        || (wg1.department ?? '').localeCompare(wg2.department ?? '')
        || (wg1.memberCount - wg2.memberCount)
        || wg1.id.localeCompare(wg2.id)
    ));

    setWorkGroupIds(getIdsFrom(sortedWorkGroups));
    setReady(true);
  }

  return {
    cacheWorkGroup,
    cacheWorkGroups,
    getCachedWorkGroup,
    ready,
    refreshWorkGroups,
    workGroups,
  };
}
