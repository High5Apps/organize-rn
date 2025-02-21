import { encrypt, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { unionCardsURI } from './Routes';
import { Authorization, E2EEncryptor, isCreateModelResponse } from './types';

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

// eslint-disable-next-line import/prefer-default-export
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
