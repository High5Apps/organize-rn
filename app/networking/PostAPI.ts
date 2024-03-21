import type {
  E2EMultiDecryptor, E2EEncryptor, PaginationData, Post, PostCategory, PostSort,
  E2EDecryptor,
} from '../model';
import { fromJson } from '../model';
import {
  decrypt, decryptMany, encrypt, get, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { postURI, postsURI } from './Routes';
import type { Authorization } from './types';
import {
  isBackendEncryptedMessage, isFetchPostResponse, isPostIndexResponse,
  isPostResponse,
} from './types';

type Props = {
  body?: string;
  candidateId?: string | null;
  category: PostCategory;
  e2eEncrypt: E2EEncryptor;
  title: string;
};

type Return = {
  errorMessage: string;
  id?: never;
  createdAt?: never;
} | {
  errorMessage?: never;
  id: string;
  createdAt: Date;
};

export async function createPost({
  body, candidateId, category, e2eEncrypt, jwt, title,
}: Props & Authorization): Promise<Return> {
  const [encryptedTitle, maybeEncryptedBody] = await Promise.all([
    encrypt(title, e2eEncrypt),
    body ? encrypt(body, e2eEncrypt) : undefined,
  ]);
  const response = await post({
    bodyObject: {
      candidate_id: candidateId,
      category,
      encrypted_body: maybeEncryptedBody,
      encrypted_title: encryptedTitle,
    },
    jwt,
    uri: postsURI,
  });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isPostResponse(json)) {
    throw new Error('Failed to parse post ID from response');
  }

  return json;
}

type FetchPostProps = Authorization & {
  id: string;
  e2eDecrypt: E2EDecryptor;
};

type FetchPostReturn = {
  post: Post;
  errorMessage?: never;
} | {
  post?: never;
  errorMessage: string;
};

export async function fetchPost({
  id, e2eDecrypt, jwt,
}: FetchPostProps): Promise<FetchPostReturn> {
  const uri = postURI(id);
  const response = await get({ jwt, uri });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isFetchPostResponse(json)) {
    throw new Error('Failed to parse Post from response');
  }

  const { post: { encryptedTitle, encryptedBody, ...rest } } = json;
  const [title, body] = await Promise.all([
    decrypt(encryptedTitle, e2eDecrypt),
    isBackendEncryptedMessage(encryptedBody)
      ? decrypt(encryptedBody, e2eDecrypt) : undefined,
  ]);

  return { post: { ...rest, body, title } };
}

type IndexProps = {
  category?: PostCategory;
  createdAtOrBefore: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  page?: number;
  sort: PostSort;
};

type IndexReturn = {
  errorMessage?: never;
  paginationData: PaginationData;
  posts: Post[];
} | {
  errorMessage: string;
  paginationData?: never;
  posts?: never;
};

export async function fetchPosts({
  category, createdAtOrBefore, e2eDecryptMany, jwt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(postsURI);

  if (category !== undefined) {
    uri.searchParams.set('category', category);
  }

  if (createdAtOrBefore !== undefined) {
    uri.searchParams.set(
      'created_at_or_before',
      createdAtOrBefore.toISOString(),
    );
  }

  if (page !== undefined) {
    uri.searchParams.set('page', page.toString());
  }

  uri.searchParams.set('sort', sort);

  const response = await get({ jwt, uri: uri.href });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isPostIndexResponse(json)) {
    throw new Error('Failed to parse Posts from response');
  }

  const { posts: fetchedPosts, meta: paginationData } = json;
  const encryptedTitles = fetchedPosts.map((p) => p.encryptedTitle);
  const encryptedBodies = fetchedPosts.map(
    ({ encryptedBody }) => (isBackendEncryptedMessage(encryptedBody)
      ? encryptedBody : undefined),
  );
  const [titles, bodies] = await Promise.all([
    decryptMany(encryptedTitles, e2eDecryptMany),
    decryptMany(encryptedBodies, e2eDecryptMany),
  ]);
  const posts = fetchedPosts.map(
    ({ encryptedBody, encryptedTitle, ...p }, i) => (
      { ...p, body: bodies[i], title: titles[i]! }
    ),
  );

  return { paginationData, posts };
}
