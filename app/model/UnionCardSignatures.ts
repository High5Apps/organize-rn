import { UnionCard } from '../networking';
import useCurrentUser from './context/consumers/CurrentUser';
import { Keys } from './keys';

// Comma, newline, and double quotes are all special characters in CSV files
const NEEDS_ESCAPING_REGEX = /["\n,]/;

export function escapeCSVField(value?: string): string {
  if (value === undefined) { return ''; }

  const needsEscaping = NEEDS_ESCAPING_REGEX.test(value);
  if (!needsEscaping) { return value; }

  // Escape any existing double quotes by doubling them and wrap the field in
  // double quotes
  return `"${value.replaceAll('"', '""')}"`;
}

type CreateSignatureProps = Partial<
  Omit<UnionCard, 'id' | 'userId' | 'signatureBytes' | 'workGroupId'>
>;

export default function useUnionCardSignatures() {
  const { currentUser } = useCurrentUser();
  const { verify } = Keys().ecc;

  function getUnsignedData({
    agreement, department, email, employerName, homeAddressLine1,
    homeAddressLine2, jobTitle, phone, name, publicKeyBytes, shift, signedAt,
  }: CreateSignatureProps) {
    const homeAddress = `${homeAddressLine1}\n${homeAddressLine2}`;
    const columns = [
      name, email, phone, agreement, signedAt?.toISOString(), employerName,
      publicKeyBytes, homeAddress, jobTitle, shift, department,
    ];
    const unsignedRow = columns.map(escapeCSVField).join(',');
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
