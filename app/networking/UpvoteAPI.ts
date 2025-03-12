import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { commentUpvotesURI, postUpvotesURI } from './Routes';
import { Authorization, VoteState } from './types';

type Props = {
  commentId?: string;
  postId?: string;
  value: VoteState;
};

type Return = {
  errorMessage?: string;
};

export default async function createOrUpdateUpvote({
  commentId, jwt, postId, value,
}: Props & Authorization): Promise<Return> {
  let uri;
  if (commentId !== undefined && postId === undefined) {
    uri = commentUpvotesURI(commentId);
  } else if (commentId === undefined && postId !== undefined) {
    uri = postUpvotesURI(postId);
  } else {
    throw new Error('createUpvote expected exactly one upvotable');
  }

  const response = await post({ bodyObject: { upvote: { value } }, jwt, uri });

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
