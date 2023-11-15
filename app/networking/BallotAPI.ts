import {
  Ballot, BallotCategory, BallotSort, E2EEncryptor, E2EMultiDecryptor,
  E2EMultiEncryptor, PaginationData,
} from '../model';
import {
  decryptMany, encrypt, encryptMany, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { ballotsURI } from './Routes';
import {
  SnakeToCamelCaseNested, recursiveSnakeToCamel,
} from './SnakeCaseToCamelCase';
import {
  Authorization, BallotIndexBallot, Decrypt,
  PaginationData as BackendPaginationData, isBallotIndexResponse,
  isBallotResponse,
} from './types';

type Props = {
  candidateTitles: string[];
  category: BallotCategory;
  e2eEncrypt: E2EEncryptor;
  e2eEncryptMany: E2EMultiEncryptor;
  question: string;
  votingEndsAt: Date;
};

type Return = {
  errorMessage: string;
  ballotId?: undefined;
} | {
  errorMessage?: undefined;
  ballotId: string;
};

export async function createBallot({
  candidateTitles, category, e2eEncrypt, e2eEncryptMany, jwt, question,
  votingEndsAt,
}: Props & Authorization): Promise<Return> {
  const [encryptedCandidateTitles, encryptedQuestion] = await Promise.all([
    encryptMany(candidateTitles, e2eEncryptMany),
    encrypt(question, e2eEncrypt),
  ]);

  const response = await post({
    bodyObject: {
      ballot: {
        category,
        encrypted_question: encryptedQuestion,
        voting_ends_at: votingEndsAt.toISOString(),
      },
      candidates: encryptedCandidateTitles.map((t) => ({ encrypted_title: t })),
    },
    jwt,
    uri: ballotsURI,
  });
  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];
    return { errorMessage };
  }

  if (!isBallotResponse(json)) {
    throw new Error('Failed to parse ballot ID from response');
  }

  return { ballotId: json.id };
}

type IndexProps = {
  activeAt?: Date;
  createdBefore?: Date;
  e2eDecryptMany: E2EMultiDecryptor;
  inactiveAt?: Date;
  page?: number;
  sort: BallotSort;
};

type IndexReturn = {
  errorMessage: string;
  paginationData?: never;
  ballots?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  ballots: Ballot[];
};

export async function fetchBallots({
  activeAt, createdBefore, e2eDecryptMany, jwt, inactiveAt, page, sort,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(ballotsURI);

  if (activeAt !== undefined) {
    uri.searchParams.set('active_at', activeAt.toISOString());
  }

  if (createdBefore !== undefined) {
    uri.searchParams.set('created_before', createdBefore.toISOString());
  }

  if (inactiveAt !== undefined) {
    uri.searchParams.set('inactive_at', inactiveAt.toISOString());
  }

  if (page !== undefined) {
    uri.searchParams.set('page', page.toString());
  }

  uri.searchParams.set('sort', sort);

  const response = await get({ jwt, uri: uri.href });

  const json = await response.json();

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.error_messages[0];
    return { errorMessage };
  }

  if (!isBallotIndexResponse(json)) {
    throw new Error('Failed to parse Ballots from response');
  }

  const { ballots: snakeCaseBallots, meta: snakeCasePaginationData } = json;
  const encryptedQuestions = snakeCaseBallots.map((p) => p.encrypted_question);
  const questions = await decryptMany(encryptedQuestions, e2eDecryptMany);
  const decryptedSnakeCaseBallots:
  Decrypt<BallotIndexBallot>[] = snakeCaseBallots.map(
    ({ encrypted_question, ...p }, i) => ({ ...p, question: questions[i]! }),
  );

  const ballotsWithStringDates = recursiveSnakeToCamel(
    decryptedSnakeCaseBallots,
  ) as SnakeToCamelCaseNested<Decrypt<BallotIndexBallot>>[];
  const ballots = ballotsWithStringDates.map(({ votingEndsAt, ...p }) => ({
    ...p, votingEndsAt: new Date(votingEndsAt),
  }));

  const paginationData = recursiveSnakeToCamel(
    snakeCasePaginationData,
  ) as SnakeToCamelCaseNested<BackendPaginationData> | undefined;
  return { ballots, paginationData };
}
