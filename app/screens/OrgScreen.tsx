import React, { useEffect } from 'react';
import type { OrgScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';
import { ErrorResponse, fetchOrgGraph, isErrorResponse } from '../networking';
import { isCurrentUserData, useUserContext } from '../model';

export default function OrgScreen({ route }: OrgScreenProps) {
  const { name } = route;

  const { currentUser, setCurrentUser } = useUserContext();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function updateOrgGraph() {
      if (!isCurrentUserData(currentUser)) {
        throw new Error('Expected currentUser to be set');
      }
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { orgId } = currentUser;
      const responseOrError = await fetchOrgGraph({ jwt, orgId });
      if (!subscribed) { return; }

      if (isErrorResponse(responseOrError)) {
        const { errorMessage } = ErrorResponse(responseOrError);
        throw new Error(errorMessage);
      }

      const orgGraph = responseOrError;
      currentUser.org.graph = orgGraph;
      setCurrentUser(currentUser);
    }
    updateOrgGraph().catch(console.error);

    return unsubscribe;
  }, []);

  return <PlaceholderScreen name={name} />;
}
