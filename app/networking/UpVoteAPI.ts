import { VoteState } from '../model';
import { post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { commentUpVotesURI, postUpVotesURI } from './Routes';
import { Authorization } from './types';

type Props = {
  commentId?: string;
  postId?: string;
  value: VoteState;
};

type Return = {
  errorMessage?: string;
};

export default async function createOrUpdateUpVote({
  commentId, jwt, postId, value,
}: Props & Authorization): Promise<Return> {
  let uri;
  if (commentId !== undefined && postId === undefined) {
    uri = commentUpVotesURI(commentId);
  } else if (commentId === undefined && postId !== undefined) {
    uri = postUpVotesURI(postId);
  } else {
    throw new Error('createUpVote expected exactly one commentable');
  }

  const bodyObject = { value };
  const response = await post({ bodyObject, jwt, uri });

  if (!response.ok) {
    const json = await response.json();
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];

    return { errorMessage };
  }

  return {};
}
