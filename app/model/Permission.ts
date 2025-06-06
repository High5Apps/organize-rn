import { useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { OfficeCategory, Permission, PermissionScope } from './types';
import { useCurrentUser } from './context';
import { createPermission, fetchPermission } from '../networking';

type Props = {
  scope: PermissionScope;
};

export default function usePermission({ scope }: Props) {
  const [permission, setPermission] = useState<Permission>();
  const [ready, setReady] = useState(false);
  const { currentUser } = useCurrentUser();

  const refreshPermission = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, permission: fetchedPermission,
    } = await fetchPermission({ scope, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    setReady(true);

    if (!isEqual(permission, fetchedPermission)) {
      setPermission(fetchedPermission);
    }
  }, [currentUser, permission]);

  const updatePermission = useCallback(
    async ({ offices }: { offices: OfficeCategory[] }) => {
      if (!permission) { throw new Error('Expected permission to be set'); }
      if (!currentUser) { throw new Error('Expected currentUser to be set'); }

      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { errorMessage } = await createPermission({ jwt, scope, offices });

      if (errorMessage !== undefined) {
        throw new Error(errorMessage);
      }

      const updatedPermission = { ...permission };
      updatedPermission.data = { offices };
      setPermission(updatedPermission);
    },
    [currentUser, permission],
  );

  return {
    permission, ready, refreshPermission, updatePermission,
  };
}
