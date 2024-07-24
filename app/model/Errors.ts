const GENERIC_ERROR_MESSAGE = 'Something unexpected happened. Please try again.';
export function getErrorMessage(error: unknown) {
  return (error instanceof Error) ? error.message : GENERIC_ERROR_MESSAGE;
}

export const OTHER_ORG_ERROR_MESSAGE = "The code you scanned belongs to a member of another Org. You can't connect with people in other Orgs.";
