// For more info, see https://reactnavigation.org/docs/testing

// Silence the warning: Animated: `useNativeDriver` is not supported because the
// native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

export {};
