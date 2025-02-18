// @ts-ignore - The library doesn't include types for the mock
import mockKeyboardController from 'react-native-keyboard-controller/jest';

jest.mock('react-native-keyboard-controller', () => mockKeyboardController);
