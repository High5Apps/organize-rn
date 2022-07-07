/**
 * @format
 */

// Reanimated must be the first import
import 'react-native-reanimated';

// Polyfills
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
