import { useState } from 'react';
import { Alert } from 'react-native';
import useCurrentUser from './CurrentUser';
import { FlagReport } from './types';
import { createModerationEvent, fetchFlagReports } from '../networking';
import { useFlagReportContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';
import { GENERIC_ERROR_MESSAGE } from './Errors';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

const ERROR_ALERT_TITLE = 'Failed to create moderation event. Please try again';

type Props = {
  handled: boolean;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function useFlagReports({ handled }: Props) {
  const {
    cacheFlagReport, cacheFlagReports, getCachedFlagReport,
  } = useFlagReportContext();
  const {
    ids: flagReportIds, models: flagReports, setIds: setFlagReportIds,
  } = useModels<FlagReport>({ getCachedModel: getCachedFlagReport });
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfFlagReports(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, paginationData, flagReports: fetchedFlagReports,
    } = await fetchFlagReports({
      createdAtOrBefore: now,
      e2eDecryptMany,
      handled,
      page: firstPageIndex,
      jwt,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cacheFlagReports(fetchedFlagReports);
    setNextPageNumber(firstPageIndex + 1);
    setFlagReportIds(getIdsFrom(fetchedFlagReports));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfFlagReports(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, paginationData, flagReports: fetchedFlagReports,
    } = await fetchFlagReports({
      createdAtOrBefore,
      handled,
      e2eDecryptMany,
      jwt,
      page: nextPageNumber,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedFlagReports?.length) { return result; }

    cacheFlagReports(fetchedFlagReports);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setFlagReportIds([...flagReportIds, ...getIdsFrom(fetchedFlagReports)]);

    return result;
  }

  async function onFlagReportChanged(
    previousFlagReport: FlagReport,
    flagReport: Required<FlagReport>,
  ) {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    // Optimistically cache the flag report with the updated moderation event
    cacheFlagReport(flagReport);

    // Create backend moderation event
    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      const { flaggable, moderationEvent } = flagReport;
      ({ errorMessage, id } = await createModerationEvent({
        action: moderationEvent.action,
        jwt,
        moderatableId: flaggable.id,
        moderatableType: flaggable.category,
      }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage) {
      // On error, revert the flag report back to what it was before the
      // optimistic caching
      cacheFlagReport(previousFlagReport);
      Alert.alert(ERROR_ALERT_TITLE, errorMessage);
    } else if (id) {
      // On success, re-cache the flag report with the id from the backend to
      // indicate that it is no longer in-flight
      const updatedFlagReport = { ...flagReport };
      updatedFlagReport.moderationEvent.id = id;
      cacheFlagReport(updatedFlagReport);
    }
  }

  return {
    cacheFlagReport,
    fetchedLastPage,
    fetchFirstPageOfFlagReports,
    fetchNextPageOfFlagReports,
    getCachedFlagReport,
    flagReports,
    onFlagReportChanged,
    ready,
  };
}
