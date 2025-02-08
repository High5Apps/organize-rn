module.exports = {
  plugins: [
    [
      'module:react-native-dotenv',
      {
        allowList: [
          'ENABLE_DEVELOPER_SETTINGS',
        ],
        safe: true,
      },
    ],
    // Reanimated plugin must be listed last
    'react-native-reanimated/plugin',
  ],
  presets: ['module:@react-native/babel-preset'],
};
