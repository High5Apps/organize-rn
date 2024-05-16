import {
  E2EMultiDecryptor, Flag, FlagCategory, FlagSort, PaginationData, fromJson,
  isDefined,
} from '../model';
import { decryptMany, get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { flagReportsURI, flagsURI } from './Routes';
import { Authorization, isFlagsIndexResponse } from './types';

type Props = {
  ballotId?: string;
  commentId?: string;
  postId?: string;
};

type Return = {
  errorMessage?: string;
};

export async function createFlag({
  ballotId, commentId, jwt, postId,
} : Props & Authorization): Promise<Return> {
  if ([ballotId, commentId, postId].filter(isDefined).length !== 1) {
    throw new Error('createFlag expected exactly one item ID');
  }

  const flaggableId = ballotId || commentId || postId;

  let flaggableType: FlagCategory;
  if (ballotId !== undefined) {
    flaggableType = 'Ballot';
  } else if (commentId !== undefined) {
    flaggableType = 'Comment';
  } else if (postId !== undefined) {
    flaggableType = 'Post';
  } else {
    throw new Error('createFlag expected exactly one item ID');
  }
  const uri = flagsURI;

  const response = await post({
    bodyObject: { flaggableId, flaggableType }, jwt, uri,
  });
  if (!response.ok) {
    const text = await response.text();
    const json = fromJson(text, {
      convertIso8601ToDate: true,
      convertSnakeToCamel: true,
    });
    return parseFirstErrorOrThrow(json);
  }

  return {};
}

type IndexProps = Authorization & {
  createdAtOrBefore: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  page: number;
  sort: FlagSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  flags?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  flags: Flag[];
};

export async function fetchFlags({
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

  if (!isFlagsIndexResponse(json)) {
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
