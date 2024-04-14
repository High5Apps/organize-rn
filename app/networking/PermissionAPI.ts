import {
  OfficeCategory, Permission, PermissionScope, camelToSnake, fromJson, getOffice,
  snakeToCamel,
} from '../model';
import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { myPermissionsURI, permissionURI } from './Routes';
import {
  Authorization, MyPermissionsResponse, isMyPermissionsResponse,
  isPermissionResponse,
} from './types';

type Props = {
  scope: PermissionScope;
} & Authorization;

type Return = {
  permission: Permission;
  errorMessage?: never;
} | {
  permission?: never;
  errorMessage: string;
};

export async function fetchPermission({
  scope, jwt,
}: Props): Promise<Return> {
  const uri = permissionURI(scope);
  const response = await get({ uri, jwt });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isPermissionResponse(json)) {
    throw new Error('Failed to parse Permission from response');
  }

  const { permission: { offices: officeCategories } } = json;
  const offices = officeCategories.map((category) => getOffice(category));

  return { permission: { data: { offices }, scope } };
}

type CreateProps = {
  offices: OfficeCategory[];
  scope: PermissionScope;
} & Authorization;

type CreateReturn = {
  errorMessage?: string;
};

export async function createPermission({
  jwt, offices, scope,
}: CreateProps & Authorization): Promise<CreateReturn> {
  const response = await post({
    bodyObject: { permission: { offices } },
    jwt,
    uri: permissionURI(scope),
  });

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

type MyPermissionsProps = {
  scopes?: PermissionScope[];
} & Authorization;

type MyPermissionsReturn = {
  response: MyPermissionsResponse;
  errorMessage?: never;
} | {
  response?: never;
  errorMessage: string;
};

export async function fetchMyPermissions({
  scopes, jwt,
}: MyPermissionsProps): Promise<MyPermissionsReturn> {
  const uri = new URL(myPermissionsURI);

  if (scopes !== undefined) {
    scopes.forEach((scope) => {
      const snakeScope = camelToSnake(scope);
      uri.searchParams.append('scopes[]', snakeScope);
    });
  }

  const response = await get({ uri: uri.href, jwt });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isMyPermissionsResponse(json)) {
    throw new Error('Failed to parse Permission from response');
  }

  // Need to convert scopes to camel case, because fromJson only converts keys,
  // not values
  const camelPermissions = json.myPermissions.map(({ scope, ...rest }) => ({
    scope: snakeToCamel(scope) as PermissionScope,
    ...rest,
  }));

  return { response: { myPermissions: camelPermissions } };
}
