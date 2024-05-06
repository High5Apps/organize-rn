import {
  E2EMultiDecryptor, FlaggedItem, FlaggedItemSort, PaginationData, fromJson,
  isDefined,
} from '../model';
import { decryptMany, get, post } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import {
  flaggedBallotURI, flaggedCommentURI, flaggedItemsURI, flaggedPostURI,
} from './Routes';
import { Authorization, isFlaggedItemsIndexResponse } from './types';

type Props = {
  ballotId?: string;
  commentId?: string;
  postId?: string;
};

type Return = {
  errorMessage?: string;
};

export async function createFlaggedItem({
  ballotId, commentId, jwt, postId,
} : Props & Authorization): Promise<Return> {
  if ([ballotId, commentId, postId].filter(isDefined).length !== 1) {
    throw new Error('createFlaggedItem expected exactly one item ID');
  }

  let uri;
  if (ballotId !== undefined) {
    uri = flaggedBallotURI(ballotId);
  } else if (commentId !== undefined) {
    uri = flaggedCommentURI(commentId);
  } else if (postId !== undefined) {
    uri = flaggedPostURI(postId);
  } else {
    throw new Error('createFlaggedItem expected exactly one item ID');
  }

  const response = await post({ jwt, uri });
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
  sort: FlaggedItemSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  flaggedItems?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  flaggedItems: FlaggedItem[];
};

export async function fetchFlaggedItems({
  createdAtOrBefore, e2eDecryptMany, jwt, page, sort,
}: IndexProps): Promise<IndexReturn> {
  const uri = new URL(flaggedItemsURI);

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

  if (!isFlaggedItemsIndexResponse(json)) {
    throw new Error('Failed to parse flagged items from response');
  }

  const { flaggedItems: fetchedFlaggedItems, meta: paginationData } = json;
  const encryptedTitles = fetchedFlaggedItems.map(
    (flaggedItem) => flaggedItem.encryptedTitle,
  );
  const titles = await decryptMany(encryptedTitles, e2eDecryptMany);
  const flaggedItems = fetchedFlaggedItems.map(
    ({ encryptedTitle, ...fi }, i) => ({ ...fi, title: titles[i]! }),
  );

  return { flaggedItems, paginationData };
}
