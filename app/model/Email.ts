import { Alert, Linking } from 'react-native';
import getErrorMessage from './ErrorMessage';

const SUPPORT_EMAIL = 'GetOrganizeApp@gmail.com';
const MAILTO_BASE_URL = `mailto:${SUPPORT_EMAIL}`;

export default function Email() {
  return {
    openComposer: async () => {
      const url = new URL(MAILTO_BASE_URL);

      try {
        await Linking.openURL(url.href);
      } catch (error) {
        Alert.alert('Failed to open your email app', getErrorMessage(error));
      }
    },
  };
}
