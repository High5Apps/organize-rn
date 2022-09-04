// To hit a local backend development server over USB, npm run android:tether

// TODO: Change based on environment
export const host = 'http://localhost:3000';

const version = 'v1';
const apiRoute = `${host}/api/${version}`;

export const connectionsURI = `${apiRoute}/connections`;

export const orgsURI = `${apiRoute}/orgs`;
export const orgURI = (orgId: string) => `${orgsURI}/${orgId}`;

export const usersURI = `${apiRoute}/users`;

export const orgConnectionsURI = (orgId: string) => (
  `${orgURI(orgId)}/connections`
);
