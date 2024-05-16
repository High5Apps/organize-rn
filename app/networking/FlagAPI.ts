import { FlaggableType, fromJson, isDefined } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { flagsURI } from './Routes';
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
export async function createFlag({
  ballotId, commentId, jwt, postId,
} : Props & Authorization): Promise<Return> {
  if ([ballotId, commentId, postId].filter(isDefined).length !== 1) {
    throw new Error('createFlag expected exactly one item ID');
  }

  const flaggableId = ballotId || commentId || postId;

  let flaggableType: FlaggableType;
  if (ballotId !== undefined) {
    flaggableType = 'Ballot';
  } else if (commentId !== undefined) {
    flaggableType = 'Comment';
  } else if (postId !== undefined) {
    flaggableType = 'Post';
  } else {
    throw new Error('createFlag expected exactly one item ID');
  }
  const uri = flagsURI;

  const response = await post({
    bodyObject: { flaggableId, flaggableType }, jwt, uri,
  });
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
