import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentsURI } from './Routes';
import { Authorization, isCreateCommentResponse } from './types';

type Props = {
  body: string;
  postId: string;
};

type Return = {
  errorMessage?: string;
  commentId?: string;
};

export default async function createComment({
  body, jwt, postId,
}: Props & Authorization): Promise<Return> {
  const response = await post({
    bodyObject: { body },
    jwt,
    uri: commentsURI(postId),
  });
  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];

    return { errorMessage };
  }

  if (!isCreateCommentResponse(json)) {
    throw new Error('Failed to parse comment ID from response');
  }

  return { commentId: json.id };
}
