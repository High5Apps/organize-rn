import {
  fromBackendEncryptedMessage, get, post, Status,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { connectionPreviewURI, connectionsURI } from './Routes';
import {
  Authorization, ConnectionPreview, E2EDecryptorWithExposedKey,
  isPreviewConnectionResponse,
} from './types';

type SharerJwt = {
  sharerJwt: string;
};

type CreateProps = SharerJwt & Authorization;

type Return = {
  errorMessage?: string;
  status: number;
};

export async function createConnection({
  jwt, sharerJwt,
}: CreateProps): Promise<Return> {
  const response = await post({ jwt, sharerJwt, uri: connectionsURI });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    let { errorMessage } = parseFirstErrorOrThrow(json);

    if (response.status === Status.Unauthorized) {
      // The most legitimate reason for an unauthorized status is that the
      // token expired, so retrying might succeed.
      errorMessage = 'Connection failed. Please try again.';
    }

    return { errorMessage, status: response.status };
  }

  return { status: response.status };
}

type PreviewProps = SharerJwt & {
  decryptWithExposedKey: E2EDecryptorWithExposedKey;
  groupKey: string;
};

type PreviewConnectionReturn = {
  connectionPreview: ConnectionPreview;
  errorMessage?: never;
} | {
  connectionPreview?: never;
  errorMessage: string;
};

export async function previewConnection({
  decryptWithExposedKey, groupKey, sharerJwt,
}: PreviewProps): Promise<PreviewConnectionReturn> {
  const uri = connectionPreviewURI;
  const response = await get({ sharerJwt, uri });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isPreviewConnectionResponse(json)) {
    throw new Error('Failed to parse connection preview from response');
  }

  const {
    encryptedName: backendEncryptedName,
    encryptedMemberDefinition: backendEncryptedMemberDefinition,
  } = json.org;
  const encryptedName = fromBackendEncryptedMessage(backendEncryptedName);
  const encryptedMemberDefinition = fromBackendEncryptedMessage(
    backendEncryptedMemberDefinition,
  );
  const [name, memberDefinition] = await Promise.all([
    decryptWithExposedKey({ ...encryptedName, base64Key: groupKey }),
    decryptWithExposedKey({
      ...encryptedMemberDefinition, base64Key: groupKey,
    }),
  ]);

  const {
    encryptedName: unusedEN,
    encryptedMemberDefinition: unusedEMD,
    ...org
  } = { ...json.org, name, memberDefinition };
  const connectionPreview = { ...json, org };

  return { connectionPreview };
}
