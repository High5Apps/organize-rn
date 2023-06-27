import { Org, OrgGraph } from '../model';
import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgGraphURI, orgURI, orgsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import {
  Authorization, ErrorResponseType, isCreateOrgResponse, isOrgGraphResponse,
  isOrgResponse, UnpublishedOrg,
} from './types';

// eslint-disable-next-line import/prefer-default-export
export async function createOrg({
  jwt, name, potentialMemberEstimate, potentialMemberDefinition,
}: UnpublishedOrg & Authorization): Promise<string | ErrorResponseType> {
  const response = await post({
    bodyObject: {
      name,
      potential_member_definition: potentialMemberDefinition,
      potential_member_estimate: potentialMemberEstimate,
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

type FetchOrgProps = {
  orgId: string,
};

export async function fetchOrg({
  jwt, orgId,
}: FetchOrgProps & Authorization): Promise<Org | ErrorResponseType> {
  const uri = orgURI(orgId);
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

export async function fetchOrgGraph({
  jwt, orgId,
}: FetchOrgProps & Authorization): Promise<OrgGraph | ErrorResponseType> {
  const uri = orgGraphURI(orgId);
  const response = await get({ jwt, uri });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isOrgGraphResponse(json)) {
    throw new Error('Failed to parse Org graph from response');
  }

  const orgGraph = recursiveSnakeToCamel(json) as OrgGraph;
  return orgGraph;
}
