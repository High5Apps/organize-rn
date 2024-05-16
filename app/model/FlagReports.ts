import { useState } from 'react';
import useCurrentUser from './CurrentUser';
import { FlagReport, FlagReportSort } from './types';
import { fetchFlagReports } from '../networking';
import { useFlagReportContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  sort: FlagReportSort;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function useFlagReports({ sort }: Props) {
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
      errorMessage, paginationData, flags: fetchedFlagReports,
    } = await fetchFlagReports({
      createdAtOrBefore: now,
      e2eDecryptMany,
      page: firstPageIndex,
      jwt,
      sort,
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
      errorMessage, paginationData, flags: fetchedFlagReports,
    } = await fetchFlagReports({
      createdAtOrBefore,
      e2eDecryptMany,
      jwt,
      page: nextPageNumber,
      sort,
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

  return {
    cacheFlagReport,
    fetchedLastPage,
    fetchFirstPageOfFlagReports,
    fetchNextPageOfFlagReports,
    getCachedFlagReport,
    flagReports,
    ready,
  };
}
