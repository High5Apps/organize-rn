import {
  OfficeCategory, Permission, PermissionScope, fromJson, getOffice,
} from '../model';
import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { permissionURI } from './Routes';
import { Authorization, isPermissionResponse } from './types';

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

// eslint-disable-next-line import/prefer-default-export
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
