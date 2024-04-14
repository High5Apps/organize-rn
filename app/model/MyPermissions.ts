import { useCallback, useState } from 'react';
import { MyPermission, PermissionScope } from './types';
import useCurrentUser from './CurrentUser';
import { fetchMyPermissions } from '../networking';

type Props = {
  scopes: PermissionScope[];
};

export default function useMyPermissions({ scopes }: Props) {
  const [myPermissions, setMyPermissions] = useState<MyPermission[]>();
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

    setMyPermissions(response.myPermissions);
    setReady(true);
  }, [currentUser]);

  const can = useCallback((scope: PermissionScope): boolean => (
    myPermissions?.find(
      (myPermission) => myPermission.scope === scope,
    )?.permitted ?? false
  ), [myPermissions]);

  return { can, ready, refreshMyPermissions };
}
