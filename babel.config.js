module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
        'module:react-native-dotenv',
        {
          safe: true,
          allowUndefined: false,
        }
    ],
    // Reanimated plugin must be listed last
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
