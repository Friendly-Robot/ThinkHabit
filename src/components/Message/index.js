import React from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';


export default class Message extends React.PureComponent {
  constructor() { 
    super();
    this.opacity = new Animated.Value(0);
    this.timeout;
    this.handleTouchClose = this.handleTouchClose.bind(this);
  }

  render() {
    const {
      closeFunc,
      bodyStyle,
      textStyle,
      // duration,
      message,
      // timeout,
    } = this.props;

    return (
      <Animated.View style={[{ opacity: this.opacity }, styles.container, bodyStyle]}>
        <TouchableOpacity
          activeOpacity={.8}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
          onPress={this.handleTouchClose}
        >
          <Text style={[styles.message, textStyle]}>{ message }</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  componentDidMount() {
    const { closeFunc, duration, timeout } = this.props;
    Animated.timing(
      this.opacity, {
        duration: duration ? duration : 1500,
        toValue: 1,
        useNativeDriver: true,
      }
    ).start();
    this.timeout = setTimeout(() => {
      this.handleTouchClose();
    }, timeout ? timeout : 5500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleTouchClose() {
    Animated.timing(
      this.opacity, {
        duration: 500,
        toValue: 0,
        useNativeDriver: true,
      }
    ).start(() => {
      this.props.closeFunc();
    });
  }
}

import { ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../config/styles';

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: '15@ms',
    bottom: '40@vs',
    justifyContent: 'center',
    marginHorizontal: '15@ms',
    paddingHorizontal: '15@ms',
    paddingVertical: '10@vs',
    position: 'absolute',
    zIndex: 10,
  },
  message: {
    color: '#FFFFFF',
    fontSize: fonts.small,
    textAlign: 'center',
  },
});