type Props = {
  bodyObject: any;
  uri: string;
};

// eslint-disable-next-line import/prefer-default-export
export async function post({ bodyObject, uri }: Props) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObject),
  });
  return response;
}
