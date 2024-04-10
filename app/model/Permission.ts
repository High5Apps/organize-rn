import { useState } from 'react';
import isEqual from 'react-fast-compare';
import { Permission, PermissionScope } from './types';
import useCurrentUser from './CurrentUser';
import { fetchPermission } from '../networking';

type Props = {
  scope: PermissionScope;
};

export default function usePermission({ scope }: Props) {
  const [permission, setPermission] = useState<Permission>();
  const { currentUser } = useCurrentUser();

  async function refreshPermission() {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, permission: fetchedPermission,
    } = await fetchPermission({ scope, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (!isEqual(permission, fetchedPermission)) {
      setPermission(fetchedPermission);
    }
  }

  return { permission, refreshPermission };
}
