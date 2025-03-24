import { useCallback } from 'react';
import useCurrentUser from './CurrentUser';
import {
  createUnionCard as create, fetchUnionCard, UnionCard,
  removeUnionCard as remove,
} from '../../../networking';
import getErrorMessage from '../../ErrorMessage';
import useUnionCardSignatures from '../../UnionCardSignatures';
import { useUnionCardContext } from '../providers';

type CreateProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signatureBytes' | 'signedAt'>
>;

export default function useUnionCard() {
  const { cacheUnionCard, getCachedUnionCard } = useUnionCardContext();
  const unionCard = getCachedUnionCard();

  const { currentUser } = useCurrentUser();
  const { createSignature } = useUnionCardSignatures();

  const createUnionCard = useCallback(async ({
    agreement, email, employerName, homeAddress, name, phone,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    let errorMessage: string | undefined;
    let id: string | undefined;
    let publicKeyBytes: string | undefined;
    let signatureBytes: string | undefined;
    let signedAt: Date | undefined;
    try {
      publicKeyBytes = await currentUser.getEccPublicKey();

      signedAt = new Date();
      signatureBytes = await createSignature({
        agreement, email, employerName, phone, name, publicKeyBytes, signedAt,
      });

      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;

      ({ errorMessage, id } = await create({
        agreement,
        email,
        employerName,
        e2eEncrypt,
        homeAddress,
        jwt,
        name,
        phone,
        signatureBytes,
        signedAt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else {
      // If there's no error message, it's safe to assume that none of these
      // values were undefined
      const createdUnionCard: UnionCard = {
        agreement: agreement!,
        email: email!,
        employerName: employerName!,
        homeAddress,
        id: id!,
        name: name!,
        phone: phone!,
        publicKeyBytes: publicKeyBytes!,
        signatureBytes: signatureBytes!,
        signedAt: signedAt!,
        userId: currentUser.id,
      };
      cacheUnionCard(createdUnionCard);
    }
  }, [currentUser]);

  const refreshUnionCard = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecrypt } = currentUser;
    const {
      errorMessage, unionCard: fetchedUnionCard,
    } = await fetchUnionCard({ e2eDecrypt, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (fetchedUnionCard) {
      cacheUnionCard(fetchedUnionCard);
    }
  }, [currentUser]);

  const removeUnionCard = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage } = await remove({ jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (unionCard && ('signedAt' in unionCard)) {
      // Remove agreement too so that it can be recreated if org info changed
      const {
        agreement, signedAt, signatureBytes, ...unsignedUnionCard
      } = unionCard;
      cacheUnionCard(unsignedUnionCard);
    }
  }, [currentUser, unionCard]);

  return {
    cacheUnionCard,
    createUnionCard,
    refreshUnionCard,
    unionCard,
    removeUnionCard,
  };
}
