import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { usersURI } from './Routes';
import { ErrorResponseType, isCreateUserResponse } from './types';

type Props = {
  publicKey: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createUser({
  publicKey,
}: Props): Promise<string | ErrorResponseType> {
  const response = await post({
    uri: usersURI,
    bodyObject: {
      public_key_bytes: publicKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isCreateUserResponse(json)) {
    throw new Error('Failed to parse User from response');
  }
  return json.id;
}
