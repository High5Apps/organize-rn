import {
  decrypt, encrypt, get, patch, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { orgURI, orgsURI, verifyURI } from './Routes';
import {
  Authorization, E2EDecryptor, E2EEncryptor, isBackendEncryptedMessage,
  isCreateModelResponse, isOrgResponse, Org, OrgGraph, UnpublishedOrg,
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

  const {
    encryptedEmployerName, encryptedName, encryptedMemberDefinition,
  } = json;
  const [employerName, name, memberDefinition] = await Promise.all([
    isBackendEncryptedMessage(encryptedEmployerName)
      ? decrypt(encryptedEmployerName, e2eDecrypt) : undefined,
    decrypt(encryptedName, e2eDecrypt),
    decrypt(encryptedMemberDefinition, e2eDecrypt),
  ]);
  const {
    encryptedEmployerName: unusedEEN,
    encryptedName: unusedEN,
    encryptedMemberDefinition: unusedEMD,
    graph: orgGraph,
    ...org
  } = {
    ...json, employerName, name, memberDefinition,
  };

  return { org, orgGraph };
}

export type UpdateProps = {
  e2eEncrypt: E2EEncryptor;
  email?: string;
  employerName?: string;
  memberDefinition?: string;
  name?: string;
};

type UpdateReturn = {
  errorMessage?: string;
};

export async function updateOrg({
  e2eEncrypt, email, employerName, jwt, memberDefinition, name,
}: UpdateProps & Authorization): Promise<UpdateReturn> {
  if (!email && !employerName && !name && !memberDefinition) {
    console.warn('No props were present in updateOrg');
    return {};
  }

  const [
    encryptedEmployerName, encryptedMemberDefinition, encryptedName,
  ] = await Promise.all([
    employerName ? encrypt(employerName, e2eEncrypt) : undefined,
    memberDefinition ? encrypt(memberDefinition, e2eEncrypt) : undefined,
    name ? encrypt(name, e2eEncrypt) : undefined,
  ]);

  const response = await patch({
    bodyObject: {
      org: {
        email, encryptedEmployerName, encryptedMemberDefinition, encryptedName,
      },
    },
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
