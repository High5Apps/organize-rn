// To hit a local backend development server over USB, npm run tether:android
// It is not currently easy to hit a local dev server over USB on iOS

import { camelToSnake } from './Json';
import { PermissionScope } from './types';

const prodOrigin = 'https://getorganize.app';
const origin = __DEV__ ? 'http://localhost:8080' : prodOrigin;

export const appStoreURI = ({ ref }: { ref: string }) => `${prodOrigin}/store?ref=${ref}`;
export const privacyPolicyURI = `${prodOrigin}/privacy`;
export const termsOfServiceURI = `${prodOrigin}/terms`;

const version = 'v1';
const apiRoute = `${origin}/api/${version}`;

export const ballotsURI = `${apiRoute}/ballots`;
export const ballotURI = (ballotId: string) => `${ballotsURI}/${ballotId}`;
export const candidatesURI = (ballotId: string) => `${ballotURI(ballotId)}/candidates`;
export const nominationsURI = (ballotId: string) => `${ballotURI(ballotId)}/nominations`;
export const termsURI = (ballotId: string) => `${ballotURI(ballotId)}/terms`;

export const connectionsURI = `${apiRoute}/connections`;
export const connectionPreviewURI = `${apiRoute}/connection_preview`;

export const flagsURI = `${apiRoute}/flags`;
export const flagReportsURI = `${apiRoute}/flag_reports`;

export const leaveOrgURI = `${apiRoute}/leave_org`;

export const verifyURI = `${apiRoute}/verify`;

export const moderationEventsURI = `${apiRoute}/moderation_events`;

export const nominationURI = (nominationId: string) => `${apiRoute}/nominations/${nominationId}`;

export const officesURI = `${apiRoute}/offices`;

export const orgsURI = `${apiRoute}/orgs`;
export const orgURI = `${apiRoute}/org`;

export const permissionsURI = `${apiRoute}/permissions`;
export const permissionURI = (scope: PermissionScope) => {
  const snakeScope = camelToSnake(scope);
  return `${permissionsURI}/${snakeScope}`;
};
export const myPermissionsURI = `${apiRoute}/my_permissions`;

export const postsURI = `${apiRoute}/posts`;
export const postURI = (postId: string) => `${apiRoute}/posts/${postId}`;
export const postUpvotesURI = (postId: string) => `${postURI(postId)}/upvotes`;

export const commentsURI = (postId: string) => `${postURI(postId)}/comments`;
const commentURI = (commentId: string) => `${apiRoute}/comments/${commentId}`;
export const commentThreadURI = (commentId: string) => `${commentURI(commentId)}/thread`;
export const commentUpvotesURI = (commentId: string) => `${commentURI(commentId)}/upvotes`;
export const repliesURI = (commentId: string) => `${commentURI(commentId)}/comments`;

export const usersURI = `${apiRoute}/users`;
export const userUri = (userId: string) => `${usersURI}/${userId}`;

export const votesURI = (ballotId: string) => `${ballotURI(ballotId)}/votes`;
