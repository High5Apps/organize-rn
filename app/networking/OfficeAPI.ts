import { get } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { officesURI } from './Routes';
import {
  Authorization, isOfficeIndexResponse, OfficeAvailability,
} from './types';

type IndexReturn = {
  errorMessage?: never;
  offices: OfficeAvailability[];
} | {
  errorMessage: string;
  offices?: never;
};

// eslint-disable-next-line import/prefer-default-export
export async function fetchOffices({
  jwt,
}: Authorization): Promise<IndexReturn> {
  const response = await get({ jwt, uri: officesURI });
  const text = await response.text();
  const json = fromJson(text, {
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isOfficeIndexResponse(json)) {
    throw new Error('Failed to parse Offices from response');
  }

  return json;
}
