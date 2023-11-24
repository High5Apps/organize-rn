import type {
  E2EMultiDecryptor, E2EEncryptor, PaginationData, Post, PostCategory, PostSort,
} from '../model';
import { fromJson } from '../model';
import {
  decryptMany, encrypt, get, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { postsURI } from './Routes';
import type { Authorization } from './types';
import {
  isBackendEncryptedMessage, isPostIndexResponse, isPostResponse,
} from './types';

type Props = {
  body?: string;
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
  body, category, e2eEncrypt, jwt, title,
}: Props & Authorization): Promise<Return> {
  const [encryptedTitle, maybeEncryptedBody] = await Promise.all([
    encrypt(title, e2eEncrypt),
    body ? encrypt(body, e2eEncrypt) : undefined,
  ]);
  const response = await post({
    bodyObject: {
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

type IndexProps = {
  category?: PostCategory;
  createdBefore: Date;
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
  category, createdBefore, e2eDecryptMany, jwt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(postsURI);

  if (category !== undefined) {
    uri.searchParams.set('category', category);
  }

  if (createdBefore !== undefined) {
    uri.searchParams.set(
      'created_before',
      createdBefore.toISOString(),
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
