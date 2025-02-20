import { useCallback } from 'react';
import { useCurrentUser } from './context';
import { createUnionCard as create, UnionCard } from '../networking';
import getErrorMessage from './ErrorMessage';

type CreateProps = Omit<UnionCard, 'id' | 'userId'>;

export default function useUnionCard() {
  const { currentUser } = useCurrentUser();

  const createUnionCard = useCallback(async ({
    agreement, email, employerName, name, phone, signature, signedAt,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;

      ({ errorMessage, id } = await create({
        agreement,
        email,
        employerName,
        e2eEncrypt,
        jwt,
        name,
        phone,
        signature,
        signedAt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else {
      const createdUnionCard: UnionCard = {
        agreement,
        email,
        employerName,
        id: id!,
        name,
        phone,
        signature,
        signedAt,
        userId: currentUser.id,
      };
      return createdUnionCard;
    }
  }, [currentUser]);

  return { createUnionCard };
}
