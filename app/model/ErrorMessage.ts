import i18n from '../i18n';

export default function getErrorMessage(error: unknown) {
  const message = i18n.t('result.error.generic');
  return (error instanceof Error) ? error.message : message;
}
