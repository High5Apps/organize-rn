import type { Org } from '../model/types';
import type { SnakeToCamelCaseNested } from './SnakeCaseToCamelCase';

export type ErrorResponseType = {
  error_messages: string[];
};

export function isErrorResponse(object: unknown): object is ErrorResponseType {
  const response = (object as ErrorResponseType);
  return response?.error_messages?.length > 0;
}

export type CreateOrgResponse = {
  id: string;
};

export function isCreateOrgResponse(object: unknown): object is CreateOrgResponse {
  const response = (object as CreateOrgResponse);
  return response?.id.length > 0;
}

export type UnpublishedOrg = Omit<Org, 'id'>;

export type CreateUserResponse = {
  id: string;
};

export function isCreateUserResponse(object: unknown): object is CreateUserResponse {
  const response = (object as CreateUserResponse);
  return response?.id.length > 0;
}

export type GetUserResponse = {
  id: string;
  pseudonym: string;
};

export function isGetUserResponse(object: unknown): object is GetUserResponse {
  const response = (object as GetUserResponse);
  return (response?.id.length > 0) && (response?.pseudonym.length > 0);
}

export type Authorization = {
  jwt: string;
};

type PreviewConnectionResponse = {
  org: {
    id: string,
    name: string,
    potential_member_definition: string,
    potential_member_estimate: number,
  },
  user: {
    pseudonym: string,
  }
};

export type ConnectionPreview = SnakeToCamelCaseNested<PreviewConnectionResponse>;

export function isPreviewConnectionResponse(object: unknown): object is PreviewConnectionResponse {
  const response = (object as PreviewConnectionResponse);
  return (response?.org?.id.length > 0)
    && (response?.org?.name.length > 0)
    && (response?.org?.potential_member_definition.length > 0)
    && (response?.org?.potential_member_estimate > 0)
    && (response?.user?.pseudonym.length > 0);
}

type OrgGraphResponse = {
  users: {
    [id: string]: {
      connection_count: number;
      joined_at: number;
      offices?: string[];
      pseudonym: string;
      recruit_count: number;
    }
  };
  connections: [string, string][];
};

export function isOrgGraphResponse(object: unknown): object is OrgGraphResponse {
  const response = (object as OrgGraphResponse);
  const firstUser = Object.values(response?.users)[0];
  return Object.keys(response?.users).length > 0
    && firstUser?.connection_count > 0
    && firstUser?.joined_at > 0
    && firstUser?.pseudonym?.length > 0
    && firstUser?.recruit_count >= 0
    && response?.connections?.length > 0;
}
