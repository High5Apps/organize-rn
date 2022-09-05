// For more info, see https://reactnavigation.org/docs/testing

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line global-require
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// https://github.com/software-mansion/react-native-reanimated/issues/1380#issuecomment-865143328
// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
global.__reanimatedWorkletInit = jest.fn();

// Silence the warning: Animated: `useNativeDriver` is not supported because the
// native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
