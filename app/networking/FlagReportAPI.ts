import {
  E2EMultiDecryptor, FlagReport, FlagReportSort, PaginationData, fromJson,
} from '../model';
import { decryptMany, get } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { flagReportsURI } from './Routes';
import { Authorization, isFlagReportsIndexResponse } from './types';

type IndexProps = Authorization & {
  createdAtOrBefore: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  page: number;
  sort: FlagReportSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  flagReports?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  flagReports: FlagReport[];
};

// eslint-disable-next-line import/prefer-default-export
export async function fetchFlagReports({
  createdAtOrBefore, e2eDecryptMany, jwt, page, sort,
}: IndexProps): Promise<IndexReturn> {
  const uri = new URL(flagReportsURI);

  uri.searchParams.set(
    'created_at_or_before',
    createdAtOrBefore.toISOString(),
  );
  uri.searchParams.set('page', page.toString());
  uri.searchParams.set('sort', sort);

  const response = await get({ jwt, uri: uri.href });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isFlagReportsIndexResponse(json)) {
    throw new Error('Failed to parse flagged items from response');
  }

  const { flagReports: fetchedFlagReports, meta: paginationData } = json;
  const flaggables = fetchedFlagReports.map(({ flaggable }) => flaggable);
  const encryptedTitles = flaggables.map(
    ({ encryptedTitle }) => encryptedTitle,
  );
  const flaggableIds = flaggables.map(({ id }) => id);
  const titles = await decryptMany(encryptedTitles, e2eDecryptMany);

  const flagReports = fetchedFlagReports.map(
    ({ flaggable: { encryptedTitle, ...fl }, ...fr }, i) => (
      { ...fr, id: flaggableIds[i], flaggable: { ...fl, title: titles[i]! } }
    ),
  );

  return { flagReports, paginationData };
}
