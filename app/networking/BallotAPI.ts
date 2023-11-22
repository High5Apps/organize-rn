import {
  BallotPreview, BallotCategory, BallotSort, E2EEncryptor, E2EMultiDecryptor,
  E2EMultiEncryptor, PaginationData, fromJson,
} from '../model';
import {
  decryptMany, encrypt, encryptMany, get, post,
} from './API';
import { parseErrorResponse } from './ErrorResponse';
import { ballotsURI } from './Routes';
import {
  Authorization, isBallotIndexResponse, isBallotResponse,
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
  id?: never;
} | {
  errorMessage?: never;
  id: string;
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
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.errorMessages[0];
    return { errorMessage };
  }

  if (!isBallotResponse(json)) {
    throw new Error('Failed to parse ballot ID from response');
  }

  return json;
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
  ballotPreviews?: never;
} | {
  errorMessage?: never;
  paginationData?: PaginationData;
  ballotPreviews: BallotPreview[];
};

export async function fetchBallotPreviews({
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

  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    const errorResponse = parseErrorResponse(json);
    const errorMessage = errorResponse.errorMessages[0];
    return { errorMessage };
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
