import { useState } from 'react';
import useCurrentUser from './CurrentUser';
import type {
  ModeratableType, ModerationEvent, ModerationEventAction,
} from './types';
import { fetchModerationEvents } from '../networking';
import { useModerationEventContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  actions?: ModerationEventAction[];
  active?: boolean;
  moderatableType?: ModeratableType;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function useModerationEvents({
  actions, active, moderatableType,
}: Props = {}) {
  const {
    cacheModerationEvent, cacheModerationEvents, getCachedModerationEvent,
  } = useModerationEventContext();
  const {
    ids: moderationEventIds,
    models: moderationEvents,
    setIds: setModerationEventIds,
  } = useModels<Required<ModerationEvent>>({
    getCachedModel: getCachedModerationEvent,
  });
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfModerationEvents(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, moderationEvents: fetchedModerationEvents,
    } = await fetchModerationEvents({
      actions,
      active,
      createdAtOrBefore: now,
      page: firstPageIndex,
      jwt,
      moderatableType,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cacheModerationEvents(fetchedModerationEvents);
    setNextPageNumber(firstPageIndex + 1);
    setModerationEventIds(getIdsFrom(fetchedModerationEvents));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfModerationEvents(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const {
      errorMessage, paginationData, moderationEvents: fetchedModerationEvents,
    } = await fetchModerationEvents({
      actions,
      active,
      createdAtOrBefore,
      page: nextPageNumber,
      jwt,
      moderatableType,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedModerationEvents?.length) { return result; }

    cacheModerationEvents(fetchedModerationEvents);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setModerationEventIds([
      ...moderationEventIds, ...getIdsFrom(fetchedModerationEvents),
    ]);

    return result;
  }

  function removeModerationEvent(id?: string) {
    setModerationEventIds(moderationEventIds.filter(
      (moderationEventId) => moderationEventId !== id,
    ));
  }

  return {
    cacheModerationEvent,
    fetchedLastPage,
    fetchFirstPageOfModerationEvents,
    fetchNextPageOfModerationEvents,
    getCachedModerationEvent,
    moderationEvents,
    ready,
    removeModerationEvent,
  };
}
