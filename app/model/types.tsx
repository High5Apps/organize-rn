export type OrgGraphUser = {
  connectionCount: number;
  id: string;
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
  authenticationKeyId: string;
  org: Org;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  if (!isUserData(object)) { return false; }
  const currentUserData = (object as CurrentUserData);
  return isOrg(currentUserData.org)
    && currentUserData?.authenticationKeyId?.length > 0;
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

const POST_CATEGORIES = ['general', 'grievances', 'demands'] as const;
export { POST_CATEGORIES };

type PostCategory = typeof POST_CATEGORIES[number];
export type { PostCategory };

export type VoteState = -1 | 0 | 1;

export type Post = {
  body?: string;
  category: PostCategory,
  createdAt: number;
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
  createdAt: number;
  depth: number;
  id: string;
  myVote: VoteState;
  pseudonym: string;
  score: number;
  userId: string;
  replies: Comment[];
};

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}

export type PostSort = 'new' | 'old' | 'top' | 'hot';
