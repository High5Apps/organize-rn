import { toJson } from './Json';
import type {
  AESEncryptedData, BackendEncryptedMessage, E2EDecryptor, E2EEncryptor,
  E2EMultiDecryptor, E2EMultiEncryptor,
} from './types';

export enum Status {
  Success = 200,
  NoContent = 204,
  Unauthorized = 401,
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type HeaderProps = {
  jwt?: string;
  sharerJwt?: string;
};

function headers({ jwt, sharerJwt }: HeaderProps) {
  const optionalHeaders: { [key: string]: string } = {};

  if (jwt) {
    optionalHeaders.Authorization = `Bearer ${jwt}`;
  }

  if (sharerJwt) {
    optionalHeaders['Sharer-Authorization'] = `Bearer ${sharerJwt}`;
  }

  return { ...defaultHeaders, ...optionalHeaders };
}

type GetProps = HeaderProps & {
  uri: string;
};

const getOrDestroy = async (method: 'GET' | 'DELETE', {
  jwt, uri, sharerJwt,
}: GetProps) => fetch(uri, { method, headers: headers({ jwt, sharerJwt }) });

export const get = async (props: GetProps) => getOrDestroy('GET', props);
export const destroy = async (props: GetProps) => getOrDestroy('DELETE', props);

type PostProps = HeaderProps & {
  bodyObject?: any;
  uri: string;
};

const postOrPatch = async (method: 'POST' | 'PATCH', {
  bodyObject, jwt, sharerJwt, uri,
}: PostProps) => fetch(uri, {
  method,
  headers: headers({ jwt, sharerJwt }),
  body: toJson(bodyObject, { convertCamelToSnake: true }),
});

export const post = async (props: PostProps) => postOrPatch('POST', props);
export const patch = async (props: PostProps) => postOrPatch('PATCH', props);

export function fromBackendEncryptedMessage(
  backendEncryptedMessage: BackendEncryptedMessage,
): AESEncryptedData {
  const { c, n, t } = backendEncryptedMessage;
  return {
    base64EncryptedMessage: c,
    base64InitializationVector: n,
    base64IntegrityCheck: t,
  };
}

function toBackendEncryptedMessage(
  encryptedMessage: AESEncryptedData,
): BackendEncryptedMessage {
  const {
    base64EncryptedMessage: c,
    base64InitializationVector: n,
    base64IntegrityCheck: t,
  } = encryptedMessage;
  return { c, n, t };
}

export async function encrypt(
  message: string,
  encryptor: E2EEncryptor,
): Promise<BackendEncryptedMessage> {
  const encryptedMessage = await encryptor(message);
  return toBackendEncryptedMessage(encryptedMessage);
}

export async function encryptMany(
  messages: string[],
  encryptor: E2EMultiEncryptor,
): Promise<BackendEncryptedMessage[]> {
  const encryptedMessages = await encryptor(messages);
  return encryptedMessages.map(toBackendEncryptedMessage);
}

export async function decrypt(
  encryptedMessage: BackendEncryptedMessage,
  decryptor: E2EDecryptor,
): Promise<string> {
  const reformattedMessage = fromBackendEncryptedMessage(encryptedMessage);
  return decryptor(reformattedMessage);
}

// The conversion from undefined to null and back is needed because the
// values will be serialized to JSON when crossing the bridge to native modules
export async function decryptMany(
  encryptedMessages: (BackendEncryptedMessage | undefined)[],
  decryptor: E2EMultiDecryptor,
): Promise<(string | undefined)[]> {
  const withRenamedKeys = encryptedMessages.map((encryptedMessageOrNull) => {
    if (encryptedMessageOrNull === undefined) { return null; }
    return fromBackendEncryptedMessage(encryptedMessageOrNull);
  });
  const decrypted = await decryptor(withRenamedKeys);
  return decrypted.map((d) => ((d === null) ? undefined : d));
}
