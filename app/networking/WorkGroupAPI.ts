import { decryptMany, get } from './API';
import { parseFirstErrorOrThrow } from './ErrorResponse';
import { fromJson } from './Json';
import { workGroupsURI } from './Routes';
import {
  Authorization, E2EMultiDecryptor, isWorkGroupIndexResponse, WorkGroup,
} from './types';

type IndexProps = {
  e2eDecryptMany: E2EMultiDecryptor;
};

type IndexReturn = {
  errorMessage?: never;
  workGroups: WorkGroup[];
} | {
  errorMessage: string;
  workGroups?: never;
};

// eslint-disable-next-line import/prefer-default-export
export async function fetchWorkGroups({
  e2eDecryptMany, jwt,
}: IndexProps & Authorization): Promise<IndexReturn> {
  const uri = new URL(workGroupsURI);

  const response = await get({ jwt, uri: uri.href });
  const text = await response.text();
  const json = fromJson(text, {
    convertIso8601ToDate: true,
    convertSnakeToCamel: true,
  });

  if (!response.ok) {
    return parseFirstErrorOrThrow(json);
  }

  if (!isWorkGroupIndexResponse(json)) {
    throw new Error('Failed to parse Work Groups from response');
  }

  const { workGroups: fetchedWorkGroups } = json;
  const encryptedDepartments = fetchedWorkGroups.map(
    (w) => w.encryptedDepartment,
  );
  const encryptedJobTitles = fetchedWorkGroups.map((w) => w.encryptedJobTitle);
  const encryptedShifts = fetchedWorkGroups.map((w) => w.encryptedShift);
  const [departments, jobTitles, shifts] = await Promise.all([
    decryptMany(encryptedDepartments, e2eDecryptMany),
    decryptMany(encryptedJobTitles, e2eDecryptMany),
    decryptMany(encryptedShifts, e2eDecryptMany),
  ]);
  const workGroups = fetchedWorkGroups.map(
    ({
      encryptedDepartment, encryptedJobTitle, encryptedShift, ...w
    }, i) => ({
      ...w,
      department: departments[i],
      jobTitle: jobTitles[i]!,
      shift: shifts[i]!,
    }),
  );

  return { workGroups };
}
