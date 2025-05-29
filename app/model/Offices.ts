import { useState } from 'react';
import { fetchOffices as fetchOfficesApi } from '../networking';
import { useCurrentUser } from './context';
import { Office, OfficeCategory } from './types';
import i18n from '../i18n';

type OfficeMetadata = {
  iconName: string;
  title: string;
};

const officeMetadata: { [key: string]: OfficeMetadata } = {
  founder: {
    iconName: 'emoji-objects',
    title: i18n.t('object.officeType.founder'),
  },
  president: {
    iconName: 'stars',
    title: i18n.t('object.officeType.president'),
  },
  vice_president: {
    iconName: 'star',
    title: i18n.t('object.officeType.vicePresident'),
  },
  secretary: {
    iconName: 'border-color',
    title: i18n.t('object.officeType.secretary'),
  },
  treasurer: {
    iconName: 'payments',
    title: i18n.t('object.officeType.treasurer'),
  },
  steward: {
    iconName: 'privacy-tip',
    title: i18n.t('object.officeType.steward'),
  },
  trustee: {
    iconName: 'find-in-page',
    title: i18n.t('object.officeType.trustee'),
  },
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
