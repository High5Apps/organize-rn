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
  flags?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  flags: FlagReport[];
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

  const { flags: fetchedFlags, meta: paginationData } = json;
  const encryptedTitles = fetchedFlags.map(
    (flag) => flag.encryptedTitle,
  );
  const titles = await decryptMany(encryptedTitles, e2eDecryptMany);
  const flags = fetchedFlags.map(
    ({ encryptedTitle, ...fi }, i) => ({ ...fi, title: titles[i]! }),
  );

  return { flags, paginationData };
}
