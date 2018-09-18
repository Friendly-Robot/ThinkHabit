import React from 'react';
import {
  View,
} from 'react-native';
import styles from './styles';

export default class Stem extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>

      </View>
    )
  }
}

import { ScaledSheet } from 'react-native-size-matters';

export default styles = ScaledSheet.create({
  container: {
    flex: 1,
  }
})