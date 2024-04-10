import type {
  BackendEncryptedMessage, BallotCandidate, BallotIndexBallot,
  CommentIndexComment, OrgResponse, PostIndexPost,
} from '../networking';
import type { AESEncryptedData } from './keys';
import type { TimeRemainingOptions } from './TimeRemaining';
import type { PermissionItem, PermissionScope } from './PermissionItems';

export type { PermissionItem, PermissionScope, TimeRemainingOptions };

type EncryptedPrefix = 'encrypted';

type DecryptableKey<S extends string> = (
  S extends `${EncryptedPrefix}${string}` ? S : never
);

type DecryptKey<S extends string> = (
  S extends `${EncryptedPrefix}${infer T}` ? Uncapitalize<T> : S
);

type Decrypt<T> = T extends ReadonlyArray<any> ? T : (
  T extends Array<infer Item> ? Decrypt<Item>[] : (
    T extends object ? {
      [K in keyof T as DecryptKey<K & string>]: (
        K extends DecryptableKey<K & string> ? (
          T[K] extends BackendEncryptedMessage ? string : (
            T[K] extends (BackendEncryptedMessage | undefined)
              ? (string | undefined) : never
          )
        ) : (T[K] extends Date ? Date : Decrypt<T[K]>)
      )
    } : T
  )
);

type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;

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
export type User = {
  connectionCount: number;
  id: string;
  joinedAt: Date;
  offices: Office[];
  pseudonym: string;
  recruitCount: number;
};

export type OrgGraph = {
  userIds: string[];
  connections: [string, string][];
};

export type Org = Decrypt<Omit<OrgResponse, 'graph'>>;

export function isOrg(object: unknown): object is Org {
  const org = (object as Org);
  return (
    org?.id?.length > 0
      && org?.name?.length > 0
      && org?.memberDefinition?.length > 0
  );
}

export type CurrentUserBaseData = {
  authenticationKeyId: string,
  encryptedGroupKey: string,
  id: string,
  localEncryptionKeyId: string,
};

export type CurrentUserData = CurrentUserBaseData & User & {
  org: Org;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  const currentUserData = (object as CurrentUserData);
  return currentUserData
    && isOrg(currentUserData.org)
    && currentUserData.authenticationKeyId?.length > 0
    && currentUserData.encryptedGroupKey?.length > 0
    && currentUserData.localEncryptionKeyId?.length > 0
    && currentUserData.id?.length > 0
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

export type Post = Optional<Decrypt<PostIndexPost>, 'candidateId'>;

export type PaginationData = {
  currentPage: number;
  nextPage: number | null;
};

export type Comment = Decrypt<Omit<CommentIndexComment, 'replies'>>;

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

type NewBallotSubtypeSelectionScreen = 'OfficeAvailability';
type NewBallotScreen = 'NewYesOrNoBallot' | 'NewMultipleChoiceBallot' | 'NewElectionBallot';

export type BallotTypeInfo = {
  category: BallotCategory;
  iconName: string;
  name: string;
  newScreenName: NewBallotScreen;
  subtypeSelectionScreenName?: NewBallotSubtypeSelectionScreen;
};

export type BallotSort = 'active' | 'inactive';

export type BallotPreview = Decrypt<BallotIndexBallot>;

export type { Model } from './ModelCache';

export type Candidate = Require<Decrypt<BallotCandidate>, 'title'>;

export type NominationUser = {
  id: string;
  pseudonym: string;
};

export type Nomination = {
  accepted: boolean | null;
  candidate?: Candidate;
  id: string;
  nominator: NominationUser;
  nominee: NominationUser;
};

export type NonPendingNomination = Nomination & {
  accepted: boolean;
};

export type Result = {
  acceptedOffice?: boolean;
  candidate: Candidate;
  isWinner: boolean;
  rank: number;
  voteCount: number;
};

export type Ballot = BallotPreview & {
  candidates: Candidate[];
  maxCandidateIdsPerVote: number;
  myVote: string[];
  nominations?: Nomination[];
  refreshedAt?: Date;
  results?: Result[];
} & ({
  category: Exclude<BallotCategory, 'election'>;
} | {
  category: 'election';
  termEndsAt: Date;
  termStartsAt: Date;
});
