import type { E2EDecryptor, E2EEncryptor, Org } from '../model';
import { fromJson, getOffice } from '../model';
import {
  decrypt, encrypt, get, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { orgURI, orgsURI } from './Routes';
import {
  Authorization, isCreateOrgResponse, isOrgResponse, UnpublishedOrg,
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
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateOrgResponse(json)) {
    throw new Error('Failed to parse Org from response');
  }
  return { id: json.id };
}

type FetchOrgProps = Authorization & {
  e2eDecrypt: E2EDecryptor;
};
type FetchOrgReturn = {
  org: Org;
  errorMessage?: never;
} | {
  org?: never;
  errorMessage: string;
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
    ...org
  } = { ...json, name, memberDefinition };

  const { users: userMap } = org.graph;
  const userEntries = Object.entries(userMap).map(([userId, user]) => {
    const { offices: officeCategories, ...rest } = user;
    const offices = officeCategories.map((category) => getOffice(category));
    return [userId, { ...rest, offices }] as const;
  });
  const users = Object.fromEntries(userEntries);
  return {
    org: {
      ...org,
      graph: { users, connections: org.graph.connections },
    },
  };
}
