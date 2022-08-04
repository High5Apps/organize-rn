import { post } from './API';
import { orgsURI } from './Routes';
import {
  ErrorResponseType, isCreateOrgResponse, isErrorResponse, UnpublishedOrg,
} from './types';

// eslint-disable-next-line import/prefer-default-export
export async function createOrg({
  name, potentialMemberCount, potentialMemberDefinition,
}: UnpublishedOrg): Promise<string | ErrorResponseType> {
  const response = await post({
    uri: orgsURI,
    bodyObject: {
      name,
      potential_member_definition: potentialMemberDefinition,
      potential_member_estimate: potentialMemberCount,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    if (!isErrorResponse(json)) {
      throw new Error('Failed to parse error message from response');
    }
    return json;
  }

  if (!isCreateOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }
  return json.id;
}
