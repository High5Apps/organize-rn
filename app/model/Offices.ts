import { useState } from 'react';
import { fetchOffices as fetchOfficesApi } from '../networking';
import { useCurrentUser } from './context';
import { Office, OfficeCategory } from './types';

type OfficeMetadata = {
  iconName: string;
  title: string;
};

const officeMetadata: { [key: string]: OfficeMetadata } = {
  founder: { iconName: 'emoji-objects', title: 'Founder' },
  president: { iconName: 'stars', title: 'President' },
  vice_president: { iconName: 'star', title: 'Vice President' },
  secretary: { iconName: 'border-color', title: 'Secretary' },
  treasurer: { iconName: 'payments', title: 'Treasurer' },
  steward: { iconName: 'privacy-tip', title: 'Steward' },
  trustee: { iconName: 'find-in-page', title: 'Trustee' },
};

type Options = {
  open?: boolean;
};

export const getOffice = (
  category: OfficeCategory,
  maybeOptions?: Options,
): Office => ({
  ...officeMetadata[category],
  ...(maybeOptions ?? {}),
  type: category,
});

export default function useOfficeAvailability() {
  const [filledOffices, setFilledOffices] = useState<Office[]>([]);
  const [openOffices, setOpenOffices] = useState<Office[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function fetchOffices() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, offices: fetchedOffices,
    } = await fetchOfficesApi({ jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const offices = fetchedOffices.map(
      ({ open, type }) => getOffice(type, { open }),
    );

    setOpenOffices(offices.filter(({ open }) => open));
    setFilledOffices(offices.filter(({ open }) => !open));

    setReady(true);
  }

  return {
    fetchOffices, filledOffices, openOffices, ready,
  };
}
