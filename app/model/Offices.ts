import { useState } from 'react';
import {
  OfficeIndexOffice, fetchOffices as fetchOfficesApi,
} from '../networking';
import { useUserContext } from './UserContext';
import { Office, isCurrentUserData } from './types';

type OfficeMetadata = {
  iconName: string;
  title: string;
};

const officeMetadata: { [key: string]: OfficeMetadata } = {
  president: { iconName: 'stars', title: 'President' },
  vice_president: { iconName: 'star', title: 'Vice President' },
  secretary: { iconName: 'border-color', title: 'Secretary' },
  treasurer: { iconName: 'payments', title: 'Treasurer' },
  steward: { iconName: 'privacy-tip', title: 'Steward' },
  trustee: { iconName: 'find-in-page', title: 'Trustee' },
};

export function addMetadata(backendOffice: OfficeIndexOffice): Office {
  const metadata = officeMetadata[backendOffice.type] ?? {
    iconName: 'person', title: backendOffice.type,
  };
  return { ...backendOffice, ...metadata };
}

export default function useOffices() {
  const [filledOffices, setFilledOffices] = useState<Office[]>([]);
  const [openOffices, setOpenOffices] = useState<Office[]>([]);

  const { currentUser } = useUserContext();

  async function fetchOffices() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, offices: backendOffices,
    } = await fetchOfficesApi({ jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const offices = backendOffices.map(addMetadata);
    setOpenOffices(offices.filter(({ open }) => open));
    setFilledOffices(offices.filter(({ open }) => !open));
  }

  return { fetchOffices, filledOffices, openOffices };
}
