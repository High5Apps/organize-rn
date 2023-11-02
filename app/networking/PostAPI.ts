import type {
  E2EDecryptor, E2EEncryptor, PaginationData, Post, PostCategory, PostSort,
} from '../model';
import {
  decryptMany, encrypt, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { postsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
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
  postId?: undefined;
  postCreatedAt?: undefined;
} | {
  errorMessage?: undefined;
  postId: string;
  postCreatedAt: number;
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
  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];

    return { errorMessage };
  }

  if (!isPostResponse(json)) {
    throw new Error('Failed to parse post ID from response');
  }

  return { postCreatedAt: 1000 * json.created_at, postId: json.id };
}

type IndexProps = {
  category?: PostCategory;
  createdBefore?: number;
  e2eDecryptMany: E2EDecryptor;
  page?: number;
  sort: PostSort;
};

type IndexReturn = {
  errorMessage?: string;
  paginationData?: PaginationData;
  posts?: Post[];
};

export async function fetchPosts({
  category, createdBefore, e2eDecryptMany, jwt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(postsURI);

  if (category !== undefined) {
    uri.searchParams.set('category', category);
  }

  if (createdBefore !== undefined) {
    uri.searchParams.set('created_before', (createdBefore / 1000).toString());
  }

  if (page !== undefined) {
    uri.searchParams.set('page', page.toString());
  }

  uri.searchParams.set('sort', sort);

  const response = await get({ jwt, uri: uri.href });

  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];
    return { errorMessage };
  }

  if (!isPostIndexResponse(json)) {
    throw new Error('Failed to parse Posts from response');
  }

  const { posts: snakeCasePosts, meta: snakeCasePaginationData } = json;
  const encryptedTitles = snakeCasePosts.map((p) => p.encrypted_title);
  const encryptedBodies = snakeCasePosts.map(
    ({ encrypted_body }) => (isBackendEncryptedMessage(encrypted_body)
      ? encrypted_body : null),
  );
  const [titles, bodies] = await Promise.all([
    decryptMany(encryptedTitles, e2eDecryptMany),
    decryptMany(encryptedBodies, e2eDecryptMany),
  ]);
  const decryptedSnakeCasePosts = snakeCasePosts.map(
    ({ encrypted_title, ...p }, i) => ({ ...p, title: titles[i] }),
  ).map(({ encrypted_body, ...p }, i) => ({ ...p, body: bodies[i] }));

  const posts = recursiveSnakeToCamel(decryptedSnakeCasePosts) as Post[];
  const paginationData = recursiveSnakeToCamel(snakeCasePaginationData) as PaginationData;
  return { paginationData, posts };
}
