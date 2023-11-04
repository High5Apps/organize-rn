import { E2EMultiDecryptor, E2EEncryptor } from '../model';
import type { BackendEncryptedMessage } from './types';

export enum Status {
  Success = 200,
  Unauthorized = 401,
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function headers(jwt?: string) {
  let optionalHeaders = {};
  if (jwt) {
    optionalHeaders = { Authorization: `Bearer ${jwt}` };
  }

  return { ...defaultHeaders, ...optionalHeaders };
}

type GetProps = {
  jwt?: string;
  uri: string;
};

export async function get({ jwt, uri }: GetProps) {
  const response = await fetch(uri, {
    method: 'GET',
    headers: headers(jwt),
  });
  return response;
}

type PostProps = {
  bodyObject: any;
  jwt?: string;
  uri: string;
};

export async function post({ bodyObject, jwt, uri }: PostProps) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: headers(jwt),
    body: JSON.stringify(bodyObject),
  });
  return response;
}

export async function encrypt(
  message: string,
  encryptor: E2EEncryptor,
): Promise<BackendEncryptedMessage> {
  const {
    base64EncryptedMessage: c,
    base64InitializationVector: n,
    base64IntegrityCheck: t,
  } = await encryptor(message);
  return { c, n, t };
}

export async function decryptMany(
  encryptedMessages: (BackendEncryptedMessage | null)[],
  decryptor: E2EMultiDecryptor,
): Promise<(string | null)[]> {
  const withRenamedKeys = encryptedMessages.map((encryptedMessageOrNull) => {
    if (encryptedMessageOrNull === null) { return null; }
    const { c, n, t } = encryptedMessageOrNull;
    return {
      base64EncryptedMessage: c,
      base64InitializationVector: n,
      base64IntegrityCheck: t,
    };
  });
  return decryptor(withRenamedKeys);
}
