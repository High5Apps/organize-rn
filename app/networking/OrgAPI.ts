import type { Org } from '../model';
import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import {
  Authorization, ErrorResponseType, isCreateOrgResponse, isOrgResponse,
  UnpublishedOrg,
} from './types';

export async function createOrg({
  jwt, name, potentialMemberDefinition,
}: UnpublishedOrg & Authorization): Promise<string | ErrorResponseType> {
  const response = await post({
    bodyObject: {
      name,
      potential_member_definition: potentialMemberDefinition,
    },
    jwt,
    uri: orgsURI,
  });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isCreateOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }
  return json.id;
}

export async function fetchOrg({
  jwt,
}: Authorization): Promise<Org | ErrorResponseType> {
  const uri = orgURI;
  const response = await get({ jwt, uri });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }

  const org = recursiveSnakeToCamel(json) as Org;
  return org;
}
