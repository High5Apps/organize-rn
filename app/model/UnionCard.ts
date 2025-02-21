import { useCallback } from 'react';
import { useCurrentUser } from './context';
import { createUnionCard as create, UnionCard } from '../networking';
import getErrorMessage from './ErrorMessage';

type CreateProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signature' | 'signedAt'>
>;

export default function useUnionCard() {
  const { currentUser } = useCurrentUser();

  const createUnionCard = useCallback(async ({
    agreement, email, employerName, name, phone,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    let errorMessage: string | undefined;
    let id: string | undefined;
    let signature: string | undefined;
    let signedAt: Date | undefined;
    try {
      const publicKey = await currentUser.getEccPublicKey();

      signedAt = new Date();
      const signedAtIso8601 = signedAt.toISOString();
      const columns = [
        name, email, phone, agreement, signedAtIso8601, employerName, publicKey,
      ];
      const csvRowWithoutSignature = columns.map((c) => `"${c}"`).join(',');
      signature = await currentUser.sign({
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
        signature,
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
        signature: signature!,
        signedAt: signedAt!,
        userId: currentUser.id,
      };
      return createdUnionCard;
    }
  }, [currentUser]);

  return { createUnionCard };
}
