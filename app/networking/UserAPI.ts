import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { usersURI, userUri } from './Routes';
import {
  Authorization, ErrorResponseType, GetUserResponse, isCreateUserResponse,
  isGetUserResponse,
} from './types';

type CreateProps = {
  publicKey: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createUser({
  publicKey,
}: CreateProps): Promise<string | ErrorResponseType> {
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

type GetProps = {
  id: string;
} & Authorization;

export async function getUser({
  id, jwt,
}: GetProps): Promise<GetUserResponse | ErrorResponseType> {
  const uri = userUri(id);
  const response = await get({ uri, jwt });
  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isGetUserResponse(json)) {
    throw new Error('Failed to parse User from response');
  }

  return json;
}
