// @ts-ignore - The library doesn't include types for the mock
import * as mockReactNativeWorklets from 'react-native-worklets/lib/module/mock';

jest.mock('react-native-worklets', () => mockReactNativeWorklets);
