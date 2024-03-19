import {
  BallotPreview, BallotCategory, BallotSort, E2EEncryptor, E2EMultiDecryptor,
  E2EMultiEncryptor, PaginationData, fromJson, Ballot, E2EDecryptor,
  OfficeCategory,
} from '../model';
import {
  decrypt, decryptMany, encrypt, encryptMany, get, post,
} from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { ballotURI, ballotsURI } from './Routes';
import {
  Authorization, isBallotIndexResponse, isBallotResponse, isCreateModelResponse,
} from './types';

type Props = {
  candidateTitles?: string[];
  category: BallotCategory;
  e2eEncrypt: E2EEncryptor;
  e2eEncryptMany: E2EMultiEncryptor;
  maxSelections?: number;
  office?: OfficeCategory;
  question: string;
  nominationsEndAt?: Date;
  termEndsAt?: Date;
  termStartsAt?: Date;
  votingEndsAt: Date;
};

type Return = {
  errorMessage: string;
  id?: never;
} | {
  errorMessage?: never;
  id: string;
};

export async function createBallot({
  candidateTitles, category, e2eEncrypt, e2eEncryptMany, jwt, maxSelections,
  office, question, nominationsEndAt, termEndsAt, termStartsAt, votingEndsAt,
}: Props & Authorization): Promise<Return> {
  const [encryptedCandidateTitles, encryptedQuestion] = await Promise.all([
    candidateTitles ? encryptMany(candidateTitles, e2eEncryptMany) : [],
    encrypt(question, e2eEncrypt),
  ]);

  const response = await post({
    bodyObject: {
      ballot: {
        category,
        encrypted_question: encryptedQuestion,
        max_candidate_ids_per_vote: maxSelections,
        office,
        nominations_end_at: nominationsEndAt?.toISOString(),
        term_ends_at: termEndsAt?.toISOString(),
        term_starts_at: termStartsAt?.toISOString(),
        voting_ends_at: votingEndsAt.toISOString(),
      },
      candidates: encryptedCandidateTitles.map((t) => ({ encrypted_title: t })),
    },
    jwt,
    uri: ballotsURI,
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
  activeAt?: Date;
  createdAtOrBefore?: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  inactiveAt?: Date;
  page?: number;
  sort: BallotSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  ballotPreviews?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  ballotPreviews: BallotPreview[];
};

export async function fetchBallotPreviews({
  activeAt, createdAtOrBefore, e2eDecryptMany, jwt, inactiveAt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(ballotsURI);

  if (activeAt !== undefined) {
    uri.searchParams.set('active_at', activeAt.toISOString());
  }

  if (createdAtOrBefore !== undefined) {
    uri.searchParams.set(
      'created_at_or_before',
      createdAtOrBefore.toISOString(),
    );
  }

  if (inactiveAt !== undefined) {
    uri.searchParams.set('inactive_at', inactiveAt.toISOString());
  }

  if (page !== undefined) {
    uri.searchParams.set('page', page.toString());
  }

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

  if (!isBallotIndexResponse(json)) {
    throw new Error('Failed to parse Ballots from response');
  }

  const { ballots: fetchedBallotPreviews, meta: paginationData } = json;
  const encryptedQuestions = fetchedBallotPreviews.map(
    (ballotPreview) => ballotPreview.encryptedQuestion,
  );
  const questions = await decryptMany(encryptedQuestions, e2eDecryptMany);
  const ballotPreviews = fetchedBallotPreviews.map(
    ({ encryptedQuestion, ...b }, i) => ({ ...b, question: questions[i]! }),
  );

  return { ballotPreviews, paginationData };
}

type FetchBallotProps = Authorization & {
  ballotId: string;
  e2eDecrypt: E2EDecryptor;
  e2eDecryptMany: E2EMultiDecryptor;
};

type FetchBallotReturn = {
  ballot: Ballot;
  errorMessage?: never;
} | {
  ballot?: never;
  errorMessage: string;
};

export async function fetchBallot({
  ballotId, e2eDecrypt, e2eDecryptMany, jwt,
}: FetchBallotProps): Promise<FetchBallotReturn> {
  const uri = ballotURI(ballotId);
  const response = await get({ jwt, uri });

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isBallotResponse(json)) {
    throw new Error('Failed to parse Ballot from response');
  }

  const { encryptedQuestion, ...partialBallot } = json.ballot;
  const encryptedCandidateTitles = json.candidates.map((c) => c.encryptedTitle);
  const [question, candidateTitles] = await Promise.all([
    decrypt(encryptedQuestion, e2eDecrypt),
    decryptMany(encryptedCandidateTitles, e2eDecryptMany),
  ]);

  const candidates = json.candidates.map(({ id, postId, userId }, i) => {
    let title: string | undefined;
    if (userId) {
      title = json.nominations?.find(
        ({ nominee }) => nominee.id === userId,
      )?.nominee.pseudonym;
    } else {
      title = candidateTitles[i];
    }

    return {
      id, postId, title: title ?? '[Unknown title]', userId,
    };
  });

  const results = json.results?.map(({ candidateId, ...rest }) => {
    const candidate = candidates.find(
      ({ id }) => id === candidateId,
    )!; // ! is safe because candidates contains all candidateIds in results
    const acceptedOffice = json.terms?.find(
      ({ userId }) => userId === candidate.userId,
    )?.accepted;
    return ({
      acceptedOffice,
      candidate,
      isWinner: rest.rank < partialBallot.maxCandidateIdsPerVote,
      ...rest,
    });
  });

  const nominations = json.nominations?.map((nomination) => {
    if (!nomination.accepted) { return nomination; }

    const { postId } = candidates.find(
      ({ userId }) => userId === nomination.nominee.id,
    )!; // ! is safe because all accepted nominations have a candidate
    return { ...nomination, postId };
  });

  const ballot: Ballot = {
    ...partialBallot,
    question,
    candidates,
    myVote: json.myVote,
    nominations,
    results,
  };

  return { ballot };
}
