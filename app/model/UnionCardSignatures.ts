import { UnionCard } from '../networking';
import { useCurrentUser } from './context';
import { Keys } from './keys';

type CreateSignatureProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signatureBytes'>
>;

export default function useUnionCardSignatures() {
  const { currentUser } = useCurrentUser();
  const { verify } = Keys().ecc;

  function getUnsignedData({
    agreement, email, employerName, phone, name, publicKeyBytes, signedAt,
  }: CreateSignatureProps) {
    const columns = [
      name, email, phone, agreement, signedAt?.toISOString(), employerName,
      publicKeyBytes,
    ];
    const unsignedRow = columns.map((c) => `"${c}"`).join(',');
    return unsignedRow;
  }

  async function createSignature(props: CreateSignatureProps) {
    if (!currentUser) { throw new Error('Expected current user'); }

    const unsignedData = getUnsignedData(props);
    const signatureBytes = await currentUser.sign({ message: unsignedData });
    return signatureBytes;
  }

  async function verifyAll({ unionCards }: { unionCards: UnionCard[] }) {
    const messagesToVerify = unionCards.map((unionCard) => ({
      message: getUnsignedData(unionCard),
      publicKey: unionCard.publicKeyBytes,
      signature: unionCard.signatureBytes,
    }));
    const verificationPromises = messagesToVerify.map(verify);
    const verifieds = await Promise.all(verificationPromises);
    const verificationResults = messagesToVerify
      .map(({ message }, i) => ({ message, verified: verifieds[i] }));
    return verificationResults;
  }

  return { createSignature, verifyAll };
}
