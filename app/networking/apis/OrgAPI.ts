import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgsURI } from './Routes';
import {
  Authorization, ErrorResponseType, isCreateOrgResponse, UnpublishedOrg,
} from './types';

// eslint-disable-next-line import/prefer-default-export
export async function createOrg({
  jwt, name, potentialMemberCount, potentialMemberDefinition,
}: UnpublishedOrg & Authorization): Promise<string | ErrorResponseType> {
  const response = await post({
    bodyObject: {
      name,
      potential_member_definition: potentialMemberDefinition,
      potential_member_estimate: potentialMemberCount,
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
