import type { VoteState } from '../model';
import { fromJson } from '../model';
import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentUpvotesURI, postUpvotesURI } from './Routes';
import { Authorization } from './types';

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

  const bodyObject = { value };
  const response = await post({ bodyObject, jwt, uri });

  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.errorMessages[0];

    return { errorMessage };
  }

  return {};
}
