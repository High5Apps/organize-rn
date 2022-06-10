export type Org = {
  id: string;
  name: string;
  potentialMemberCount: number;
  potentialMemberDefinition: string;
};

export function isOrg(object: unknown): object is Org {
  const org = (object as Org);
  return (
    org?.id?.length > 0
      && org?.name?.length > 0
      && org?.potentialMemberCount > 0
      && org?.potentialMemberDefinition?.length > 0
  );
}

export type UserData = {
  id: string;
  orgId: string;
};

export function isUserData(object: unknown): object is UserData {
  const user = (object as UserData);
  return (
    user?.id?.length > 0
      && user?.orgId.length > 0
  );
}

export type QRCodeValue = {
  expiration: number;
  org: Org;
  sharedBy: UserData;
};

export function isQRCodeValue(object: unknown): object is QRCodeValue {
  const qrCodeValue = (object as QRCodeValue);
  return (
    qrCodeValue?.expiration > 0
      && isOrg(qrCodeValue.org)
      && isUserData(qrCodeValue.sharedBy)
  );
}

export type { UserContextProviderProps, UserContextType } from './UserContext';
