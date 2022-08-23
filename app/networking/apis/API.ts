type Props = {
  bodyObject: any;
  jwt?: string;
  uri: string;
};

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// eslint-disable-next-line import/prefer-default-export
export async function post({ bodyObject, jwt, uri }: Props) {
  let optionalHeaders = {};
  if (jwt) {
    optionalHeaders = { Authorization: `Bearer ${jwt}` };
  }

  const response = await fetch(uri, {
    method: 'POST',
    headers: { ...defaultHeaders, ...optionalHeaders },
    body: JSON.stringify(bodyObject),
  });
  return response;
}
