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
  ],
  presets: ['module:@react-native/babel-preset'],
};
