import { AppRegistry, Text, YellowBox } from 'react-native';
import App from './src/App';
Text.defaultProps.allowFontScaling = false;
YellowBox.ignoreWarnings([]);
YellowBox.ignoreWarnings(
  [
    'Warning: isMounted(...) is deprecated', 
    'Module RCTImageLoader',

    'Warning: Class RCTCxxModule was not exported', 
    'Module RCTCxxModule',
    'Class RCTCxxModule',
  ]
);
AppRegistry.registerComponent('ThinkHabit', () => App);
