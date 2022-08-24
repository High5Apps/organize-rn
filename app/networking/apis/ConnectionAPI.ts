import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { connectionsURI } from './Routes';
import { Authorization } from './types';

type Props = {
  sharerJwt: string;
} & Authorization;

// eslint-disable-next-line import/prefer-default-export
export async function createConnection({
  jwt, sharerJwt,
}: Props): Promise<string | null> {
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
    return errorResponse.error_messages[0];
  }

  return null;
}
