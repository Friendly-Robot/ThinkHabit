import React from 'react';
import {
  Platform,
  View,
} from 'react-native';
import { colors } from '../../config/styles';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions, StackActions } from 'react-navigation';

export default class SplashScreen extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Micon name={'brain'} style={styles.brain} />
      </View>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appReady !== nextProps.appReady) {
      nextProps.passNavigationContext(nextProps.navigation);
      const { appSet } = nextProps;
      this.navigationAction = setTimeout(() => {
        // Prevent normal routing if app was opened from notification.
        if (this.props.notification && Platform.OS !== 'ios') return;

        if (appSet) {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'AppNavigator',
              })
            ]
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Selection',
              })
            ]
          });
          this.props.navigation.dispatch(resetAction);
        }
      }, 1500);
    }
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  brain: {
    color: '#FFFFFF',
    fontSize: '75@ms',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'center',
  }
});