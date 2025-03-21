import { useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { fetchOrg, updateOrg as updateBackendOrg } from '../networking';
import { useCurrentUser } from './context';

type UpdateProps = {
  email?: string;
  employerName?: string;
  memberDefinition?: string;
  name?: string;
};

export default function useOrg() {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const refreshOrg = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecrypt } = currentUser;
    const {
      errorMessage, org: fetchedOrg,
    } = await fetchOrg({ e2eDecrypt, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (!isEqual(currentUser.org, fetchedOrg)) {
      setCurrentUser((previousCurrentUser) => {
        if (previousCurrentUser === null) { return null; }
        return { ...previousCurrentUser, org: fetchedOrg };
      });
    }
  }, [currentUser]);

  const updateOrg = useCallback(async ({
    email, employerName, memberDefinition, name,
  }: UpdateProps) => {
    const org = currentUser?.org;
    if (!org) {
      throw new Error('Expected currentUser and org to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eEncrypt } = currentUser;
    const { errorMessage } = await updateBackendOrg({
      e2eEncrypt, email, employerName, jwt, memberDefinition, name,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const updatedOrg = {
      ...org,
      email: email ?? org.email,
      employerName: employerName ?? org.employerName,
      memberDefinition: memberDefinition ?? org.memberDefinition,
      name: name ?? org.name,
    };
    setCurrentUser({ ...currentUser, org: updatedOrg });
  }, [currentUser]);

  return { org: currentUser?.org, refreshOrg, updateOrg };
}
