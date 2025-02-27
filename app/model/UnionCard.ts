import { useCallback, useState } from 'react';
import { useCurrentUser } from './context';
import {
  createUnionCard as create, fetchUnionCard, UnionCard,
  removeUnionCard as remove,
} from '../networking';
import getErrorMessage from './ErrorMessage';

type CreateProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signatureBytes' | 'signedAt'>
>;

export default function useUnionCard() {
  const [unionCard, setUnionCard] = useState<UnionCard | undefined>();

  const { currentUser } = useCurrentUser();

  const createUnionCard = useCallback(async ({
    agreement, email, employerName, name, phone,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    let errorMessage: string | undefined;
    let id: string | undefined;
    let signatureBytes: string | undefined;
    let signedAt: Date | undefined;
    try {
      const publicKey = await currentUser.getEccPublicKey();

      signedAt = new Date();
      const signedAtIso8601 = signedAt.toISOString();
      const columns = [
        name, email, phone, agreement, signedAtIso8601, employerName, publicKey,
      ];
      const csvRowWithoutSignature = columns.map((c) => `"${c}"`).join(',');
      signatureBytes = await currentUser.sign({
        message: csvRowWithoutSignature,
      });

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
        id: id!,
        name: name!,
        phone: phone!,
        signatureBytes: signatureBytes!,
        signedAt: signedAt!,
        userId: currentUser.id,
      };
      setUnionCard(createdUnionCard);
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

    setUnionCard(fetchedUnionCard);
  }, [currentUser]);

  const removeUnionCard = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage } = await remove({ jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    setUnionCard(undefined);
  }, [currentUser]);

  return {
    createUnionCard, refreshUnionCard, unionCard, removeUnionCard,
  };
}
