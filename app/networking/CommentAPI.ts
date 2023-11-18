import {
  Comment, E2EMultiDecryptor, E2EEncryptor, fromJson,
} from '../model';
import {
  decryptMany, encrypt, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentsURI, repliesURI } from './Routes';
import {
  Authorization, CommentIndexComment, isCommentIndexResponse,
  isCreateCommentResponse,
} from './types';

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
    bodyObject: { encrypted_body: encryptedBody }, jwt, uri,
  });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.errorMessages[0];

    return { errorMessage };
  }

  if (!isCreateCommentResponse(json)) {
    throw new Error('Failed to parse comment ID from response');
  }

  return { commentId: json.id };
}

type IndexProps = {
  e2eDecryptMany: E2EMultiDecryptor;
  postId: string;
};

function getUnnestedComments(nestedComments: CommentIndexComment[]): CommentIndexComment[] {
  const unnestedComments: CommentIndexComment[] = [];
  nestedComments.forEach((nestedComment) => {
    unnestedComments.push(nestedComment);

    const replies = getUnnestedComments(nestedComment.replies);
    unnestedComments.push(...replies);
  });
  return unnestedComments;
}

type IndexReturn = {
  errorMessage?: never;
  comments: Comment[];
} | {
  errorMessage: string;
  comments?: never;
};

export async function fetchComments({
  e2eDecryptMany, jwt, postId,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = commentsURI(postId);
  const response = await get({ jwt, uri });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.errorMessages[0];

    return { errorMessage };
  }

  if (!isCommentIndexResponse(json)) {
    throw new Error('Failed to parse Comments from response');
  }

  const { comments: fetchedComments } = json;
  const unnestedComments = getUnnestedComments(fetchedComments);
  const encryptedBodies = unnestedComments.map((c) => c.encryptedBody);
  const bodies = await decryptMany(encryptedBodies, e2eDecryptMany);
  const decryptedBodiesWithoutReplies = unnestedComments.map(
    ({ encryptedBody, replies, ...p }, i) => ({ ...p, body: bodies[i]! }),
  );

  return { comments: decryptedBodiesWithoutReplies };
}
