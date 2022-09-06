export enum Status {
  Success = 200,
  Unauthorized = 401,
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function headers(jwt?: string) {
  let optionalHeaders = {};
  if (jwt) {
    optionalHeaders = { Authorization: `Bearer ${jwt}` };
  }

  return { ...defaultHeaders, ...optionalHeaders };
}

type GetProps = {
  jwt?: string;
  uri: string;
};

export async function get({ jwt, uri }: GetProps) {
  const response = await fetch(uri, {
    method: 'GET',
    headers: headers(jwt),
  });
  return response;
}

type PostProps = {
  bodyObject: any;
  jwt?: string;
  uri: string;
};

export async function post({ bodyObject, jwt, uri }: PostProps) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: headers(jwt),
    body: JSON.stringify(bodyObject),
  });
  return response;
}
