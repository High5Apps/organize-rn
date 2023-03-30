import { get, post, Status } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { connectionPreviewURI, connectionsURI } from './Routes';
import {
  Authorization, ErrorResponseType, isPreviewConnectionResponse,
  PreviewConnectionResponse,
} from './types';

type PreviewProps = {
  sharerJwt: string;
};

type CreateProps = PreviewProps & Authorization;

type Return = {
  errorMessage?: string;
  status: number;
};

export async function createConnection({
  jwt, sharerJwt,
}: CreateProps): Promise<Return> {
  const response = await post({
    bodyObject: {
      sharer_jwt: sharerJwt,
    },
    jwt,
    uri: connectionsURI,
  });

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

export async function previewConnection({
  sharerJwt,
}: PreviewProps): Promise<PreviewConnectionResponse | ErrorResponseType> {
  const uri = connectionPreviewURI(sharerJwt);
  const response = await get({ uri });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isPreviewConnectionResponse(json)) {
    throw new Error('Failed to parse connection preview from response');
  }

  return json;
}
