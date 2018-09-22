import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../config/styles';
import Eicon from 'react-native-vector-icons/Entypo';

export default class Header extends React.PureComponent {
  constructor() {
    super();
    this.handleBack = this.handleBack.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
  }
  render() {
    const { 
      backArrow,
      // navigation,
      title,
    } = this.props;
    return (
      <View style={styles.container}>
        { 
          backArrow && 
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.handleBack}
            style={styles.caret}
          >
            <Eicon name={'chevron-left'} style={styles.caretIcon} /> 
          </TouchableOpacity>
        }
        <Text style={[styles.title, backArrow && styles.backTitle]}>{ title ? title : 'Think Habit' }</Text>
        <TouchableOpacity
          activeOpacity={.8}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={this.handleMenu}
          style={styles.menu}
        >
          <Eicon name={'menu'} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  handleBack() {
    this.props.navigation.goBack();
  }

  handleMenu() {
    this.props.navigation.openDrawer();
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  backTitle: {
    left: '45@ms',
  },
  caret: {
    left: '15@ms',
    position: 'absolute',
  },
  caretIcon: {
    color: colors.primary,
    fontSize: fonts.large,
  },
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
  menu: {
    position: 'absolute',
    right: '15@ms',
  },
  menuIcon: {
    color: colors.darkGrey,
    fontSize: fonts.large,
  },
  title: {
    color: colors.primary,
    fontSize: fonts.large,
    fontWeight: 'bold',
    left: '15@ms',
    position: 'absolute',
  },
})