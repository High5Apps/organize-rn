import { Candidate, E2EMultiDecryptor, fromJson } from '../model';
import { decryptMany, get } from './API';
import { parseErrorResponse } from './ErrorResponse';
import { candidatesURI } from './Routes';
import { Authorization, isCandidateIndexResponse } from './types';

type IndexProps = {
  e2eDecryptMany: E2EMultiDecryptor;
  ballotId: string;
};

type IndexReturn = {
  errorMessage?: never;
  candidates: Candidate[];
} | {
  errorMessage: string;
  candidates?: never;
};

// eslint-disable-next-line import/prefer-default-export
export async function fetchCandidates({
  ballotId, e2eDecryptMany, jwt,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = candidatesURI(ballotId);
  const response = await get({ jwt, uri });

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

  if (!isCandidateIndexResponse(json)) {
    throw new Error('Failed to parse Candidates from response');
  }

  const { candidates: fetchedCandidates } = json;
  const encryptedTitles = fetchedCandidates.map((c) => c.encryptedTitle);
  const titles = await decryptMany(encryptedTitles, e2eDecryptMany);
  const candidates = fetchedCandidates.map(
    ({ encryptedTitle, ...p }, i) => ({ ...p, title: titles[i]! }),
  );

  return { candidates };
}
