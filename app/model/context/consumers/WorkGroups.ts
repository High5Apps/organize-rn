import { useState } from 'react';
import { WorkGroup } from '../../types';
import useCurrentUser from './CurrentUser';
import { fetchWorkGroups } from '../../../networking';
import { useWorkGroupContext } from '../providers';
import useModels, { getIdsFrom } from './Models';
import useUnionCard from './UnionCard';

type Props = {
  includeLocalOnlyWorkGroups?: boolean;
};

export default function useWorkGroups({
  includeLocalOnlyWorkGroups,
}: Props = {}) {
  const {
    cacheWorkGroup, cacheWorkGroups, getCachedWorkGroup,
  } = useWorkGroupContext();
  const {
    models: workGroups, setIds: setWorkGroupIds,
  } = useModels<WorkGroup>({ getCachedModel: getCachedWorkGroup });
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();
  const { unionCard } = useUnionCard();

  async function refreshWorkGroups() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    setLoading(true);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, workGroups: fetchedWorkGroups,
    } = await fetchWorkGroups({ e2eDecryptMany, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheWorkGroups(fetchedWorkGroups);

    if (includeLocalOnlyWorkGroups) {
      // If the user locally added a workgroup but hasn't signed yet, the
      // locally added work group won't be included in the fetched work groups,
      // so it must be added manually.
      const unionCardWorkGroupId = unionCard?.workGroupId ?? undefined;
      if (!fetchedWorkGroups.find(({ id }) => id === unionCardWorkGroupId)) {
        const locallyAddedWorkGroup = getCachedWorkGroup(unionCardWorkGroupId);
        if (locallyAddedWorkGroup) {
          fetchedWorkGroups.push(locallyAddedWorkGroup);
        }
      }
    }

    // Sort alphabetically by jobTitle, then by shift, then by department with
    // ones lacking departments first, then by most members, then finally by id
    // to ensure the sort is stable even if all other fields were equal.
    const sortedWorkGroups = fetchedWorkGroups.sort((wg1, wg2) => (
      wg1.jobTitle.localeCompare(wg2.jobTitle)
        || wg1.shift.localeCompare(wg2.shift)
        || (wg1.department ?? '').localeCompare(wg2.department ?? '')
        || (wg2.memberCount - wg1.memberCount)
        || wg1.id.localeCompare(wg2.id)
    ));

    setWorkGroupIds(getIdsFrom(sortedWorkGroups));
    setLoading(false);
    setReady(true);
  }

  return {
    cacheWorkGroup,
    cacheWorkGroups,
    getCachedWorkGroup,
    loading,
    ready,
    refreshWorkGroups,
    workGroups,
  };
}
