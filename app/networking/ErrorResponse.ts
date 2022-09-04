import { ErrorResponseType, isErrorResponse } from './types';

export default function ErrorResponse(response: ErrorResponseType) {
  return {
    errorMessage: response.error_messages[0],
  };
}

export function parseErrorResponse(json: unknown): ErrorResponseType {
  if (!isErrorResponse(json)) {
    throw new Error('Failed to parse error message from json');
  }
  return json;
}
