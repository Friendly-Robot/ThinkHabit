import React from 'react';
import {
  View,
} from 'react-native';
// import styles from './styles';

export default class Habits extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>

      </View>
    )
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  }
})