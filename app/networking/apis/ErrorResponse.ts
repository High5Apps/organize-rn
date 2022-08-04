import { ErrorResponseType } from './types';

export default function ErrorResponse(response: ErrorResponseType) {
  return {
    errorMessage: response.error_messages[0],
  };
}
