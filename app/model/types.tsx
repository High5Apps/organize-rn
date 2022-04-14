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

export type User = {
  id: string;
  name?: string;
};

export function isUser(object: unknown): object is User {
  const user = (object as User);
  return user?.id?.length > 0;
}

export type QRCodeValue = {
  expiration: number;
  org: Org;
  sharedBy: User;
};

export function isQRCodeValue(object: unknown): object is QRCodeValue {
  const qrCodeValue = (object as QRCodeValue);
  return (
    qrCodeValue?.expiration > 0
      && isOrg(qrCodeValue.org)
      && isUser(qrCodeValue.sharedBy)
  );
}
