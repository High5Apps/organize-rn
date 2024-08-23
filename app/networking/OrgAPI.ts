import {
  decrypt, encrypt, get, patch, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { orgURI, orgsURI, verifyURI } from './Routes';
import {
  Authorization, E2EDecryptor, E2EEncryptor, isCreateModelResponse,
  isOrgResponse, Org, OrgGraph, UnpublishedOrg,
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
  e2eEncrypt, email, jwt, memberDefinition, name,
}: Props): Promise<CreateReturn> {
  const [
    encryptedName, encryptedMemberDefinition,
  ] = await Promise.all([
    encrypt(name, e2eEncrypt),
    encrypt(memberDefinition, e2eEncrypt),
  ]);
  const response = await post({
    bodyObject: { email, encryptedName, encryptedMemberDefinition },
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

export type UpdateProps = {
  e2eEncrypt: E2EEncryptor;
  email?: string;
  memberDefinition?: string;
  name?: string;
};

type UpdateReturn = {
  errorMessage?: string;
};

export async function updateOrg({
  e2eEncrypt, email, jwt, memberDefinition, name,
}: UpdateProps & Authorization): Promise<UpdateReturn> {
  if (!email && !name && !memberDefinition) {
    console.warn('No props were present in updateOrg');
    return {};
  }

  const [encryptedMemberDefinition, encryptedName] = await Promise.all([
    memberDefinition ? encrypt(memberDefinition, e2eEncrypt) : undefined,
    name ? encrypt(name, e2eEncrypt) : undefined,
  ]);

  const response = await patch({
    bodyObject: { org: { email, encryptedMemberDefinition, encryptedName } },
    jwt,
    uri: orgURI,
  });

  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    return parseFirstErrorOrThrow(json);
  }

  return {};
}

export type VerifyProps = Authorization & {
  code: string;
};

type VerifyReturn = {
  errorMessage?: string;
};

export async function verifyOrg({
  code, jwt,
}: VerifyProps): Promise<VerifyReturn> {
  const uri = verifyURI;
  const response = await post({ bodyObject: { code }, jwt, uri });

  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    return parseFirstErrorOrThrow(json);
  }

  return {};
}
