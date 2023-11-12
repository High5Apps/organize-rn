import { BallotCategory, E2EEncryptor, E2EMultiEncryptor } from '../model';
import { encrypt, encryptMany, post } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { ballotsURI } from './Routes';
import { Authorization, isBallotResponse } from './types';

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

// eslint-disable-next-line import/prefer-default-export
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
