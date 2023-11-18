import type {
  BallotCategory, Org, OrgGraph, OrgGraphUser, PaginationData, PostCategory,
  VoteState,
} from '../model';

export type ErrorResponseType = {
  errorMessages: string[];
};

export function isErrorResponse(object: unknown): object is ErrorResponseType {
  const response = (object as ErrorResponseType);
  return response?.errorMessages?.length > 0;
}

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

type BallotResponse = {
  id: string;
};

export function isBallotResponse(object: unknown): object is BallotResponse {
  const response = (object as BallotResponse);
  return response?.id?.length > 0;
}

export type BallotIndexBallot = {
  category: BallotCategory,
  encryptedQuestion: BackendEncryptedMessage;
  id: string;
  votingEndsAt: Date;
};

function isBallotIndexBallot(object: unknown): object is BallotIndexBallot {
  const ballot = (object as BallotIndexBallot);
  return ballot?.id?.length > 0
    && ballot.category?.length > 0
    && isBackendEncryptedMessage(ballot.encryptedQuestion)
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
