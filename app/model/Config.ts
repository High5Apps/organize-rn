import {
  ENABLE_DEVELOPER_SETTINGS as ENABLE_DEVELOPER_SETTINGS_STRING,
} from '@env';

// eslint-disable-next-line import/prefer-default-export
export const ENABLE_DEVELOPER_SETTINGS = (
  ENABLE_DEVELOPER_SETTINGS_STRING === 'true'
);
