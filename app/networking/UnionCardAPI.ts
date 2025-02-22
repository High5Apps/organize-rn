import {
  decrypt, encrypt, get, post, Status,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { unionCardsURI, unionCardURI } from './Routes';
import {
  Authorization, E2EDecryptor, E2EEncryptor, isCreateModelResponse,
  isUnionCardResponse, UnionCard,
} from './types';

type Props = {
  agreement: string | undefined;
  email: string | undefined;
  employerName: string | undefined;
  e2eEncrypt: E2EEncryptor;
  name: string | undefined;
  phone: string | undefined;
  signature: string;
  signedAt: Date;
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

export async function createUnionCard({
  agreement, email, employerName, e2eEncrypt, jwt, name, phone, signature,
  signedAt,
}: Props & Authorization): Promise<Return> {
  const [
    encryptedAgreement, encryptedEmail, encryptedEmployerName, encryptedName,
    encryptedPhone,
  ] = await Promise.all([
    agreement ? encrypt(agreement, e2eEncrypt) : undefined,
    email ? encrypt(email, e2eEncrypt) : undefined,
    employerName ? encrypt(employerName, e2eEncrypt) : undefined,
    name ? encrypt(name, e2eEncrypt) : undefined,
    phone ? encrypt(phone, e2eEncrypt) : undefined,
  ]);
  const response = await post({
    bodyObject: {
      encryptedAgreement,
      encryptedEmail,
      encryptedEmployerName,
      encryptedName,
      encryptedPhone,
      signatureBytes: signature,
      signedAt,
    },
    jwt,
    uri: unionCardsURI,
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
    throw new Error('Failed to parse union card ID from response');
  }

  return json;
}

type FetchProps = Authorization & {
  e2eDecrypt: E2EDecryptor;
};
type FetchReturn = {
  errorMessage?: never;
  unionCard?: UnionCard;
} | {
  errorMessage: string;
  unionCard?: never;
};

export async function fetchUnionCard({
  e2eDecrypt, jwt,
}: FetchProps): Promise<FetchReturn> {
  const uri = unionCardURI;
  const response = await get({ jwt, uri });

  if (response.status === Status.NoContent) {
    return {};
  }

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isUnionCardResponse(json)) {
    throw new Error('Failed to parse union card from response');
  }

  const {
    encryptedAgreement, encryptedEmail, encryptedEmployerName, encryptedName,
    encryptedPhone, signatureBytes,
  } = json;
  const [agreement, email, employerName, name, phone] = await Promise.all([
    decrypt(encryptedAgreement, e2eDecrypt),
    decrypt(encryptedEmail, e2eDecrypt),
    decrypt(encryptedEmployerName, e2eDecrypt),
    decrypt(encryptedName, e2eDecrypt),
    decrypt(encryptedPhone, e2eDecrypt),
  ]);
  const {
    encryptedAgreement: unusedA,
    encryptedEmail: unusedE,
    encryptedEmployerName: unusedEN,
    encryptedName: unusedN,
    encryptedPhone: unusedP,
    signatureBytes: unusedSB,
    ...unionCard
  } = {
    ...json,
    agreement,
    email,
    employerName,
    name,
    phone,
    signature: signatureBytes,
  };

  return { unionCard };
}
