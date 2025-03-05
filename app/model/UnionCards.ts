/* eslint-disable no-await-in-loop */

import { fetchUnionCards as _fetchUnionCards } from '../networking';
import { useCurrentUser } from './context';
import { formatDate } from './formatters';
import useReplaceableFile from './ReplaceableFile';
import useUnionCardSignatures from './UnionCardSignatures';

const parentFolder = 'union-cards';
const HEADER_ROW = 'Name,Email,Phone,Agreement,Signed At,Employer Name,Public Key PEM,Signature,Signature Verified\n';

export default function useUnionCards() {
  const { currentUser } = useCurrentUser();
  const { verifyAll } = useUnionCardSignatures();
  const {
    appendToReplacement, commitReplacement, createReplacement, filePath, ready,
  } = useReplaceableFile({ parentFolder });

  async function fetchUnionCards(page: number, createdAtOrBefore: Date) {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, paginationData, unionCards,
    } = await _fetchUnionCards({
      createdAtOrBefore, e2eDecryptMany, jwt, page,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const hasNextPage = paginationData!.nextPage !== null;
    return { hasNextPage, unionCards };
  }

  async function recreateFile() {
    const createdAtOrBefore = new Date();
    let page = 0;
    let hasNextPage = true;
    let shouldCommit = false;
    while (hasNextPage) {
      page += 1; // First page starts at 1

      const response = await fetchUnionCards(page, createdAtOrBefore);
      hasNextPage = response.hasNextPage;

      if (response.unionCards) {
        if (page === 1) {
          const formattedDate = formatDate(createdAtOrBefore, 'fullFileName');
          const name = `union-cards_${formattedDate}.csv`;
          await createReplacement({ name });
          await appendToReplacement({ data: HEADER_ROW });
          shouldCommit = true;
        }

        const results = await verifyAll({ unionCards: response.unionCards });
        const rows = response.unionCards.map((unionCard, i) => {
          const { message, verified } = results[i];
          const signature = unionCard.signatureBytes;
          return `${message},"${signature}","${verified}"\n`;
        });
        const data = rows.join();
        await appendToReplacement({ data });
      }
    }

    if (shouldCommit) {
      await commitReplacement();
    }
  }

  return { filePath, ready, recreateFile };
}
