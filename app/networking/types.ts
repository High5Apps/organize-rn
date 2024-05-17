import type {
  BallotCategory, FlaggableType, MyPermission, Nomination, NominationUser,
  OfficeCategory, Org, OrgGraph, PaginationData, PostCategory, User, VoteState,
} from '../model';

export type UnpublishedOrg = Omit<Org, 'id'>;

export function isDate(object: unknown): object is Date {
  const date = (object as Date);
  return (date instanceof Date) && !Number.isNaN(date);
}

export type UserResponse = Omit<User, 'offices'> & {
  offices: OfficeCategory[];
};

export function isUserResponse(object: unknown): object is UserResponse {
  const user = (object as UserResponse);
  return user?.connectionCount >= 0
    && user.id?.length > 0
    && isDate(user.joinedAt)
    && user.pseudonym?.length > 0
    && Array.isArray(user.offices)
    && user.offices.every((category) => category.length > 0)
    && user.recruitCount >= 0;
}

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

export function isOrgGraph(object: unknown): object is OrgGraph {
  const response = (object as OrgGraph);
  return Array.isArray(response?.connections)
    && response.connections.length >= 0
    && Array.isArray(response.userIds)
    && response.userIds.length > 0
    && response.userIds.every((id) => id.length);
}

export type OrgResponse = {
  graph: OrgGraph,
  id: string,
  encryptedName: BackendEncryptedMessage;
  encryptedMemberDefinition: BackendEncryptedMessage;
};

export function isOrgResponse(object: unknown): object is OrgResponse {
  const response = (object as OrgResponse);
  return isOrgGraph(response?.graph)
    && response.id?.length > 0
    && isBackendEncryptedMessage(response.encryptedName)
    && isBackendEncryptedMessage(response.encryptedMemberDefinition);
}

type PostResponse = {
  id: string;
  createdAt: Date;
};

export function isPostResponse(object: unknown): object is PostResponse {
  const response = (object as PostResponse);
  return response?.id?.length > 0
    && isDate(response.createdAt);
}

export type PostIndexPost = {
  category: PostCategory;
  candidateId: string | null;
  createdAt: Date;
  encryptedBody?: BackendEncryptedMessage;
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
    && post.pseudonym?.length > 0
    && isBackendEncryptedMessage(post.encryptedTitle)
    && post.userId?.length > 0
    && isDate(post.createdAt)
    && post.score !== undefined
    && post.myVote !== undefined;
}

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

export type CommentIndexComment = {
  createdAt: Date;
  depth: number;
  encryptedBody: BackendEncryptedMessage;
  id: string;
  myVote: VoteState;
  pseudonym: string;
  score: number;
  userId: string;
  replies: CommentIndexComment[];
};

function isCommentIndexComment(object: unknown): object is CommentIndexComment {
  const comment = (object as CommentIndexComment);
  return isBackendEncryptedMessage(comment.encryptedBody)
    && isDate(comment.createdAt)
    && comment.id?.length > 0
    && comment.myVote !== undefined
    && comment.pseudonym?.length > 0
    && comment.score !== undefined
    && comment.userId?.length > 0
    && comment.depth >= 0
    && Array.isArray(comment.replies)
    && comment.replies.every(isCommentIndexComment);
}

type CommentIndexResponse = {
  comments: CommentIndexComment[];
};

export function isCommentIndexResponse(object: unknown): object is CommentIndexResponse {
  const response = (object as CommentIndexResponse);
  return response?.comments
    && Array.isArray(response.comments)
    && response.comments.every(isCommentIndexComment);
}

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

export type BallotCandidate = {
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

function isNominationUser(object: unknown): object is NominationUser {
  const user = (object as NominationUser);
  return user && user.id.length > 0 && user.pseudonym.length > 0;
}

function isBallotNomination(object: unknown): object is Nomination {
  const nomination = (object as Nomination);
  return nomination
    && [null, false, true].includes(nomination.accepted)
    && nomination.id?.length > 0
    && isNominationUser(nomination.nominator)
    && isNominationUser(nomination.nominee);
}

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
  nominations?: Nomination[];
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

type OfficeIndexOffice = {
  open: boolean;
  type: OfficeCategory;
};

function isOfficeIndexOffice(object: unknown): object is OfficeIndexOffice {
  const response = (object as OfficeIndexOffice);
  return response?.open !== undefined && response.type.length > 0;
}

type OfficeIndexResponse = {
  offices: OfficeIndexOffice[];
};

export function isOfficeIndexResponse(object: unknown): object is OfficeIndexResponse {
  const response = (object as OfficeIndexResponse);
  return response?.offices
    && Array.isArray(response.offices)
    && response.offices.every(isOfficeIndexOffice);
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

export type MyPermissionsResponse = {
  myPermissions: MyPermission[];
};

export function isMyPermission(object: unknown): object is MyPermission {
  const myPermission = (object as MyPermission);
  return [true, false].includes(myPermission?.permitted)
    && myPermission?.scope?.length > 0;
}

export function isMyPermissionsResponse(object: unknown): object is MyPermissionsResponse {
  const response = (object as MyPermissionsResponse);
  return Array.isArray(response?.myPermissions)
    && response.myPermissions.every(isMyPermission);
}

export type ModerationEventAction = 'allow' | 'block' | 'undo_allow' | 'undo_block';
export type ModerationEvent = {
  action: ModerationEventAction;
  createdAt: Date;
  moderator: {
    id: string;
    pseudonym: string;
  };
};
export function isModerationEventResponse(object: unknown): object is ModerationEvent {
  const response = (object as ModerationEvent);
  return response?.action?.length > 0
    && isDate(response.createdAt)
    && response.moderator?.id?.length > 0
    && response.moderator.pseudonym?.length > 0;
}

export type Flaggable = {
  category: FlaggableType;
  creator: {
    id: string;
    pseudonym: string;
  };
  encryptedTitle: BackendEncryptedMessage;
  id: string;
};

export type FlagReportResponse = {
  flaggable: Flaggable;
  flagCount: number;
  moderationEvent?: ModerationEvent;
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
      || isModerationEventResponse(response.moderationEvent)
    );
}

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
