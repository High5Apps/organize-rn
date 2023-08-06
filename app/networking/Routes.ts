// To hit a local backend development server over USB, npm run tether:android
// It is not currently easy to hit a local dev server over USB on iOS

// To hit a local backend development server from the emulator, change the
// origin below to use 'http://10.0.2.2:3000'. For more info, see
// https://developer.android.com/studio/run/emulator-networking#networkaddresses

export const origin = (
  __DEV__ ? 'http://localhost:3000' : 'https://getorganize.app'
);

const version = 'v1';
const apiRoute = `${origin}/api/${version}`;

export const connectionsURI = `${apiRoute}/connections`;
export const connectionPreviewURI = (sharerJwt: string) => `${apiRoute}/connection_preview?sharer_jwt=${sharerJwt}`;

export const orgsURI = `${apiRoute}/orgs`;
export const orgURI = `${apiRoute}/org`;

export const postsURI = `${apiRoute}/posts`;

export const usersURI = `${apiRoute}/users`;
export const userUri = (userId: string) => `${usersURI}/${userId}`;
