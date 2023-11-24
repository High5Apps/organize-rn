import { fromJson } from '../model';
import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { usersURI, userUri } from './Routes';
import {
  Authorization, GetUserResponse, isCreateUserResponse, isGetUserResponse,
} from './types';

type CreateProps = {
  authenticationKey: string;
};

type CreateReturn = {
  id: string;
  errorMessage?: never;
} | {
  id?: never;
  errorMessage: string;
};

export async function createUser({
  authenticationKey,
}: CreateProps): Promise<CreateReturn> {
  const response = await post({
    uri: usersURI,
    bodyObject: {
      public_key_bytes: authenticationKey,
    },
  });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateUserResponse(json)) {
    throw new Error('Failed to parse User from response');
  }
  return { id: json.id };
}

type GetProps = {
  id: string;
} & Authorization;

type GetReturn = {
  user: GetUserResponse;
  errorMessage?: never;
} | {
  user?: never;
  errorMessage: string;
};

export async function getUser({
  id, jwt,
}: GetProps): Promise<GetReturn> {
  const uri = userUri(id);
  const response = await get({ uri, jwt });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isGetUserResponse(json)) {
    throw new Error('Failed to parse User from response');
  }

  return { user: json };
}
