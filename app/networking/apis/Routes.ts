// To hit a local dev server at localhost:3000 from Android over USB, run:
// adb reverse tcp:3000 tcp:3000
const host = 'http://localhost:3000'; // TODO: Change based on environment
const version = 'v1';
const apiRoute = `${host}/api/${version}`;

export const orgsURI = `${apiRoute}/orgs`;

export const usersURI = `${apiRoute}/users`;
