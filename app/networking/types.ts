export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}

export function isDate(object: unknown): object is Date {
  const date = (object as Date);
  return (date instanceof Date) && !Number.isNaN(date);
}

function isBoolean(object: unknown): object is boolean {
  return [true, false].includes(object as boolean);
}

type EncryptedPrefix = 'encrypted';

type DecryptableKey<S extends string> = (
  S extends `${EncryptedPrefix}${string}` ? S : never
);

type DecryptKey<S extends string> = (
  S extends `${EncryptedPrefix}${infer T}` ? Uncapitalize<T> : S
);

export type Decrypt<T> = T extends ReadonlyArray<any> ? T : (
  T extends Array<infer Item> ? Decrypt<Item>[] : (
    T extends object ? {
      [K in keyof T as DecryptKey<K & string>]: (
        K extends DecryptableKey<K & string> ? (
          T[K] extends BackendEncryptedMessage ? string : (
            T[K] extends (BackendEncryptedMessage | undefined)
              ? (string | undefined) : (
                T[K] extends (BackendEncryptedMessage | null)
                  // (string | undefined) is needed instead of (string | null)
                  // here because API.decryptMany can't differentiate between
                  // null and undefined values after crossing and re-crossing
                  // the native bridge.
                  ? (string | undefined) : never
              )
          )
        ) : (T[K] extends Date ? T[K] : (
          T[K] extends (Date | undefined) ? T[K] : (
            T[K] extends (Date | null) ? T[K] : Decrypt<T[K]>)))
      )
    } : T
  )
);

type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;

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

export type UserResponse = {
  blockedAt?: Date;
  connectionCount: number;
  id: string;
  joinedAt: Date;
  leftOrgAt?: Date;
  offices: OfficeCategory[];
  pseudonym: string;
  recruitCount: number;
};

export function isUserResponse(object: unknown): object is UserResponse {
  const user = (object as UserResponse);
  return user?.connectionCount >= 0
    && ((user.blockedAt === undefined) || isDate(user.blockedAt))
    && user.id?.length > 0
    && isDate(user.joinedAt)
    && ((user.leftOrgAt === undefined) || isDate(user.leftOrgAt))
    && user.pseudonym?.length > 0
    && Array.isArray(user.offices)
    && user.offices.every((category) => category.length > 0)
    && user.recruitCount >= 0;
}

export type User = Decrypt<UserResponse>;

export type UserFilter = 'officer';
export type UserSort = 'low_service' | 'office' | 'service';

export type Authorization = {
  jwt: string;
};

export type BackendEncryptedMessage = {
  c: string;
  n: string;
  t: string;
};

export function isBackendEncryptedMessage(object: unknown): object is BackendEncryptedMessage {
  const message = (object as BackendEncryptedMessage);
  return message?.c?.length > 0
    && message.n?.length > 0
    && message.t?.length > 0;
}

export type PreviewConnectionResponse = {
  org: {
    id: string;
    encryptedName: BackendEncryptedMessage;
    encryptedMemberDefinition: BackendEncryptedMessage;
  };
  user: {
    pseudonym: string;
  };
};

export type ConnectionPreview = {
  org: Org;
  user: {
    pseudonym: string;
  };
};

export function isPreviewConnectionResponse(object: unknown): object is PreviewConnectionResponse {
  const response = (object as PreviewConnectionResponse);
  return (response?.org?.id.length > 0)
    && isBackendEncryptedMessage(response.org?.encryptedName)
    && isBackendEncryptedMessage(response.org.encryptedMemberDefinition)
    && (response.user?.pseudonym.length > 0);
}

export type OrgGraph = {
  blockedUserIds: string[];
  connections: [string, string][];
  leftOrgUserIds: string[];
  userIds: string[];
};

export function isOrgGraph(object: unknown): object is OrgGraph {
  const response = (object as OrgGraph);
  return Array.isArray(response?.connections)
    && response.connections.length >= 0
    && Array.isArray(response.userIds)
    && response.userIds.length > 0
    && response.userIds.every((id) => id.length)
    && Array.isArray(response.blockedUserIds)
    && response.blockedUserIds.every((id) => id.length)
    && Array.isArray(response.leftOrgUserIds)
    && response.leftOrgUserIds.every((id) => id.length);
}

export type OrgResponse = {
  id: string,
  email?: string;
  encryptedEmployerName?: BackendEncryptedMessage;
  encryptedName: BackendEncryptedMessage;
  encryptedMemberDefinition: BackendEncryptedMessage;
};

export function isOrgResponse(object: unknown): object is OrgResponse {
  const response = (object as OrgResponse);
  return response.id?.length > 0
    && ((response.email === undefined) || response.email.length > 0)
    && ((response.encryptedEmployerName === undefined)
      || isBackendEncryptedMessage(response.encryptedEmployerName))
    && isBackendEncryptedMessage(response.encryptedName)
    && isBackendEncryptedMessage(response.encryptedMemberDefinition);
}

export type Org = Decrypt<OrgResponse>;

export function isOrg(object: unknown): object is Org {
  const org = (object as Org);
  return (
    org?.id?.length > 0
      && org?.name?.length > 0
      && org?.memberDefinition?.length > 0
  );
}

export type UnpublishedOrg = Omit<Org, 'id'>;

export type PostSort = 'new' | 'old' | 'top' | 'hot';

type PostResponse = {
  id: string;
  createdAt: Date;
};

export function isPostResponse(object: unknown): object is PostResponse {
  const response = (object as PostResponse);
  return response?.id?.length > 0
    && isDate(response.createdAt);
}

const POST_CATEGORIES = ['general', 'grievances', 'demands'] as const;
export { POST_CATEGORIES };
export type PostCategory = typeof POST_CATEGORIES[number];

export type VoteState = -1 | 0 | 1;

export type PostIndexPost = {
  category: PostCategory;
  candidateId: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  encryptedBody: BackendEncryptedMessage | null;
  encryptedTitle: BackendEncryptedMessage;
  id: string;
  myVote: VoteState;
  pseudonym: string;
  userId: string;
  score: number;
};

function isPostIndexPost(object: unknown): object is PostIndexPost {
  const post = (object as PostIndexPost);
  return post?.id?.length > 0
    && (post.candidateId === null || post.candidateId?.length > 0)
    && post.category?.length > 0
    && (post.deletedAt === null || isDate(post.deletedAt))
    && post.pseudonym?.length > 0
    && (post.encryptedBody === null
      || isBackendEncryptedMessage(post.encryptedBody))
    && isBackendEncryptedMessage(post.encryptedTitle)
    && post.userId?.length > 0
    && isDate(post.createdAt)
    && post.score !== undefined
    && post.myVote !== undefined;
}

export type Post = Optional<Decrypt<PostIndexPost>, 'candidateId'>;

export type PaginationData = {
  currentPage: number;
  nextPage: number | null;
};

function isPaginationData(object: unknown): object is PaginationData {
  const response = (object as PaginationData);
  return response?.currentPage !== undefined
    && response?.nextPage !== undefined;
}

type PostIndexResponse = {
  posts: PostIndexPost[];
  meta: PaginationData;
};

export function isPostIndexResponse(object: unknown): object is PostIndexResponse {
  const response = (object as PostIndexResponse);
  return response?.posts
    && Array.isArray(response.posts)
    && response.posts.every(isPostIndexPost)
    && isPaginationData(response?.meta);
}

type FetchPostResponse = {
  post: PostIndexPost;
};

export function isFetchPostResponse(object: unknown): object is FetchPostResponse {
  const response = (object as FetchPostResponse);
  return isPostIndexPost(response?.post);
}

type CreateModelResponse = {
  id: string;
};

export function isCreateModelResponse(object: unknown): object is CreateModelResponse {
  const response = (object as CreateModelResponse);
  return response?.id?.length > 0;
}

export type BackendComment = {
  blockedAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
  depth: number;
  encryptedBody: BackendEncryptedMessage;
  id: string;
  myVote: VoteState;
  postId: string;
  pseudonym: string;
  score: number;
  userId: string;
  replies: BackendComment[];
};

function isBackendComment(object: unknown): object is BackendComment {
  const comment = (object as BackendComment);
  return isBackendEncryptedMessage(comment.encryptedBody)
    && (comment.blockedAt === null || isDate(comment.blockedAt))
    && isDate(comment.createdAt)
    && (comment.deletedAt === null || isDate(comment.deletedAt))
    && comment.id?.length > 0
    && comment.myVote !== undefined
    && comment.postId?.length > 0
    && comment.pseudonym?.length > 0
    && comment.score !== undefined
    && comment.userId?.length > 0
    && comment.depth >= 0
    && Array.isArray(comment.replies)
    && comment.replies.every(isBackendComment);
}

export type Comment = Decrypt<Omit<BackendComment, 'replies'>>;

type CommentIndexResponse = {
  comments: BackendComment[];
};

export function isCommentIndexResponse(object: unknown): object is CommentIndexResponse {
  const response = (object as CommentIndexResponse);
  return response?.comments
    && Array.isArray(response.comments)
    && response.comments.every(isBackendComment);
}

type CommentThreadResponse = {
  thread: BackendComment;
};

function isCommentThreadComment(object: unknown): object is BackendComment {
  const comment = (object as BackendComment);
  return isBackendComment(comment)
    && (comment.replies.length === 0
      || (comment.replies.length === 1
        && isCommentThreadComment(comment.replies[0])));
}

export function isCommentThreadResponse(object: unknown): object is CommentThreadResponse {
  const response = (object as CommentThreadResponse);
  return response?.thread && isCommentThreadComment(response.thread);
}

export type BallotCategory = 'yes_no' | 'multiple_choice' | 'election' | 'unknown';

export type BallotIndexBallot = {
  category: BallotCategory,
  encryptedQuestion: BackendEncryptedMessage;
  id: string;
  userId: string;
  votingEndsAt: Date;
} & ({
  category: Exclude<BallotCategory, 'election'>;
  nominationsEndAt: null;
  office: null;
} | {
  category: 'election';
  nominationsEndAt: Date;
  office: OfficeCategory;
});

function isBallotIndexBallot(object: unknown): object is BallotIndexBallot {
  const ballot = (object as BallotIndexBallot);
  return ballot?.id?.length > 0
    && ballot.category?.length > 0
    && isBackendEncryptedMessage(ballot.encryptedQuestion)
    && ((ballot.category !== 'election')
        || ((ballot.category === 'election')
          && isDate(ballot.nominationsEndAt)
          && ballot.office?.length > 0)
    )
    && ballot.userId?.length > 0
    && isDate(ballot.votingEndsAt);
}

type BallotIndexResponse = {
  ballots: BallotIndexBallot[];
  meta?: PaginationData;
};

export function isBallotIndexResponse(object: unknown): object is BallotIndexResponse {
  const response = (object as BallotIndexResponse);
  return response?.ballots
    && Array.isArray(response.ballots)
    && response.ballots.every(isBallotIndexBallot)
    && (!response?.meta || isPaginationData(response?.meta));
}

export type BallotPreview = Decrypt<BallotIndexBallot>;

type BallotCandidate = {
  encryptedTitle: BackendEncryptedMessage;
  id: string;
  postId?: never;
  userId?: never;
} | {
  encryptedTitle?: never;
  id: string;
  postId: string | null;
  userId: string;
};

function isBallotCandidate(object: unknown): object is BallotCandidate {
  const ballotCandidate = (object as BallotCandidate);
  const hasEncryptedMessage = isBackendEncryptedMessage(
    ballotCandidate?.encryptedTitle,
  );
  const hasUserId = ballotCandidate?.userId !== undefined;
  return ballotCandidate?.id?.length > 0
    && (
      (hasEncryptedMessage
        && !hasUserId
        && ballotCandidate.postId === undefined)
      || (!hasEncryptedMessage
        && hasUserId
        && (ballotCandidate.postId === null
          || ballotCandidate.postId?.length > 0))
    );
}

export type Candidate = Require<Decrypt<BallotCandidate>, 'title'>;

export type NominationUser = {
  id: string;
  pseudonym: string;
};

function isNominationUser(object: unknown): object is NominationUser {
  const user = (object as NominationUser);
  return user && user.id.length > 0 && user.pseudonym.length > 0;
}

type BallotNomination = {
  accepted: boolean | null;
  id: string;
  nominator: NominationUser;
  nominee: NominationUser;
};

function isBallotNomination(object: unknown): object is BallotNomination {
  const nomination = (object as BallotNomination);
  return nomination
    && [null, false, true].includes(nomination.accepted)
    && nomination.id?.length > 0
    && isNominationUser(nomination.nominator)
    && isNominationUser(nomination.nominee);
}

export type Nomination = Decrypt<BallotNomination> & {
  candidate?: Candidate;
};

type BallotResult = {
  candidateId: string;
  rank: number;
  voteCount: number;
};

function isBallotResult(object: unknown): object is BallotResult {
  const ballotResult = (object as BallotResult);
  return ballotResult.candidateId.length > 0
    && ballotResult.rank >= 0
    && ballotResult.voteCount !== undefined;
}

type BallotTerm = {
  accepted: boolean;
  userId: string;
};

function isBallotTerm(object: unknown): object is BallotTerm {
  const ballotTerm = (object as BallotTerm);
  return ballotTerm.accepted !== undefined
    && ballotTerm.userId.length > 0;
}

type BallotResponse = {
  ballot: BallotIndexBallot & {
    maxCandidateIdsPerVote: number;
  } & ({
    category: Exclude<BallotCategory, 'election'>;
  } | {
    category: 'election';
    termEndsAt: Date;
    termStartsAt: Date;
  });
  candidates: BallotCandidate[];
  myVote: string[];
  nominations?: BallotNomination[];
  refreshedAt: Date;
  results?: BallotResult[];
  terms?: BallotTerm[];
};

export function isBallotResponse(object: unknown): object is BallotResponse {
  const response = (object as BallotResponse);
  return isBallotIndexBallot(response.ballot)
    && response.ballot.maxCandidateIdsPerVote !== undefined
    && ((response.ballot.category !== 'election')
      || (isDate(response.ballot.termEndsAt)
        && isDate(response.ballot.termStartsAt)))
    && Array.isArray(response?.candidates)
    && response.candidates.every(isBallotCandidate)
    && Array.isArray(response.myVote)
    && (response.nominations === undefined || (
      Array.isArray(response.nominations)
        && response.nominations.every(isBallotNomination)
    ))
    && isDate(response.refreshedAt)
    && (response.results === undefined || (
      Array.isArray(response.results) && response.results.every(isBallotResult)
    ))
    && (response.terms === undefined || (
      Array.isArray(response.terms) && response.terms.every(isBallotTerm)
    ));
}

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

export type UpdateNominationResponse = {
  candidate: {
    id: string | null;
  };
  nomination: {
    accepted: boolean | null;
    id: string;
  };
};

export function isUpdateNominationResponse(object: unknown): object is UpdateNominationResponse {
  const response = (object as UpdateNominationResponse);
  return response?.candidate
    && (response.candidate.id === null || response.candidate.id?.length > 0)
    && [null, true, false].includes(response.nomination?.accepted)
    && response.nomination.id?.length > 0;
}

export type OfficeAvailability = {
  open: boolean;
  type: OfficeCategory;
};

function isOfficeAvailability(object: unknown): object is OfficeAvailability {
  const response = (object as OfficeAvailability);
  return response?.open !== undefined && response.type.length > 0;
}

type OfficeIndexResponse = {
  offices: OfficeAvailability[];
};

export function isOfficeIndexResponse(object: unknown): object is OfficeIndexResponse {
  const response = (object as OfficeIndexResponse);
  return response?.offices
    && Array.isArray(response.offices)
    && response.offices.every(isOfficeAvailability);
}

type UserIndexResponse = {
  meta?: PaginationData;
  users: UserResponse[],
};

export function isUserIndexResponse(object: unknown): object is UserIndexResponse {
  const response = (object as UserIndexResponse);
  return response?.users
    && Array.isArray(response.users)
    && response.users.every(isUserResponse)
    && (!response?.meta || isPaginationData(response?.meta));
}

type PermissionResponse = {
  permission: {
    offices: OfficeCategory[];
  };
};

export function isPermissionResponse(object: unknown): object is PermissionResponse {
  const response = (object as PermissionResponse);
  return Array.isArray(response?.permission?.offices)
    && response.permission.offices.every((office) => office?.length > 0);
}

export type PermissionScope = 'blockMembers' | 'createElections' | 'editOrg'
  | 'editPermissions' | 'editWorkGroups' | 'moderate' | 'viewUnionCards';

type PermissionData = {
  offices: OfficeCategory[];
};

export type Permission = {
  scope: PermissionScope;
  data: PermissionData;
};

export type MyPermission = {
  permitted: boolean;
  scope: PermissionScope;
};

export type MyPermissionsResponse = {
  myPermissions: MyPermission[];
};

export function isMyPermission(object: unknown): object is MyPermission {
  const myPermission = (object as MyPermission);
  return isBoolean(myPermission?.permitted) && myPermission?.scope?.length > 0;
}

export function isMyPermissionsResponse(object: unknown): object is MyPermissionsResponse {
  const response = (object as MyPermissionsResponse);
  return Array.isArray(response?.myPermissions)
    && response.myPermissions.every(isMyPermission);
}

export type ModerationEventAction = 'allow' | 'block' | 'undo_allow' | 'undo_block';

type FlagReportsModerationEventResponse = {
  action: ModerationEventAction;
  createdAt: Date;
  id: string;
  moderator: {
    id: string;
    pseudonym: string;
  };
};

function isFlagReportsModerationEventResponse(
  object: unknown,
): object is FlagReportsModerationEventResponse {
  const response = (object as FlagReportsModerationEventResponse);
  return response?.action?.length > 0
    && isDate(response.createdAt)
    && response.id?.length > 0
    && response.moderator?.id?.length > 0
    && response.moderator.pseudonym?.length > 0;
}

export type FlaggableType = 'Ballot' | 'Comment' | 'Post';

export type Flaggable = {
  category: FlaggableType;
  creator: {
    id: string;
    pseudonym: string;
  };
  deletedAt: Date | null;
  encryptedTitle: BackendEncryptedMessage;
  id: string;
};

export type FlagReportResponse = {
  flaggable: Flaggable;
  flagCount: number;
  moderationEvent?: FlagReportsModerationEventResponse;
};

export function isFlagReportResponse(object: unknown): object is FlagReportResponse {
  const response = (object as FlagReportResponse);
  return response?.flaggable
    && response.flaggable.category?.length > 0
    && response.flaggable.creator?.id.length > 0
    && response.flaggable.creator.pseudonym?.length > 0
    && isBackendEncryptedMessage(response.flaggable.encryptedTitle)
    && response.flaggable.id?.length > 0
    && response.flagCount > 0
    && (!response?.moderationEvent
      || isFlagReportsModerationEventResponse(response.moderationEvent)
    );
}

export type FlagReport = Decrypt<Omit<FlagReportResponse, 'moderationEvent'>> & {
  id: string;
} & {
  moderationEvent?: ModerationEvent;
};

type FlagReportsIndexResponse = {
  flagReports: FlagReportResponse[];
  meta?: PaginationData;
};

export function isFlagReportsIndexResponse(object: unknown): object is FlagReportsIndexResponse {
  const response = (object as FlagReportsIndexResponse);
  return response?.flagReports
    && Array.isArray(response.flagReports)
    && response.flagReports.every(isFlagReportResponse)
    && isPaginationData(response?.meta);
}

export type ModeratableType = FlaggableType | 'User';
export type Moderatable = {
  category: ModeratableType;
  creator: {
    id: string;
    pseudonym: string;
  },
  id: string;
};
export type ModerationEvent = {
  action: ModerationEventAction;
  createdAt: Date;
  id?: string;
  moderatable: Moderatable,
  moderator: {
    id: string;
    pseudonym: string;
  };
};

function isModerationEvent(object: unknown): object is ModerationEvent {
  const response = (object as ModerationEvent);
  return response?.action?.length > 0
    && isDate(response.createdAt)
    && response.id !== undefined // Require id from backend
    && response.id?.length > 0
    && response.moderatable?.category?.length > 0
    && response.moderatable.creator?.id?.length > 0
    && response.moderatable.creator?.pseudonym?.length > 0
    && response.moderatable.id?.length > 0
    && response.moderator?.id?.length > 0
    && response.moderator?.pseudonym?.length > 0;
}

type ModerationEventsIndexResponse = {
  moderationEvents: Required<ModerationEvent>[];
  meta: PaginationData;
};

export function isModerationEventsIndexResponse(
  object: unknown,
): object is ModerationEventsIndexResponse {
  const response = (object as ModerationEventsIndexResponse);
  return response?.moderationEvents
    && Array.isArray(response.moderationEvents)
    && response.moderationEvents.every(isModerationEvent)
    && isPaginationData(response?.meta);
}

export type AESEncryptedData = {
  base64EncryptedMessage: string;
  base64InitializationVector: string;
  base64IntegrityCheck: string;
};
export type E2EEncryptor = (message: string) => Promise<AESEncryptedData>;
export type E2EMultiEncryptor =
  (messages: string[]) => Promise<AESEncryptedData[]>;
export type E2EDecryptor = (encryptedMessage: AESEncryptedData) => Promise<string>;
export type E2EMultiDecryptor =
  (encryptedMessages: (AESEncryptedData | null)[]) => Promise<(string | null)[]>;
export type E2EDecryptorWithExposedKey =
  (props: AESEncryptedData & { base64Key: string }) => Promise<string>;

export type UnionCardResponse = {
  encryptedAgreement: BackendEncryptedMessage;
  encryptedDepartment: BackendEncryptedMessage | null;
  encryptedEmail: BackendEncryptedMessage;
  encryptedEmployerName: BackendEncryptedMessage;
  encryptedHomeAddressLine1: BackendEncryptedMessage;
  encryptedHomeAddressLine2: BackendEncryptedMessage;
  encryptedJobTitle: BackendEncryptedMessage;
  encryptedName: BackendEncryptedMessage;
  encryptedPhone: BackendEncryptedMessage;
  encryptedShift: BackendEncryptedMessage;
  id: string;
  publicKeyBytes: string;
  signatureBytes: string;
  signedAt: Date;
  userId: string;
  workGroupId: string
};

export function isUnionCardResponse(object: unknown): object is UnionCardResponse {
  const unionCard = (object as UnionCardResponse);
  return unionCard?.id?.length > 0
    && isBackendEncryptedMessage(unionCard.encryptedAgreement)
    && isBackendEncryptedMessage(unionCard.encryptedEmail)
    && isBackendEncryptedMessage(unionCard.encryptedEmployerName)
    && (unionCard.encryptedDepartment === null
      || isBackendEncryptedMessage(unionCard.encryptedDepartment))
    && isBackendEncryptedMessage(unionCard.encryptedHomeAddressLine1)
    && isBackendEncryptedMessage(unionCard.encryptedHomeAddressLine2)
    && isBackendEncryptedMessage(unionCard.encryptedJobTitle)
    && isBackendEncryptedMessage(unionCard.encryptedName)
    && isBackendEncryptedMessage(unionCard.encryptedPhone)
    && isBackendEncryptedMessage(unionCard.encryptedShift)
    && unionCard.publicKeyBytes?.length > 0
    && unionCard.signatureBytes?.length > 0
    && isDate(unionCard.signedAt)
    && unionCard.userId?.length > 0
    && unionCard.workGroupId?.length > 0;
}

export type UnionCard = Decrypt<UnionCardResponse>;

type UnionCardIndexResponse = {
  unionCards: UnionCardResponse[];
  meta: PaginationData;
};

export function isUnionCardIndexResponse(object: unknown): object is UnionCardIndexResponse {
  const response = (object as UnionCardIndexResponse);
  return response?.unionCards
    && Array.isArray(response.unionCards)
    && response.unionCards.every(isUnionCardResponse)
    && isPaginationData(response?.meta);
}

export type CreateUnionCardResponse = {
  id: string;
  workGroupId: string;
};

export function isCreateUnionCardResponse(object: unknown): object is CreateUnionCardResponse {
  const response = (object as CreateUnionCardResponse);
  return response?.id?.length > 0
    && response.workGroupId?.length > 0;
}

export type WorkGroupResponse = {
  encryptedDepartment: BackendEncryptedMessage | null;
  encryptedJobTitle: BackendEncryptedMessage;
  encryptedShift: BackendEncryptedMessage;
  id: string;
  memberCount: number;
};

export function isWorkGroupResponse(object: unknown): object is WorkGroupResponse {
  const workGroup = (object as WorkGroupResponse);
  return workGroup?.id?.length > 0
    && (workGroup.encryptedDepartment === null
      || isBackendEncryptedMessage(workGroup.encryptedDepartment))
    && isBackendEncryptedMessage(workGroup.encryptedJobTitle)
    && isBackendEncryptedMessage(workGroup.encryptedShift)
    && workGroup.memberCount > 0;
}

export type WorkGroup = Decrypt<WorkGroupResponse>;

type WorkGroupIndexResponse = {
  workGroups: WorkGroupResponse[];
};

export function isWorkGroupIndexResponse(object: unknown): object is WorkGroupIndexResponse {
  const response = (object as WorkGroupIndexResponse);
  return response?.workGroups
    && Array.isArray(response.workGroups)
    && response.workGroups.every(isWorkGroupResponse);
}
