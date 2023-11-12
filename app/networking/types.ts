import type { Org, PostCategory, VoteState } from '../model';

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
    encrypted_name: BackendEncryptedMessage;
    encrypted_potential_member_definition: BackendEncryptedMessage;
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
    && isBackendEncryptedMessage(response.org?.encrypted_name)
    && isBackendEncryptedMessage(response.org.encrypted_potential_member_definition)
    && (response.user?.pseudonym.length > 0);
}

type OrgGraphResponse = {
  users: {
    [id: string]: {
      connection_count: number;
      id: string;
      joined_at: string;
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
    && firstUser?.joined_at.length > 0
    && firstUser?.pseudonym?.length > 0
    && firstUser?.recruit_count >= 0
    && response?.connections?.length >= 0;
}

export type OrgResponse = {
  graph: OrgGraphResponse,
  id: string,
  encrypted_name: BackendEncryptedMessage;
  encrypted_potential_member_definition: BackendEncryptedMessage;
};

export function isOrgResponse(object: unknown): object is OrgResponse {
  const response = (object as OrgResponse);
  return isOrgGraphResponse(response?.graph)
    && response.id?.length > 0
    && isBackendEncryptedMessage(response.encrypted_name)
    && isBackendEncryptedMessage(response.encrypted_potential_member_definition);
}

type PostResponse = {
  id: string;
  created_at: string;
};

export function isPostResponse(object: unknown): object is PostResponse {
  const response = (object as PostResponse);
  return response?.id?.length > 0
    && response?.created_at?.length > 0;
}

export type PostIndexPost = {
  category: PostCategory,
  created_at: string;
  encrypted_body?: BackendEncryptedMessage;
  encrypted_title: BackendEncryptedMessage;
  id: string;
  my_vote: VoteState;
  pseudonym: string;
  user_id: string;
  score: number;
};

function isPostIndexPost(object: unknown): object is PostIndexPost {
  const post = (object as PostIndexPost);
  return post?.id?.length > 0
    && post.category?.length > 0
    && post.pseudonym?.length > 0
    && isBackendEncryptedMessage(post.encrypted_title)
    && post.user_id?.length > 0
    && post.created_at?.length > 0
    && post.score !== undefined
    && post.my_vote !== undefined;
}

export type PaginationData = {
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

export type CommentIndexComment = {
  created_at: string;
  depth: number;
  encrypted_body: BackendEncryptedMessage;
  id: string;
  my_vote: VoteState;
  pseudonym: string;
  score: number;
  user_id: string;
  replies: CommentIndexComment[];
};

function isCommentIndexComment(object: unknown): object is CommentIndexComment {
  const comment = (object as CommentIndexComment);
  return isBackendEncryptedMessage(comment.encrypted_body)
    && comment.created_at?.length > 0
    && comment.id?.length > 0
    && comment.my_vote !== undefined
    && comment.pseudonym?.length > 0
    && comment.score !== undefined
    && comment.user_id?.length > 0
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

type DecryptKey<S extends string> = (
  S extends `encrypted_${infer T}` ? T : S
);

export type Decrypt<T> = T extends ReadonlyArray<any> ? (
  T
) : (
  T extends Array<infer Item> ? (
    Decrypt<Item>[]
  ) : (
    T extends object ? {
      [K in keyof T as DecryptKey<K & string>] : (
        T[K] extends (BackendEncryptedMessage | undefined) ? string : Decrypt<T[K]>
      )
    } : T
  )
);

type BallotResponse = {
  id: string;
};

export function isBallotResponse(object: unknown): object is BallotResponse {
  const response = (object as BallotResponse);
  return response?.id?.length > 0;
}
