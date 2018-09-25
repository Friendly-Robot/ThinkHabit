import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../config/styles';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Eicon from 'react-native-vector-icons/Entypo';


export default class Header extends React.PureComponent {
  constructor() {
    super();
    this.handleBack = this.handleBack.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleNavigateToBookmarks = this.handleNavigateToBookmarks.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
  }

  render() {
    const { 
      backArrow,
      // navigation,
      // navigateToBookmarks,
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
        <TouchableOpacity
          activeOpacity={.8}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={this.handleHome}
          style={[styles.titleContainer, backArrow && styles.backTitle]}
        >
          <Text style={styles.title}>{ title }</Text>
        </TouchableOpacity>
        {
          title === 'Think Habit' &&
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.handleNavigateToBookmarks}
            style={styles.bookmark}
          >
            <Aicon name={'bookmark'} style={styles.bookmarkIcon} />
          </TouchableOpacity>
        }
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

  handleHome() {
    this.props.navigation.navigate('Habits');
  }

  handleBack() {
    if (this.props.subTitle === 'Stem') {
      // Used to manually update StemCard when navigating from a notification.
      this.props.navigation.navigate('Habits', { refresh: this.props.stemId });
      return;
    }
    this.props.navigation.goBack();
  }

  handleNavigateToBookmarks() {
    if (this.props.navigateToBookmarks) {
      this.props.navigateToBookmarks();
    } else {
      this.props.navigation.navigate('Habits', { bookmarks: true });
    }
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
  bookmark: {
    position: 'absolute',
    right: '55@ms',
  },
  bookmarkIcon: {
    color: colors.primary,
    fontSize: fonts.medium,
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
  },
  titleContainer: {
    left: '15@ms',
    position: 'absolute',
  },
})