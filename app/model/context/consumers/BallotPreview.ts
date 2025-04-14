import { useCallback } from 'react';
import { BallotPreview, createBallot } from '../../../networking';
import getErrorMessage from '../../ErrorMessage';
import useCurrentUser from './CurrentUser';
import { useBallotPreviewContext } from '../providers';
import { sanitizeSingleLineField } from '../../formatters';

type CreateProps = {
  candidateTitles?: string[];
  maxSelections?: number;
  partialBallotPreview: Partial<Omit<BallotPreview, 'id' | 'userId'>>;
  termEndsAt?: Date;
  termStartsAt?: Date;
};

export default function useBallotPreview() {
  const { currentUser } = useCurrentUser();
  const { cacheBallotPreview } = useBallotPreviewContext();

  const createBallotPreview = useCallback(async ({
    candidateTitles: unsanitizedCandidateTitles, maxSelections,
    partialBallotPreview, termEndsAt, termStartsAt,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    const candidateTitles = [...new Set(
      unsanitizedCandidateTitles?.map(sanitizeSingleLineField)
        .filter((c) => c?.length),
    )] as string[];
    const question = sanitizeSingleLineField(partialBallotPreview.question);

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt, e2eEncryptMany } = currentUser;

      ({ errorMessage, id } = await createBallot({
        candidateTitles,
        category: partialBallotPreview.category,
        e2eEncrypt,
        e2eEncryptMany,
        jwt,
        maxSelections,
        nominationsEndAt: partialBallotPreview.nominationsEndAt ?? undefined,
        office: partialBallotPreview.office ?? undefined,
        question,
        termEndsAt,
        termStartsAt,
        votingEndsAt: partialBallotPreview.votingEndsAt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const ballotPreview = {
      ...partialBallotPreview,
      candidateTitles,
      id,
      question,
      userId: currentUser.id,
    } as BallotPreview; // Safe since there was no error from the backend
    cacheBallotPreview(ballotPreview);
    return ballotPreview;
  }, [currentUser]);

  return { createBallotPreview };
}
