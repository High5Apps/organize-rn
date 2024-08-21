import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { leaveOrgURI, usersURI, userUri } from './Routes';
import {
  Authorization, PaginationData, User, UserFilter, UserSort,
  isCreateModelResponse, isUserIndexResponse, isUserResponse,
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
    bodyObject: { publicKeyBytes: authenticationKey },
  });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateModelResponse(json)) {
    throw new Error('Failed to parse User from response');
  }
  return { id: json.id };
}

type GetProps = {
  id: string;
} & Authorization;

type GetReturn = {
  user: User;
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

  if (!isUserResponse(json)) {
    throw new Error('Failed to parse User from response');
  }

  return { user: json };
}

type IndexProps = {
  filter?: UserFilter;
  joinedAtOrBefore: Date;
  page: number;
  query?: string;
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
  filter, joinedAtOrBefore, jwt, page, query, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(usersURI);

  uri.searchParams.set('joined_at_or_before', joinedAtOrBefore.toISOString());
  uri.searchParams.set('page', page.toString());
  uri.searchParams.set('sort', sort);

  if (filter !== undefined) {
    uri.searchParams.set('filter', filter);
  }

  if (query?.length) {
    uri.searchParams.set('query', query);
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

  const { users, meta: paginationData } = json;

  return { paginationData, users };
}

type LeaveOrgReturn = {
  errorMessage?: string;
};

export async function leaveOrg({
  jwt,
}: Authorization): Promise<LeaveOrgReturn> {
  const uri = new URL(leaveOrgURI);

  const response = await post({ jwt, uri: uri.href });

  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    return parseFirstErrorOrThrow(json);
  }

  return {};
}
