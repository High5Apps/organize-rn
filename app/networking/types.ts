import type {
  BallotCategory, OfficeCategory, Org, OrgGraph, OrgGraphUser, PaginationData,
  PostCategory, VoteState,
} from '../model';

export type CreateOrgResponse = {
  id: string;
};

export function isCreateOrgResponse(object: unknown): object is CreateOrgResponse {
  const response = (object as CreateOrgResponse);
  return response?.id.length > 0;
}

export type UnpublishedOrg = Omit<Org, 'id'>;

export type CreateUserResponse = {
  id: string;
};

export function isCreateUserResponse(object: unknown): object is CreateUserResponse {
  const response = (object as CreateUserResponse);
  return response?.id.length > 0;
}

export type GetUserResponse = {
  id: string;
  pseudonym: string;
};

export function isGetUserResponse(object: unknown): object is GetUserResponse {
  const response = (object as GetUserResponse);
  return (response?.id.length > 0) && (response?.pseudonym.length > 0);
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

export function isDate(object: unknown): object is Date {
  const date = (object as Date);
  return (date instanceof Date) && !Number.isNaN(date);
}

function isOrgGraphUser(object: unknown): object is OrgGraphUser {
  const user = (object as OrgGraphUser);
  return user?.connectionCount >= 0
    && user.id?.length >= 0
    && isDate(user.joinedAt)
    && user.pseudonym?.length > 0
    && user.recruitCount >= 0;
}

export function isOrgGraph(object: unknown): object is OrgGraph {
  const response = (object as OrgGraph);
  const users = Object.values(response?.users);
  return users.length > 0
    && users.every(isOrgGraphUser)
    && response?.connections?.length >= 0;
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

type CreateCommentResponse = {
  id: string;
};

export function isCreateCommentResponse(object: unknown): object is CreateCommentResponse {
  const response = (object as CreateCommentResponse);
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

type CreateBallotResponse = {
  id: string;
};

export function isCreateBallotResponse(object: unknown): object is CreateBallotResponse {
  const response = (object as CreateBallotResponse);
  return response?.id?.length > 0;
}

export type BallotIndexBallot = {
  category: BallotCategory,
  encryptedQuestion: BackendEncryptedMessage;
  id: string;
  userId: string;
  nominationsEndAt?: Date;
  votingEndsAt: Date;
};

function isBallotIndexBallot(object: unknown): object is BallotIndexBallot {
  const ballot = (object as BallotIndexBallot);
  return ballot?.id?.length > 0
    && ballot.category?.length > 0
    && isBackendEncryptedMessage(ballot.encryptedQuestion)
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
  pseudonym?: never;
} | {
  encryptedTitle?: never;
  id: string;
  pseudonym: string;
};

function isBallotCandidate(object: unknown): object is BallotCandidate {
  const ballotCandidate = (object as BallotCandidate);
  const hasEncryptedMessage = isBackendEncryptedMessage(
    ballotCandidate?.encryptedTitle,
  );
  const hasPseudonym = ballotCandidate?.pseudonym !== undefined;
  return ballotCandidate?.id?.length > 0
    && (
      (hasEncryptedMessage && !hasPseudonym)
        || (!hasEncryptedMessage && hasPseudonym)
    );
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

type BallotResponse = {
  ballot: BallotIndexBallot & {
    maxCandidateIdsPerVote: number;
  };
  candidates: BallotCandidate[];
  myVote: string[];
  results?: BallotResult[];
};

export function isBallotResponse(object: unknown): object is BallotResponse {
  const response = (object as BallotResponse);
  return isBallotIndexBallot(response.ballot)
    && response.ballot.maxCandidateIdsPerVote !== undefined
    && Array.isArray(response?.candidates)
    && response.candidates.every(isBallotCandidate)
    && Array.isArray(response.myVote)
    && (response.results === undefined || (
      Array.isArray(response.results) && response.results.every(isBallotResult)
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

type CreateVoteResponse = {
  id: string;
};

export function isCreateVoteResponse(object: unknown): object is CreateVoteResponse {
  const response = (object as CreateVoteResponse);
  return response?.id?.length > 0;
}

export type OfficeIndexOffice = {
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
