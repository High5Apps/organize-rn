import type {
  E2EEncryptor, PaginationData, Post, PostCategory, PostSort,
} from '../model';
import { encrypt, get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { postsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import type { Authorization } from './types';
import { isPostIndexResponse, isPostResponse } from './types';

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
  const encryptedTitle = await encrypt(title, e2eEncrypt);
  const response = await post({
    bodyObject: {
      body, category, encrypted_title: encryptedTitle, title,
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
  page?: number;
  sort: PostSort;
};

type IndexReturn = {
  errorMessage?: string;
  paginationData?: PaginationData;
  posts?: Post[];
};

export async function fetchPosts({
  category, createdBefore, jwt, page, sort,
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
  const posts = recursiveSnakeToCamel(snakeCasePosts) as Post[];
  const paginationData = recursiveSnakeToCamel(snakeCasePaginationData) as PaginationData;
  return { paginationData, posts };
}
