import type { E2EEncryptor, Org } from '../model';
import { encrypt, get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import {
  Authorization, ErrorResponseType, isCreateOrgResponse, isOrgResponse,
  UnpublishedOrg,
} from './types';

type Props = Authorization & UnpublishedOrg & {
  e2eEncrypt: E2EEncryptor;
};

export async function createOrg({
  e2eEncrypt, jwt, name, potentialMemberDefinition,
}: Props): Promise<string | ErrorResponseType> {
  const encryptedName = await encrypt(name, e2eEncrypt);
  const response = await post({
    bodyObject: {
      encrypted_name: encryptedName,
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
