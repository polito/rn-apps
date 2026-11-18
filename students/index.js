// sort-imports-ignore
import App from './src/App';

import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-datetimeformat/polyfill';
import '@formatjs/intl-datetimeformat/locale-data/it';
import '@formatjs/intl-datetimeformat/locale-data/en';
import '@formatjs/intl-datetimeformat/add-golden-tz';
import { registerRootComponent } from 'expo';

if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
  Intl.DateTimeFormat.__setDefaultTimeZone('Europe/Rome');
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
