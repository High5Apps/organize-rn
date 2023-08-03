export type OrgGraphUser = {
  connectionCount: number;
  joinedAt: number;
  pseudonym: string;
  offices?: string[];
  recruitCount: number;
};

export type OrgGraph = {
  users: {
    [id: string]: OrgGraphUser;
  };
  connections: [string, string][];
};

export type Org = {
  id: string;
  name: string;
  potentialMemberDefinition: string;
  graph?: OrgGraph;
};

export function isOrg(object: unknown): object is Org {
  const org = (object as Org);
  return (
    org?.id?.length > 0
      && org?.name?.length > 0
      && org?.potentialMemberDefinition?.length > 0
  );
}

export type UserData = {
  id: string;
  orgId: string;
  pseudonym: string;
};

export function isUserData(object: unknown): object is UserData {
  const user = (object as UserData);
  return user?.id?.length > 0
    && user?.orgId?.length > 0
    && user?.pseudonym?.length > 0;
}

export type CurrentUserData = UserData & {
  org: Org;
  publicKeyId: string;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  if (!isUserData(object)) { return false; }
  const currentUserData = (object as CurrentUserData);
  return isOrg(currentUserData.org)
    && currentUserData?.publicKeyId?.length > 0;
}

export type QRCodeValue = {
  jwt: string;
};

export function isQRCodeValue(object: unknown): object is QRCodeValue {
  const qrCodeValue = (object as QRCodeValue);
  return qrCodeValue?.jwt?.length > 0;
}

export type SettingsItem = {
  iconName: string;
  onPress: () => void;
  title: string;
};

export type SettingsSection = {
  title: string;
  data: SettingsItem[];
};

// Must return a base64 encoded signature (not base64Url)
export type Signer = ({ message }: { message: string }) => Promise<string>;

export type Scope = '*' | 'create:connections';
