import { UnionCard } from '../networking';
import { useCurrentUser } from './context';

type CreateSignatureProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signatureBytes'>
>;

export default function useUnionCardSignatures() {
  const { currentUser } = useCurrentUser();

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

  return { createSignature };
}
