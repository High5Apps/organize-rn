import type { Org } from '../model/types';

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
