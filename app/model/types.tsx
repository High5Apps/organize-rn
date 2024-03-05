import type { AESEncryptedData } from './keys';

export type OrgGraph = {
  users: {
    [id: string]: UserPreview;
  };
  connections: [string, string][];
};

export type Org = {
  id: string;
  name: string;
  memberDefinition: string;
  graph?: OrgGraph;
};

export function isOrg(object: unknown): object is Org {
  const org = (object as Org);
  return (
    org?.id?.length > 0
      && org?.name?.length > 0
      && org?.memberDefinition?.length > 0
  );
}

export type CurrentUserData = {
  authenticationKeyId: string;
  encryptedGroupKey: string;
  id: string;
  localEncryptionKeyId: string;
  org: Org;
  orgId: string;
  pseudonym: string;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  const currentUserData = (object as CurrentUserData);
  return currentUserData
    && isOrg(currentUserData.org)
    && currentUserData.authenticationKeyId?.length > 0
    && currentUserData.encryptedGroupKey?.length > 0
    && currentUserData.localEncryptionKeyId?.length > 0
    && currentUserData.id?.length > 0
    && currentUserData.orgId?.length > 0
    && currentUserData.pseudonym?.length > 0;
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
  createdAt: Date;
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
  createdAt: Date;
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

export type E2EEncryptor = (message: string) => Promise<AESEncryptedData>;
export type E2EMultiEncryptor =
  (messages: string[]) => Promise<AESEncryptedData[]>;
export type E2EDecryptor = (encryptedMessage: AESEncryptedData) => Promise<string>;
export type E2EMultiDecryptor =
  (encryptedMessages: (AESEncryptedData | null)[]) => Promise<(string | null)[]>;

export type BallotCategory = 'yes_no' | 'multiple_choice' | 'election';

export type BallotType = {
  category: BallotCategory;
  iconName: string;
  name: string;
};

type NewBallotSubtypeSelectionScreen = 'OfficeType';
type NewBallotScreen = 'NewYesOrNoBallot' | 'NewMultipleChoiceBallot' | 'NewElectionBallot';

export type BallotTypeInfo = {
  category: BallotCategory;
  iconName: string;
  name: string;
  newScreenName: NewBallotScreen;
  subtypeSelectionScreenName?: NewBallotSubtypeSelectionScreen;
};

export type BallotSort = 'active' | 'inactive';

export type BallotPreview = {
  category: BallotCategory;
  id: string;
  question: string;
  userId: string;
  votingEndsAt: Date;
} & ({
  category: Exclude<BallotCategory, 'election'>;
  nominationsEndAt: null;
  office: null;
} | {
  category: Extract<BallotCategory, 'election'>;
  nominationsEndAt: Date;
  office: OfficeCategory;
});

export type { Model } from './ModelCache';

export type Candidate = {
  id: string;
  title: string;
};

export type Result = {
  candidate: Candidate;
  rank: number;
  voteCount: number;
};

export type Ballot = BallotPreview & {
  candidates: Candidate[];
  maxCandidateIdsPerVote: number;
  myVote: string[];
  results?: Result[];
};

const OFFICE_CATEGORIES = [
  'founder',
  'president',
  'vice_president',
  'secretary',
  'treasurer',
  'steward',
  'trustee',
] as const;
export { OFFICE_CATEGORIES };
export type OfficeCategory = typeof OFFICE_CATEGORIES[number];

export type Office = {
  iconName: string;
  open?: boolean;
  title: string;
  type: OfficeCategory;
};

export type OfficeDuty = {
  category: OfficeCategory;
  duties: string[];
};

export type UserFilter = 'officer';
export type UserSort = 'office' | 'service';
export type UserPreview = {
  connectionCount: number;
  id: string;
  joinedAt: Date;
  offices: Office[];
  pseudonym: string;
  recruitCount: number;
};
