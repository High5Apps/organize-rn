import type {
  E2EDecryptor, E2EEncryptor, Org, OrgGraph,
} from '../model';
import { fromJson } from '../model';
import {
  decrypt, encrypt, get, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import {
  Authorization, isCreateModelResponse, isOrgResponse, UnpublishedOrg,
} from './types';

type Props = Authorization & UnpublishedOrg & {
  e2eEncrypt: E2EEncryptor;
};

type CreateReturn = {
  id: string;
  errorMessage?: never;
} | {
  id?: never;
  errorMessage: string;
};

export async function createOrg({
  e2eEncrypt, jwt, name, memberDefinition,
}: Props): Promise<CreateReturn> {
  const [
    encryptedName, encryptedMemberDefinition,
  ] = await Promise.all([
    encrypt(name, e2eEncrypt),
    encrypt(memberDefinition, e2eEncrypt),
  ]);
  const response = await post({
    bodyObject: { encryptedName, encryptedMemberDefinition },
    jwt,
    uri: orgsURI,
  });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateModelResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }
  return { id: json.id };
}

type FetchOrgProps = Authorization & {
  e2eDecrypt: E2EDecryptor;
};
type FetchOrgReturn = {
  errorMessage?: never;
  org: Org;
  orgGraph: OrgGraph;
} | {
  errorMessage: string;
  org?: never;
  orgGraph?: never;
};

export async function fetchOrg({
  e2eDecrypt, jwt,
}: FetchOrgProps): Promise<FetchOrgReturn> {
  const uri = orgURI;
  const response = await get({ jwt, uri });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
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
    graph: orgGraph,
    ...org
  } = { ...json, name, memberDefinition };

  return { org, orgGraph };
}
