module.exports = {
  root: true,
  extends: [
    'airbnb',
    '@kesills/airbnb-typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    projectService: true,
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-console': ['warn', { allow: ['error', 'warn'] }],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/function-component-definition': 'off',
        'no-empty': ['error', { 'allowEmptyCatch': true }],
        'react/require-default-props': 'off',
      },
    },
  ],
};
