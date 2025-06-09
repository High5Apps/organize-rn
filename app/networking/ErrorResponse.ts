import i18n from '../i18n';

type ErrorResponseType = {
  errorMessages: string[];
};

function isErrorResponse(object: unknown): object is ErrorResponseType {
  const response = (object as ErrorResponseType);
  return response?.errorMessages?.length > 0;
}

export default function ErrorResponse(response: ErrorResponseType) {
  return {
    errorMessage: response.errorMessages[0],
  };
}

type FirstErrorMessage = {
  errorMessage: string;
};

export function parseFirstErrorOrThrow(json: unknown): FirstErrorMessage {
  if (!isErrorResponse(json)) {
    throw new Error(i18n.t('result.error.unexpectedResponse'));
  }

  return {
    errorMessage: json.errorMessages[0],
  };
}
