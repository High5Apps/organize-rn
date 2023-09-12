import type { Org, PostCategory, VoteState } from '../model';
import type { SnakeToCamelCaseNested } from './SnakeCaseToCamelCase';

export type ErrorResponseType = {
  error_messages: string[];
};

export function isErrorResponse(object: unknown): object is ErrorResponseType {
  const response = (object as ErrorResponseType);
  return response?.error_messages?.length > 0;
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

type PreviewConnectionResponse = {
  org: {
    id: string,
    name: string,
    potential_member_definition: string,
  },
  user: {
    pseudonym: string,
  }
};

export type ConnectionPreview = SnakeToCamelCaseNested<PreviewConnectionResponse>;

export function isPreviewConnectionResponse(object: unknown): object is PreviewConnectionResponse {
  const response = (object as PreviewConnectionResponse);
  return (response?.org?.id.length > 0)
    && (response?.org?.name.length > 0)
    && (response?.org?.potential_member_definition.length > 0)
    && (response?.user?.pseudonym.length > 0);
}

type OrgGraphResponse = {
  users: {
    [id: string]: {
      connection_count: number;
      id: string;
      joined_at: number;
      offices?: string[];
      pseudonym: string;
      recruit_count: number;
    }
  };
  connections: [string, string][];
};

export function isOrgGraphResponse(object: unknown): object is OrgGraphResponse {
  const response = (object as OrgGraphResponse);
  const firstUser = Object.values(response?.users)[0];
  return Object.keys(response?.users).length > 0
    && firstUser?.connection_count >= 0
    && firstUser?.id?.length >= 0
    && firstUser?.joined_at > 0
    && firstUser?.pseudonym?.length > 0
    && firstUser?.recruit_count >= 0
    && response?.connections?.length >= 0;
}

type OrgResponse = {
  graph: OrgGraphResponse,
  id: string,
  name: string,
  potential_member_definition: string,
};

export function isOrgResponse(object: unknown): object is OrgResponse {
  const response = (object as OrgResponse);
  return isOrgGraphResponse(response?.graph)
    && response?.id?.length > 0
    && response?.name?.length > 0
    && response?.potential_member_definition?.length > 0;
}

type PostResponse = {
  id: string;
};

export function isPostResponse(object: unknown): object is PostResponse {
  const response = (object as PostResponse);
  return response?.id?.length > 0;
}

type PostIndexPost = {
  body?: string;
  category: PostCategory,
  created_at: number;
  id: string;
  my_vote: VoteState;
  pseudonym: string;
  title: string;
  user_id: string;
  score: number;
};

function isPostIndexPost(object: unknown): object is PostIndexPost {
  const post = (object as PostIndexPost);
  return post?.id?.length > 0
    && post.category?.length > 0
    && post.pseudonym?.length > 0
    && post.title?.length > 0
    && post.user_id?.length > 0
    && post.created_at !== undefined
    && post.score !== undefined
    && post.my_vote !== undefined;
}

type PaginationData = {
  current_page: number;
  next_page: number | null;
};

function isPaginationData(object: unknown): object is PaginationData {
  const response = (object as PaginationData);
  return response?.current_page !== undefined
    && response?.next_page !== undefined;
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

type CommentIndexComment = {
  body: string;
  created_at: number;
  id: string;
  pseudonym: string;
  user_id: string;
};

function isCommentIndexComment(object: unknown): object is CommentIndexComment {
  const comment = (object as CommentIndexComment);
  return comment?.body?.length > 0
    && comment.created_at !== undefined
    && comment.id?.length > 0
    && comment.pseudonym?.length > 0
    && comment.user_id?.length > 0;
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
