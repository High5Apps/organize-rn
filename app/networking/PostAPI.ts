import type {
  PaginationData, Post, PostCategory, PostSort,
} from '../model';
import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { postsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import type { Authorization } from './types';
import { isPostIndexResponse, isPostResponse } from './types';

type Props = {
  body?: string;
  category: PostCategory
  title: string;
};

type Return = {
  errorMessage?: string;
  postId?: string;
};

export async function createPost({
  body, category, jwt, title,
}: Props & Authorization): Promise<Return> {
  const response = await post({
    bodyObject: { body, category, title },
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

  return { postId: json.id };
}

type IndexProps = {
  category?: PostCategory;
  createdAfter?: number;
  createdBefore?: number;
  sort: PostSort;
};

type IndexReturn = {
  errorMessage?: string;
  paginationData?: PaginationData;
  posts?: Post[];
};

export async function fetchPosts({
  category, createdAfter, createdBefore, jwt, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(postsURI);

  if (category !== undefined) {
    uri.searchParams.set('category', category);
  }

  if (createdAfter !== undefined) {
    uri.searchParams.set('created_after', createdAfter.toString());
  }

  if (createdBefore !== undefined) {
    uri.searchParams.set('created_before', createdBefore.toString());
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
