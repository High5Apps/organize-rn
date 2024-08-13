import { useCallback, useMemo, useState } from 'react';
import { PermissionScope, isDefined } from './types';
import useCurrentUser from './CurrentUser';
import { fetchMyPermissions } from '../networking';
import { useMyPermissionContext } from './context';

type Props = {
  scopes: PermissionScope[];
};

export default function useMyPermissions({ scopes }: Props) {
  const {
    cacheMyPermissions, getCachedMyPermission,
  } = useMyPermissionContext();

  const myPermissions = useMemo(
    () => scopes.map(getCachedMyPermission).filter(isDefined),
    [getCachedMyPermission],
  );

  const [ready, setReady] = useState(false);

  const { currentUser } = useCurrentUser();

  const refreshMyPermissions = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, response,
    } = await fetchMyPermissions({ scopes, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheMyPermissions(response.myPermissions);
    setReady(true);
  }, [currentUser]);

  const can = useCallback((scope: PermissionScope): boolean => (
    myPermissions.find(
      (myPermission) => myPermission.scope === scope,
    )?.permitted ?? false
  ), [myPermissions]);

  return { can, ready, refreshMyPermissions };
}
