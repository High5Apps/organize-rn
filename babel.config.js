module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Reanimated plugin must be listed last
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
