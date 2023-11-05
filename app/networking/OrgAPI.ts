import type { E2EDecryptor, E2EEncryptor, Org } from '../model';
import {
  decrypt, encrypt, get, post,
} from './API';
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

type FetchOrgProps = Authorization & {
  e2eDecrypt: E2EDecryptor;
};

export async function fetchOrg({
  e2eDecrypt, jwt,
}: FetchOrgProps): Promise<Org | ErrorResponseType> {
  const uri = orgURI;
  const response = await get({ jwt, uri });

  const json = await response.json();

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }

  const { encrypted_name: encryptedName } = json;
  const name = await decrypt(encryptedName, e2eDecrypt);
  const { encrypted_name: unused, ...decryptedJson } = { ...json, name };
  const org = recursiveSnakeToCamel(decryptedJson) as Org;
  return org;
}
