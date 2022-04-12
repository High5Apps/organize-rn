export type Org = {
  id: string;
  name: string;
  potentialMemberCount: number;
  potentialMemberDefinition: string;
};

export type User = {
  id: string;
  name?: string;
};

export type QRCodeValue = {
  expiration: number;
  org: Org;
  sharedBy: User;
};
