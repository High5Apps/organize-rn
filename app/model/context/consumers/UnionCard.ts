import { useCallback } from 'react';
import useCurrentUser from './CurrentUser';
import {
  createUnionCard as create, fetchUnionCard, UnionCard,
  removeUnionCard as remove,
} from '../../../networking';
import getErrorMessage from '../../ErrorMessage';
import useUnionCardSignatures from '../../UnionCardSignatures';
import { useUnionCardContext } from '../providers';
import { sanitizeSingleLineField } from '../../formatters';

type CreateProps = Partial<Pick<UnionCard, 'agreement' | 'employerName'>>;

export default function useUnionCard() {
  const { cacheUnionCard, getCachedUnionCard } = useUnionCardContext();
  const unionCard = getCachedUnionCard();

  const { currentUser } = useCurrentUser();
  const { createSignature } = useUnionCardSignatures();

  const createUnionCard = useCallback(async ({
    agreement, employerName: unsanitizedEmployerName,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    const {
      department, jobTitle, shift, workGroupId,
    } = unionCard ?? {};
    const email = sanitizeSingleLineField(unionCard?.email);
    const employerName = sanitizeSingleLineField(unsanitizedEmployerName);
    const homeAddressLine1 = sanitizeSingleLineField(
      unionCard?.homeAddressLine1,
    );
    const homeAddressLine2 = sanitizeSingleLineField(
      unionCard?.homeAddressLine2,
    );
    const name = sanitizeSingleLineField(unionCard?.name);
    const phone = sanitizeSingleLineField(unionCard?.phone);

    let errorMessage: string | undefined;
    let id: string | undefined;
    let publicKeyBytes: string | undefined;
    let signatureBytes: string | undefined;
    let signedAt: Date | undefined;
    let updatedWorkGroupId: string | undefined;
    try {
      publicKeyBytes = await currentUser.getEccPublicKey();

      signedAt = new Date();
      signatureBytes = await createSignature({
        ...unionCard, agreement, employerName, publicKeyBytes, signedAt,
      });

      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;

      ({ errorMessage, id, workGroupId: updatedWorkGroupId } = await create({
        agreement,
        department,
        email,
        employerName,
        e2eEncrypt,
        homeAddressLine1,
        homeAddressLine2,
        jobTitle,
        jwt,
        name,
        phone,
        shift,
        signatureBytes,
        signedAt,
        workGroupId,
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
        department,
        email: email!,
        employerName: employerName!,
        homeAddressLine1: homeAddressLine1!,
        homeAddressLine2: homeAddressLine2!,
        jobTitle: jobTitle!,
        id: id!,
        name: name!,
        phone: phone!,
        publicKeyBytes: publicKeyBytes!,
        shift: shift!,
        signatureBytes: signatureBytes!,
        signedAt: signedAt!,
        userId: currentUser.id,
        workGroupId: updatedWorkGroupId!,
      };
      cacheUnionCard(createdUnionCard);
    }
  }, [currentUser, unionCard]);

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
