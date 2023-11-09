import type { AESEncryptedData } from './AESModule';

export type OrgGraphUser = {
  connectionCount: number;
  id: string;
  joinedAt: string;
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
  authenticationKeyId: string;
  encryptedGroupKey: string;
  localEncryptionKeyId: string;
  org: Org;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  if (!isUserData(object)) { return false; }
  const currentUserData = (object as CurrentUserData);
  return currentUserData
    && isOrg(currentUserData.org)
    && currentUserData.authenticationKeyId?.length > 0
    && currentUserData.encryptedGroupKey?.length > 0
    && currentUserData.localEncryptionKeyId?.length > 0;
}

export type QRCodeValue = {
  groupKey: string;
  jwt: string;
};

export function isQRCodeValue(object: unknown): object is QRCodeValue {
  const qrCodeValue = (object as QRCodeValue);
  return (qrCodeValue?.jwt?.length > 0) && (qrCodeValue?.groupKey?.length > 0);
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

const POST_CATEGORIES = ['general', 'grievances', 'demands'] as const;
export { POST_CATEGORIES };

type PostCategory = typeof POST_CATEGORIES[number];
export type { PostCategory };

export type VoteState = -1 | 0 | 1;

export type Post = {
  body?: string;
  category: PostCategory,
  createdAt: string;
  id: string;
  myVote: VoteState;
  pseudonym: string;
  score: number;
  title: string;
  userId: string;
};

export type PaginationData = {
  currentPage: number;
  nextPage: number | null;
};

export type Comment = {
  body: string;
  createdAt: string;
  depth: number;
  id: string;
  myVote: VoteState;
  pseudonym: string;
  score: number;
  userId: string;
};

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}

export function isNonNull<T>(argument: T | null): argument is T {
  return argument !== null;
}

export type PostSort = 'new' | 'old' | 'top' | 'hot';

export type { AESEncryptedData } from './AESModule';
export type E2EEncryptor = (message: string) => Promise<AESEncryptedData>;
export type E2EDecryptor = (encryptedMessage: AESEncryptedData) => Promise<string>;
export type E2EMultiDecryptor =
  (encryptedMessages: (AESEncryptedData | null)[]) => Promise<(string | null)[]>;

export type BallotCategory = 'yesOrNo';

export type BallotType = {
  category: BallotCategory;
  iconName: string;
  name: string;
};
