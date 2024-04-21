import { fromJson, isDefined } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { flaggedBallotURI, flaggedCommentURI, flaggedPostURI } from './Routes';
import { Authorization } from './types';

type Props = {
  ballotId?: string;
  commentId?: string;
  postId?: string;
};

type Return = {
  errorMessage?: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createFlaggedItem({
  ballotId, commentId, jwt, postId,
} : Props & Authorization): Promise<Return> {
  if ([ballotId, commentId, postId].filter(isDefined).length !== 1) {
    throw new Error('createFlaggedItem expected exactly one item ID');
  }

  let uri;
  if (ballotId !== undefined) {
    uri = flaggedBallotURI(ballotId);
  } else if (commentId !== undefined) {
    uri = flaggedCommentURI(commentId);
  } else if (postId !== undefined) {
    uri = flaggedPostURI(postId);
  } else {
    throw new Error('createFlaggedItem expected exactly one item ID');
  }

  const response = await post({ jwt, uri });
  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    return parseFirstErrorOrThrow(json);
  }

  return {};
}
