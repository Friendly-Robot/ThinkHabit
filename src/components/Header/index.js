import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../config/styles';
import Eicon from 'react-native-vector-icons/Entypo'

export default class Header extends React.PureComponent {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
  }
  render() {
    // const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Think Habit</Text>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleMenu}
        >
          <Eicon name={'menu'} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  handleMenu() {
    this.props.navigation.openDrawer();
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: colors.darkGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '65@vs',
    paddingHorizontal: '15@ms',
  },
  menuIcon: {
    color: colors.darkGrey,
    fontSize: fonts.large,
  },
  title: {
    color: colors.primary,
    fontSize: fonts.large,
  },
})