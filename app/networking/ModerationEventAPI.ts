import { get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { moderationEventsURI } from './Routes';
import {
  Authorization, isCreateModelResponse, isModerationEventsIndexResponse,
  ModeratableType, ModerationEvent, ModerationEventAction, PaginationData,
} from './types';

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

export async function createModerationEvent({
  action, jwt, moderatableId, moderatableType,
} : Props & Authorization): Promise<Return> {
  const uri = moderationEventsURI;

  const response = await post({
    bodyObject: { moderationEvent: { action, moderatableId, moderatableType } },
    jwt,
    uri,
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

type IndexProps = {
  actions?: ModerationEventAction[];
  active?: boolean;
  createdAtOrBefore: Date;
  moderatableType?: ModeratableType;
  page?: number;
};

type IndexReturn = {
  errorMessage?: never;
  paginationData: PaginationData;
  moderationEvents: Required<ModerationEvent>[];
} | {
  errorMessage: string;
  paginationData?: never;
  moderationEvents?: never;
};

export async function fetchModerationEvents({
  actions, active, createdAtOrBefore, jwt, moderatableType, page,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(moderationEventsURI);

  if (actions !== undefined) {
    actions.forEach((action) => {
      uri.searchParams.append('actions[]', action);
    });
  }

  if (active !== undefined) {
    uri.searchParams.set('active', active.toString());
  }

  if (createdAtOrBefore !== undefined) {
    uri.searchParams.set(
      'created_at_or_before',
      createdAtOrBefore.toISOString(),
    );
  }

  if (moderatableType !== undefined) {
    uri.searchParams.set('moderatable_type', moderatableType);
  }

  if (page !== undefined) {
    uri.searchParams.set('page', page.toString());
  }

  const response = await get({ jwt, uri: uri.href });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isModerationEventsIndexResponse(json)) {
    throw new Error('Failed to parse moderation events from response');
  }

  const { moderationEvents, meta: paginationData } = json;

  return { moderationEvents, paginationData };
}
