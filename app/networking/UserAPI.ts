import {
  PaginationData, UserFilter, User, UserSort, fromJson, getOffice,
} from '../model';
import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { usersURI, userUri } from './Routes';
import {
  Authorization, GetUserResponse, isCreateUserResponse, isGetUserResponse,
  isUserIndexResponse,
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

type IndexProps = {
  filter?: UserFilter;
  joinedAtOrBefore: Date;
  page: number;
  sort: UserSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  users?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  users: User[];
};

export async function fetchUsers({
  filter, joinedAtOrBefore, jwt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(usersURI);

  uri.searchParams.set('joined_at_or_before', joinedAtOrBefore.toISOString());
  uri.searchParams.set('page', page.toString());
  uri.searchParams.set('sort', sort);

  if (filter !== undefined) {
    uri.searchParams.set('filter', filter);
  }

  const response = await get({ jwt, uri: uri.href });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isUserIndexResponse(json)) {
    throw new Error('Failed to parse Users from response');
  }

  const { users: fetchedUsers, meta: paginationData } = json;

  const users = fetchedUsers.map((user) => {
    const { offices: officeCategories, ...rest } = user;
    const offices = officeCategories.map((category) => getOffice(category));
    return { ...rest, offices };
  });

  return { paginationData, users };
}
