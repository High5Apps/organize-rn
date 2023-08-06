import type { PostType } from '../components';
import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { postsURI } from './Routes';
import { Authorization, isPostResponse } from './types';

type Props = {
  body?: string;
  category: PostType
  title: string;
};

type Return = {
  errorMessage?: string;
  postId?: string;
};

// eslint-disable-next-line import/prefer-default-export
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
