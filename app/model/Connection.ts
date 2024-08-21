import { useCallback } from 'react';
import { useCurrentUser } from './context';
import { createConnection as _createConnection, Status } from '../networking';
import getErrorMessage from './ErrorMessage';

type Props = {
  sharerJwt?: string;
};

export default function useConnection({ sharerJwt }: Props) {
  const { currentUser } = useCurrentUser();

  const createConnection = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected current user'); }
    if (!sharerJwt) { throw new Error('Expected sharerJwt'); }

    let errorMessage: string | undefined;
    let status: number | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      ({ errorMessage, status } = await _createConnection({ jwt, sharerJwt }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    return {
      // Status is 201 Created on initial connection and 200 OK on reconnection
      isReconnection: status === Status.Success,
    };
  }, [currentUser, sharerJwt]);

  return { createConnection };
}
