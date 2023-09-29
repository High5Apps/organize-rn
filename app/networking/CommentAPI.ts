import { Comment } from '../model';
import { get, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentsURI, repliesURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import { Authorization, isCommentIndexResponse, isCreateCommentResponse } from './types';

type Props = {
  body: string;
  commentId?: string;
  postId?: string;
};

type Return = {
  errorMessage: string;
  commentId?: undefined;
} | {
  commentId: string;
  errorMessage?: undefined;
};

export async function createComment({
  body, commentId, jwt, postId,
}: Props & Authorization): Promise<Return> {
  let uri;
  if (commentId !== undefined && postId === undefined) {
    uri = repliesURI(commentId);
  } else if (commentId === undefined && postId !== undefined) {
    uri = commentsURI(postId);
  } else {
    throw new Error('createUpvote expected exactly one upvotable');
  }

  const response = await post({ bodyObject: { body }, jwt, uri });
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

type IndexProps = {
  postId: string;
};

export async function fetchComments({
  jwt, postId,
}: IndexProps & Authorization) {
  const uri = commentsURI(postId);
  const response = await get({ jwt, uri });
  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];

    return { errorMessage };
  }

  if (!isCommentIndexResponse(json)) {
    throw new Error('Failed to parse Comments from response');
  }

  const { comments: snakeCaseComments } = json;
  const comments = recursiveSnakeToCamel(snakeCaseComments) as Comment[];
  return { comments };
}
