import React from 'react';
import {
  View,
} from 'react-native';
import Header from '../../components/Header';

export default class About extends React.PureComponent {
  render() {
    const { 
      navigation 
    } = this.props;

    return (
      <View style={styles.container}>
        <Header navigation={navigation} title={'About'} />
      </View>
    )
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  }
})