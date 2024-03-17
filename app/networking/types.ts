import type {
  BallotCategory, Nomination, NominationUser, OfficeCategory, Org, OrgGraph,
  PaginationData, PostCategory, User, VoteState,
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
  org: Omit<Org, 'graph'>;
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
  category: PostCategory,
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

type BallotCandidate = {
  encryptedTitle: BackendEncryptedMessage;
  id: string;
  userId?: never;
} | {
  encryptedTitle?: never;
  id: string;
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
      (hasEncryptedMessage && !hasUserId)
        || (!hasEncryptedMessage && hasUserId)
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
    && (response.results === undefined || (
      Array.isArray(response.results) && response.results.every(isBallotResult)
    ))
    && (response.terms === undefined || (
      Array.isArray(response.terms) && response.terms.every(isBallotTerm)
    ));
}

export type CandidateIndexCandidate = {
  encryptedTitle: BackendEncryptedMessage;
  id: string;
};

function isCandidateIndexCandidate(object: unknown): object is CandidateIndexCandidate {
  const candidate = (object as CandidateIndexCandidate);
  return candidate?.id?.length > 0
    && isBackendEncryptedMessage(candidate.encryptedTitle);
}

type CandidateIndexResponse = {
  candidates: CandidateIndexCandidate[];
};

export function isCandidateIndexResponse(object: unknown): object is CandidateIndexResponse {
  const response = (object as CandidateIndexResponse);
  return response?.candidates
    && Array.isArray(response.candidates)
    && response.candidates.every(isCandidateIndexCandidate);
}

export type UpdateNominationResponse = {
  nomination: {
    accepted: boolean | null;
    id: string;
  };
};

export function isUpdateNominationResponse(object: unknown): object is UpdateNominationResponse {
  const response = (object as UpdateNominationResponse);
  return response?.nomination?.accepted !== undefined
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
