import type { PostType } from '../components';
import type { Post } from '../model';
import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { postsURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import type { Authorization } from './types';
import { isPostIndexResponse, isPostResponse } from './types';

type Props = {
  body?: string;
  category: PostType
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
  createdAfter?: number;
  sort: 'new' | 'old';
};

type IndexReturn = {
  errorMessage?: string;
  posts?: Post[];
};

export async function fetchPosts({
  createdAfter, jwt, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const queries = [
    createdAfter && `created_after=${encodeURIComponent(createdAfter)}`,
    `sort=${encodeURIComponent(sort)}`,
  ];
  const queryString = queries.length ? `?${queries.join('&')}` : '';
  const uri = `${postsURI}${queryString}`;

  const response = await get({ jwt, uri });

  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];
    return { errorMessage };
  }

  if (!isPostIndexResponse(json)) {
    throw new Error('Failed to parse Posts from response');
  }

  const { posts: snakeCasePosts } = json;
  const posts = recursiveSnakeToCamel(snakeCasePosts) as Post[];
  return { posts };
}
