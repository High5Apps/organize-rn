import { fromJson } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { votesURI } from './Routes';
import { Authorization, isCreateModelResponse } from './types';

type Props = {
  ballotId: string;
  candidateIds: string[];
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createVote({
  ballotId, candidateIds, jwt,
}: Props & Authorization): Promise<Return> {
  const response = await post({
    bodyObject: { vote: { candidate_ids: candidateIds } },
    jwt,
    uri: votesURI(ballotId),
  });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateModelResponse(json)) {
    throw new Error('Failed to parse vote ID from response');
  }

  return json;
}
