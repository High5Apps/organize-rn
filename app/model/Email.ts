import { Alert, Linking } from 'react-native';
import getErrorMessage from './ErrorMessage';
import { isDefined } from './types';
import i18n from '../i18n';

const SUPPORT_EMAIL = 'GetOrganizeApp@gmail.com';
const MAILTO_BASE_URL = `mailto:${SUPPORT_EMAIL}`;

type Props = {
  body?: string;
  subject?: string;
};

export default function Email({ body, subject }: Props = {}) {
  return {
    openComposer: async () => {
      const queries = Object.entries({ body, subject })
        .filter(([, value]) => isDefined(value))
        .map(([key, value]) => `${key}=${value}`);
      const query = queries.length ? `?${queries.join('&')}` : '';
      const urlString = MAILTO_BASE_URL + query;

      try {
        await Linking.openURL(urlString);
      } catch (error) {
        const title = i18n.t('result.error.openEmailApp');
        Alert.alert(title, getErrorMessage(error));
      }
    },
  };
}
