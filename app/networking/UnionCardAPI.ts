import { encrypt, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { unionCardsURI } from './Routes';
import { Authorization, E2EEncryptor, isCreateModelResponse } from './types';

type Props = {
  agreement: string;
  email: string;
  employerName: string;
  e2eEncrypt: E2EEncryptor;
  name: string;
  phone: string;
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
    encrypt(agreement, e2eEncrypt),
    encrypt(email, e2eEncrypt),
    encrypt(employerName, e2eEncrypt),
    encrypt(name, e2eEncrypt),
    encrypt(phone, e2eEncrypt),
  ]);
  const response = await post({
    bodyObject: {
      encryptedAgreement,
      encryptedEmail,
      encryptedEmployerName,
      encryptedName,
      encryptedPhone,
      signature,
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
