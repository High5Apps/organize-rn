import { fromJson } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { termsURI } from './Routes';
import { Authorization, isCreateModelResponse } from './types';

type Props = {
  accepted: boolean;
  ballotId: string;
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createTerm({
  accepted, ballotId, jwt,
}: Props & Authorization): Promise<Return> {
  const response = await post({
    bodyObject: {
      ballot: { accepted },
    },
    jwt,
    uri: termsURI(ballotId),
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
    throw new Error('Failed to parse term ID from response');
  }

  return json;
}
