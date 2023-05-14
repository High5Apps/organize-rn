import 'react-native-webview';

// For more info, see:
// https://github.com/react-native-webview/react-native-webview/pull/2686#issuecomment-1425865443
jest.mock('react-native-webview', () => ({
  default: () => jest.fn(),
}));
