import { Comment, E2EDecryptor, E2EEncryptor } from '../model';
import {
  decryptMany, encrypt, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentsURI, repliesURI } from './Routes';
import { recursiveSnakeToCamel } from './SnakeCaseToCamelCase';
import { Authorization, isCommentIndexResponse, isCreateCommentResponse } from './types';

type Props = {
  body: string;
  commentId?: string;
  e2eEncrypt: E2EEncryptor;
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
  body, commentId, e2eEncrypt, jwt, postId,
}: Props & Authorization): Promise<Return> {
  let uri;
  if (commentId !== undefined && postId === undefined) {
    uri = repliesURI(commentId);
  } else if (commentId === undefined && postId !== undefined) {
    uri = commentsURI(postId);
  } else {
    throw new Error('createUpvote expected exactly one upvotable');
  }

  const encryptedBody = await encrypt(body, e2eEncrypt);
  const response = await post({
    bodyObject: { body, encrypted_body: encryptedBody }, jwt, uri,
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

type IndexProps = {
  e2eDecryptMany: E2EDecryptor;
  postId: string;
};

export async function fetchComments({
  e2eDecryptMany, jwt, postId,
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
  const encryptedBodies = snakeCaseComments.map((c) => c.encrypted_body);
  const bodies = await decryptMany(encryptedBodies, e2eDecryptMany);
  const decryptedSnakeCaseComments = snakeCaseComments.map(
    ({ encrypted_body, ...p }, i) => ({ ...p, body: bodies[i] }),
  );
  const comments = recursiveSnakeToCamel(decryptedSnakeCaseComments) as Comment[];
  return { comments };
}
