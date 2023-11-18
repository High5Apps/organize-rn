import type { E2EDecryptor, E2EEncryptor, Org } from '../model';
import { fromJson } from '../model';
import {
  decrypt, encrypt, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import {
  Authorization, ErrorResponseType, isCreateOrgResponse, isOrgResponse,
  UnpublishedOrg,
} from './types';

type Props = Authorization & UnpublishedOrg & {
  e2eEncrypt: E2EEncryptor;
};

export async function createOrg({
  e2eEncrypt, jwt, name, memberDefinition,
}: Props): Promise<string | ErrorResponseType> {
  const [
    encryptedName, encryptedMemberDefinition,
  ] = await Promise.all([
    encrypt(name, e2eEncrypt),
    encrypt(memberDefinition, e2eEncrypt),
  ]);
  const response = await post({
    bodyObject: {
      encrypted_name: encryptedName,
      encrypted_member_definition: encryptedMemberDefinition,
    },
    jwt,
    uri: orgsURI,
  });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

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

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseErrorResponse(json);
  }

  if (!isOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }

  const { encryptedName, encryptedMemberDefinition } = json;
  const [name, memberDefinition] = await Promise.all([
    decrypt(encryptedName, e2eDecrypt),
    decrypt(encryptedMemberDefinition, e2eDecrypt),
  ]);
  const {
    encryptedName: unusedEN,
    encryptedMemberDefinition: unusedEMD,
    ...org
  } = { ...json, name, memberDefinition };

  return org;
}
