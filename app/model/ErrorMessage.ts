const GENERIC_ERROR_MESSAGE = 'Something unexpected happened. Please try again.';

export default function getErrorMessage(error: unknown) {
  return (error instanceof Error) ? error.message : GENERIC_ERROR_MESSAGE;
}
