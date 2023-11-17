import { Keys } from '../model';
import {
  fromBackendEncryptedMessage, get, post, Status,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { connectionPreviewURI, connectionsURI } from './Routes';
import {
  recursiveSnakeToCamel, SnakeToCamelCaseNested,
} from './SnakeCaseToCamelCase';
import {
  Authorization, ConnectionPreview, Decrypt, ErrorResponseType,
  isPreviewConnectionResponse, PreviewConnectionResponse,
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
  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    let errorMessage = errorResponse.error_messages[0];

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
  groupKey: string;
};

export async function previewConnection({
  groupKey, sharerJwt,
}: PreviewProps): Promise<ConnectionPreview | ErrorResponseType> {
  const uri = connectionPreviewURI;
  const response = await get({ sharerJwt, uri });
  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isPreviewConnectionResponse(json)) {
    throw new Error('Failed to parse connection preview from response');
  }

  const {
    encrypted_name: backendEncryptedName,
    encrypted_member_definition: backendEncryptedMemberDefinition,
  } = json.org;
  const encryptedName = fromBackendEncryptedMessage(backendEncryptedName);
  const encryptedMemberDefinition = fromBackendEncryptedMessage(
    backendEncryptedMemberDefinition,
  );
  const { decryptWithExposedKey } = Keys().aes;
  const [name, memberDefinition] = await Promise.all([
    decryptWithExposedKey({ ...encryptedName, base64Key: groupKey }),
    decryptWithExposedKey({
      ...encryptedMemberDefinition, base64Key: groupKey,
    }),
  ]);

  const {
    encrypted_name: unusedEN,
    encrypted_member_definition: unusedEMD,
    ...decryptedOrg
  } = {
    ...json.org,
    name,
    member_definition: memberDefinition,
  };
  type DecryptedBackendConnection = Decrypt<PreviewConnectionResponse>;
  const decryptedJson: DecryptedBackendConnection = {
    ...json, org: decryptedOrg,
  };

  const connectionPreview = recursiveSnakeToCamel(
    decryptedJson,
  ) as SnakeToCamelCaseNested<DecryptedBackendConnection>;
  return connectionPreview;
}
