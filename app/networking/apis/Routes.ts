// To hit a local backend development server over USB, npm run android:tether
const host = 'http://localhost:3000'; // TODO: Change based on environment
const version = 'v1';
const apiRoute = `${host}/api/${version}`;

export const connectionsURI = `${apiRoute}/connections`;

export const orgsURI = `${apiRoute}/orgs`;

export const usersURI = `${apiRoute}/users`;
