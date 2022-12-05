// To hit a local backend development server over USB, npm run android:tether
// It is not currently easy to hit a local dev server over USB on iOS

export const origin = (
  __DEV__ ? 'http://localhost:3000' : 'https://getorganize.app'
);

const version = 'v1';
const apiRoute = `${origin}/api/${version}`;

export const connectionsURI = `${apiRoute}/connections`;

export const orgsURI = `${apiRoute}/orgs`;
export const orgURI = (orgId: string) => `${orgsURI}/${orgId}`;

export const usersURI = `${apiRoute}/users`;
export const userUri = (userId: string) => `${usersURI}/${userId}`;

export const orgConnectionsURI = (orgId: string) => (
  `${orgURI(orgId)}/connections`
);
