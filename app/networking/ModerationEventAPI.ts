import { ModeratableType, ModerationEventAction, fromJson } from '../model';
import { post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { moderationEventsURI } from './Routes';
import { Authorization, isCreateModelResponse } from './types';

type Props = {
  action: ModerationEventAction;
  moderatableId: string;
  moderatableType: ModeratableType;
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function createModerationEvent({
  action, jwt, moderatableId, moderatableType,
} : Props & Authorization): Promise<Return> {
  const uri = moderationEventsURI;

  const response = await post({
    bodyObject: { action, moderatableId, moderatableType }, jwt, uri,
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
    throw new Error('Failed to parse ballot ID from response');
  }

  return json;
}
