import { post, Status } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { connectionsURI } from './Routes';
import { Authorization } from './types';

type Props = {
  sharerJwt: string;
} & Authorization;

type Return = {
  errorMessage?: string;
  status: number;
};

// eslint-disable-next-line import/prefer-default-export
export async function createConnection({
  jwt, sharerJwt,
}: Props): Promise<Return> {
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
