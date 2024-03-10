import { fromJson } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { nominationsURI } from './Routes';
import { Authorization, isCreateNominationResponse } from './types';

type Props = {
  ballotId: string;
  nomineeId: string;
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createNomination({
  ballotId, jwt, nomineeId,
}: Props & Authorization): Promise<Return> {
  const response = await post({
    bodyObject: { nomination: { nominee_id: nomineeId } },
    jwt,
    uri: nominationsURI(ballotId),
  });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isCreateNominationResponse(json)) {
    throw new Error('Failed to parse nomination ID from response');
  }

  return json;
}
