import {
  decrypt, decryptMany, destroy, encrypt, get, post, Status,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { unionCardsURI, unionCardURI } from './Routes';
import {
  Authorization, E2EDecryptor, E2EEncryptor, E2EMultiDecryptor,
  isCreateModelResponse, isUnionCardIndexResponse, isUnionCardResponse,
  PaginationData, UnionCard,
} from './types';

type Props = {
  agreement: string | undefined;
  email: string | undefined;
  employerName: string | undefined;
  e2eEncrypt: E2EEncryptor;
  homeAddressLine1: string | undefined;
  homeAddressLine2: string | undefined;
  name: string | undefined;
  phone: string | undefined;
  signatureBytes: string;
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
  agreement, email, employerName, e2eEncrypt, homeAddressLine1,
  homeAddressLine2, jwt, name, phone, signatureBytes, signedAt,
}: Props & Authorization): Promise<Return> {
  const [
    encryptedAgreement, encryptedEmail, encryptedEmployerName,
    encryptedHomeAddressLine1, encryptedHomeAddressLine2, encryptedName,
    encryptedPhone,
  ] = await Promise.all([
    agreement ? encrypt(agreement, e2eEncrypt) : undefined,
    email ? encrypt(email, e2eEncrypt) : undefined,
    employerName ? encrypt(employerName, e2eEncrypt) : undefined,
    homeAddressLine1 ? encrypt(homeAddressLine1, e2eEncrypt) : undefined,
    homeAddressLine2 ? encrypt(homeAddressLine2, e2eEncrypt) : undefined,
    name ? encrypt(name, e2eEncrypt) : undefined,
    phone ? encrypt(phone, e2eEncrypt) : undefined,
  ]);
  const response = await post({
    bodyObject: {
      unionCard: {
        encryptedAgreement,
        encryptedEmail,
        encryptedEmployerName,
        encryptedHomeAddressLine1,
        encryptedHomeAddressLine2,
        encryptedName,
        encryptedPhone,
        signatureBytes,
        signedAt,
      },
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
    encryptedAgreement, encryptedEmail, encryptedEmployerName,
    encryptedHomeAddressLine1, encryptedHomeAddressLine2, encryptedName,
    encryptedPhone,
  } = json;
  const [
    agreement, email, employerName, homeAddressLine1, homeAddressLine2, name,
    phone,
  ] = await Promise.all([
    decrypt(encryptedAgreement, e2eDecrypt),
    decrypt(encryptedEmail, e2eDecrypt),
    decrypt(encryptedEmployerName, e2eDecrypt),
    encryptedHomeAddressLine1
      ? decrypt(encryptedHomeAddressLine1, e2eDecrypt) : undefined,
    encryptedHomeAddressLine2
      ? decrypt(encryptedHomeAddressLine2, e2eDecrypt) : undefined,
    decrypt(encryptedName, e2eDecrypt),
    decrypt(encryptedPhone, e2eDecrypt),
  ]);
  const {
    encryptedAgreement: unusedA,
    encryptedEmail: unusedE,
    encryptedEmployerName: unusedEN,
    encryptedHomeAddressLine1: unusedHAL1,
    encryptedHomeAddressLine2: unusedHAL2,
    encryptedName: unusedN,
    encryptedPhone: unusedP,
    ...unionCard
  } = {
    ...json,
    agreement,
    email,
    employerName,
    homeAddressLine1,
    homeAddressLine2,
    name,
    phone,
  };

  return { unionCard };
}

type IndexProps = {
  createdAtOrBefore: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  page: number;
};

type IndexReturn = {
  errorMessage?: never;
  paginationData: PaginationData;
  unionCards: UnionCard[];
} | {
  errorMessage: string;
  paginationData?: never;
  unionCards?: never;
};

export async function fetchUnionCards({
  createdAtOrBefore, e2eDecryptMany, jwt, page,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(unionCardsURI);
  uri.searchParams.set('created_at_or_before', createdAtOrBefore.toISOString());
  uri.searchParams.set('page', page.toString());

  const response = await get({ jwt, uri: uri.href });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isUnionCardIndexResponse(json)) {
    throw new Error('Failed to parse Union Cards from response');
  }

  const { unionCards: fetchedUnionCards, meta: paginationData } = json;
  const encryptedAgreements = fetchedUnionCards.map(
    (u) => u.encryptedAgreement,
  );
  const encryptedEmails = fetchedUnionCards.map((u) => u.encryptedEmail);
  const encryptedEmployerNames = fetchedUnionCards.map(
    (u) => u.encryptedEmployerName,
  );
  const encryptedHomeAddressLine1s = fetchedUnionCards.map(
    (u) => u.encryptedHomeAddressLine1,
  );
  const encryptedHomeAddressLine2s = fetchedUnionCards.map(
    (u) => u.encryptedHomeAddressLine2,
  );
  const encryptedNames = fetchedUnionCards.map((u) => u.encryptedName);
  const encryptedPhones = fetchedUnionCards.map((u) => u.encryptedPhone);
  const [
    agreements, emails, employerNames, homeAddressLine1s, homeAddressLine2s,
    names, phones,
  ] = await Promise.all([
    decryptMany(encryptedAgreements, e2eDecryptMany),
    decryptMany(encryptedEmails, e2eDecryptMany),
    decryptMany(encryptedEmployerNames, e2eDecryptMany),
    decryptMany(encryptedHomeAddressLine1s, e2eDecryptMany),
    decryptMany(encryptedHomeAddressLine2s, e2eDecryptMany),
    decryptMany(encryptedNames, e2eDecryptMany),
    decryptMany(encryptedPhones, e2eDecryptMany),
  ]);
  const unionCards = fetchedUnionCards.map(
    ({
      encryptedAgreement, encryptedEmail, encryptedEmployerName,
      encryptedHomeAddressLine1, encryptedHomeAddressLine2, encryptedName,
      encryptedPhone, ...u
    }, i) => ({
      ...u,
      agreement: agreements[i]!,
      email: emails[i]!,
      employerName: employerNames[i]!,
      homeAddressLine1: homeAddressLine1s[i]!,
      homeAddressLine2: homeAddressLine2s[i]!,
      name: names[i]!,
      phone: phones[i]!,
    }),
  );

  return { paginationData, unionCards };
}

type RemoveReturn = {
  errorMessage?: string;
};

export async function removeUnionCard({
  jwt,
}: Authorization): Promise<RemoveReturn> {
  const uri = unionCardURI;
  const response = await destroy({ jwt, uri });

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
