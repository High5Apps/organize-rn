import { useCallback } from 'react';
import { useCurrentUser } from './context';
import {
  createConnection as _createConnection,
  previewConnection as _previewConnection, ConnectionPreview, Status,
} from '../networking';
import getErrorMessage from './ErrorMessage';
import { Keys } from './keys';
import i18n from '../i18n';

type Props = {
  sharerJwt?: string;
};

type PreviewProps = {
  groupKey: string;
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

  // Remember that previewConnection can be called before currentUser is set
  const previewConnection = useCallback(async ({
    groupKey,
  }: PreviewProps): Promise<ConnectionPreview> => {
    if (!sharerJwt) { throw new Error('Expected sharerJwt'); }

    let connectionPreview: ConnectionPreview | undefined;
    let errorMessage: string | undefined;
    try {
      const { decryptWithExposedKey } = Keys().aes;
      ({ connectionPreview, errorMessage } = await _previewConnection({
        decryptWithExposedKey, groupKey, sharerJwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else if (currentUser?.org) { // Do not check for non-members
      if (currentUser.org.id !== connectionPreview!.org.id) {
        throw new Error(i18n.t('result.error.scannedOtherOrg'));
      }
    }

    return connectionPreview!;
  }, [currentUser, sharerJwt]);

  return { createConnection, previewConnection };
}
