import { fromJson } from '../model';
import { get } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { officesURI } from './Routes';
import {
  Authorization, OfficeIndexOffice, isOfficeIndexResponse,
} from './types';

type IndexReturn = {
  errorMessage?: never;
  offices: OfficeIndexOffice[];
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
