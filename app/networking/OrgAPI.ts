import type {
  E2EDecryptor, E2EEncryptor, Org, OrgGraphUser,
} from '../model';
import {
  decrypt, encrypt, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import {
  SnakeToCamelCaseNested, recursiveSnakeToCamel,
} from './SnakeCaseToCamelCase';
import {
  Authorization, Decrypt, ErrorResponseType, isCreateOrgResponse, isOrgResponse,
  OrgResponse, UnpublishedOrg,
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

  const {
    encrypted_name: encryptedName,
    encrypted_member_definition: encryptedMemberDefinition,
  } = json;
  const [name, memberDefinition] = await Promise.all([
    decrypt(encryptedName, e2eDecrypt),
    decrypt(encryptedMemberDefinition, e2eDecrypt),
  ]);

  const {
    encrypted_name: unusedEN,
    encrypted_member_definition: unusedEMD,
    ...decryptedJson
  } = { ...json, name, member_definition: memberDefinition };
  type DecryptedBackendOrg = Decrypt<OrgResponse>;
  const decryptedBackendOrg: DecryptedBackendOrg = decryptedJson;

  const orgWithStringDates = recursiveSnakeToCamel(
    decryptedBackendOrg,
  ) as SnakeToCamelCaseNested<DecryptedBackendOrg>;
  const orgUserEntries = Object.keys(orgWithStringDates.graph.users)
    .map((k) => {
      const { joinedAt, ...u } = orgWithStringDates.graph.users[k];
      return [u.id, { ...u, joinedAt: new Date(joinedAt) }] as const;
    });
  const users = Object.fromEntries<OrgGraphUser>(orgUserEntries);
  const org: Org = {
    ...orgWithStringDates,
    graph: {
      ...orgWithStringDates.graph,
      users,
    },
  };

  return org;
}
