import { useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { fetchOrg, updateOrg as updateBackendOrg } from '../networking';
import { Org } from './types';
import { useCurrentUser } from './context';

type UpdateProps = {
  email?: string;
  employerName?: string;
  memberDefinition?: string;
  name?: string;
};

export default function useOrg() {
  const [org, setOrg] = useState<Org>();

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

    if (!isEqual(org, fetchedOrg)) {
      setOrg(fetchedOrg);
      setCurrentUser((previousCurrentUser) => {
        if (previousCurrentUser === null) { return null; }
        return { ...previousCurrentUser, org: fetchedOrg };
      });
    }
  }, [currentUser, org]);

  const updateOrg = useCallback(async ({
    email, employerName, memberDefinition, name,
  }: UpdateProps) => {
    if (!currentUser || !org) {
      throw new Error('Expected currentUser to be set');
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
    setOrg(updatedOrg);
    setCurrentUser({ ...currentUser, org: updatedOrg });
  }, [currentUser, org]);

  return { org, refreshOrg, updateOrg };
}
