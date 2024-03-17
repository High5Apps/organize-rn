import isEqual from 'react-fast-compare';
import { fromJson } from '../model';
import { patch, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { nominationURI, nominationsURI } from './Routes';
import {
  Authorization, UpdateNominationResponse, isCreateModelResponse,
  isUpdateNominationResponse,
} from './types';

type CreateProps = {
  ballotId: string;
  nomineeId: string;
};

type CreateReturn = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

export async function createNomination({
  ballotId, jwt, nomineeId,
}: CreateProps & Authorization): Promise<CreateReturn> {
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

  if (!isCreateModelResponse(json)) {
    throw new Error('Failed to parse nomination ID from response');
  }

  return json;
}

type UpdateProps = {
  accepted: boolean;
  id: string;
};

type UpdateReturn = {
  errorMessage: string;
  nomination?: never;
} | (UpdateNominationResponse & {
  errorMessage?: never;
});

export async function updateNomination({
  jwt, ...updatedAttributes
}: UpdateProps & Authorization): Promise<UpdateReturn> {
  const { accepted, id } = updatedAttributes;
  const response = await patch({
    bodyObject: { nomination: { accepted } },
    jwt,
    uri: nominationURI(id),
  });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isUpdateNominationResponse(json)) {
    throw new Error('Failed to parse nomination from response');
  }

  if (!isEqual(json.nomination, updatedAttributes)) {
    throw new Error('Failed to updated all nomination attributes');
  }

  return json;
}
