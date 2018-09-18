import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
YellowBox.ignoreWarnings([]);
YellowBox.ignoreWarnings(
  [
    'Warning: isMounted(...) is deprecated', 
    'Module RCTImageLoader',
  ]
)
AppRegistry.registerComponent('ThinkHabit', () => App);
