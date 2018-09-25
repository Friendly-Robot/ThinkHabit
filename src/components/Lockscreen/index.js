import React from 'react';
import {
  Animated,
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import styles from './styles';
import Aicon from 'react-native-vector-icons/FontAwesome';


export default class Lockscreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animateX = new Animated.Value(0);
    this.state = {
      focused: 0,
      message: props.message,
      showHint: false,
      pass0: '',
      pass1: '',
      pass2: '',
      pass3: '',
    };
    this.handleHint = this.handleHint.bind(this);
  }
  render() {
    const {
      closeLockscreen,
      // handleUnlock,
      // message,
      passcode,
      visible,
      // playTap,
    } = this.props;

    const {
      focused,
      message,
      pass0,
      pass1,
      pass2,
      pass3,
      showHint,
    } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={closeLockscreen}
      >
        <View style={styles.container}>
          <StatusBar hidden />

          <Text style={styles.message}>{ message }</Text>

          <TouchableOpacity 
            activeOpacity={.8}
            onPress={closeLockscreen}
            style={styles.closeContainer}
          >
            <Aicon name={'close'} style={styles.close} />
          </TouchableOpacity>

          <Animated.View style={[styles.inputsContainer, this.getAnimatedStyle()]}>
            <TouchableOpacity 
              activeOpacity={.8}
              onPress={() => this.handleFocus(0)}
              style={styles.inputContainer}
            >
              <Text style={styles.input}>{ pass0 }</Text>
              <View style={[styles.underline, focused === 0 ? styles.orange : styles.white]} />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={.8}
              onPress={() => this.handleFocus(1)}
              style={styles.inputContainer}
            >
              <Text style={styles.input}>{ pass1 }</Text>
              <View style={[styles.underline, focused === 1 ? styles.orange : styles.white]} />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={.8}
              onPress={() => this.handleFocus(2)}
              style={styles.inputContainer}
            >
              <Text style={styles.input}>{ pass2 }</Text>
              <View style={[styles.underline, focused === 2 ? styles.orange : styles.white]} />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={.8}
              onPress={() => this.handleFocus(3)}
              style={styles.inputContainer}
            >
              <Text style={styles.input}>{ pass3 }</Text>
              <View style={[styles.underline, focused === 3 ? styles.orange : styles.white]} />
            </TouchableOpacity>
          </Animated.View>

          <View>
            <View style={styles.keyRow}>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('1')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('2')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('3')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyRow}>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('4')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('5')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('6')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>6</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyRow}>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('7')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('8')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('9')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>9</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.keyRow, styles.keyCenter]}>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={() => this.handleKey('0')}
                style={styles.keyContainer}
              >
                <Text style={styles.key}>0</Text>
              </TouchableOpacity>
            </View>
          </View>

          {
            showHint || passcode === '' ?
            null
            :
            <TouchableOpacity
              activeOpacity={.8}
              hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}                  
              onPress={this.handleHint}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgot}>Forgot your passcode?</Text>
            </TouchableOpacity>
          }
        </View>
      </Modal>
    )
  }

  handleFocus(focused) {
    switch (focused) {
      case 0:
        this.setState({ focused, pass0: '' });
        return;
      case 1:
        this.setState({ focused, pass1: '' });
        return;
      case 2:
        this.setState({ focused, pass2: '' });
        return;
      case 3:
        this.setState({ focused, pass3: '' });
        return;
    }
  }

  handleKey(key) {
    // this.props.playTap();
    const { focused, pass0, pass1, pass2, pass3 } = this.state;
    switch (focused) {
      case 0:
        this.setState({ pass0: key, focused: 1 }, () => {
          if (key && pass1 && pass2 && pass3) {
            const passcode = key + pass1 + pass2 + pass3;
            if (passcode.length === 4) this.handleSubmit();
          }
        })
        break;
      case 1:
        this.setState({ pass1: key, focused: 2 }, () => {
          if (pass0 && key && pass2 && pass3) {
            const passcode = pass0 + key + pass2 + pass3;
            if (passcode.length === 4) this.handleSubmit();
          }
        })
        break;
      case 2:
        this.setState({ pass2: key, focused: 3 }, () => {
          if (pass0 && pass1 && key && pass3) {
            const passcode = pass0 + pass1 + key + pass3;
            if (passcode.length === 4) this.handleSubmit();
          }
        })
        break;
      case 3:
        this.setState({ pass3: key, focused: null }, () => {
          this.handleSubmit();
        })
        break;
    }
  }

  handleSubmit() {
    const { pass0, pass1, pass2, pass3 } = this.state;
    const passcode = pass0 + pass1 + pass2 + pass3;
    const { message } = this.state;
    if (message === 'Setup passcode' || message === 'Enter current passcode' || message === 'Enter new passcode' || message === 'Retype passcode') {
      const { handleUnlock } = this.props;
      if (message === 'Setup passcode' || message === 'Enter new passcode') {
        this.newPasscode = passcode;
        this.setState({ message: 'Retype passcode', pass0: '', pass1: '', pass2: '', pass3: '' });
        this.handleFocus(0);
      } else if (message === 'Enter current passcode') {
        if (passcode !== this.props.passcode) {
          const pattern = Platform.OS === 'android' ? [0, 500, 500, 500] : [0, 500];
          Vibration.vibrate(pattern);
          this.animateError();
          this.setState({ pass0: '', pass1: '', pass2: '', pass3: '' });
          this.handleFocus(0);
        } else {
          this.setState({ message: 'Enter new passcode', pass0: '', pass1: '', pass2: '', pass3: '' });
          this.handleFocus(0);
        }
      } else if (message === 'Retype passcode') {
        if (passcode === this.newPasscode) {
          setTimeout(() => handleUnlock(passcode), 0);
        } else {
          const pattern = Platform.OS === 'android' ? [0, 500, 500, 500] : [0, 500];
          Vibration.vibrate(pattern);
          this.setState({ pass0: '', pass1: '', pass2: '', pass3: '' });
          this.handleFocus(0);
        }
      }
    } else {
      if (this.props.passcode === passcode) {
        setTimeout(() => this.props.handleUnlock(), 0);
      } else {
        const pattern = Platform.OS === 'android' ? [0, 500, 500, 500] : [0, 500];
        Vibration.vibrate(pattern);
        this.animateError();
        this.setState({ pass0: '', pass1: '', pass2: '', pass3: '' });
        this.handleFocus(0);
      }
    }
  }

  handleHint() {
    const { passcode } = this.props;
    this.setState({ pass0: passcode[0], showHint: true, focused: 1 });
  }

  animateError() {
    Animated.sequence([
      Animated.timing(
        this.animateX, {
          toValue: -10,
          duration: 100,
        }
      ),
      Animated.timing(
        this.animateX, {
          toValue: 10,
          duration: 100,
        }
      ),
      Animated.timing(
        this.animateX, {
          toValue: -10,
          duration: 100,
        }
      ),
      Animated.timing(
        this.animateX, {
          toValue: 10,
          duration: 100,
        }
      ),
      Animated.timing(
        this.animateX, {
          toValue: -10,
          duration: 100,
        }
      ),
      Animated.timing(
        this.animateX, {
          toValue: 0,
          duration: 100,
        }
      )
    ]).start();
  }

  getAnimatedStyle() {
    return {
      transform: [
        { translateX: this.animateX }
      ]
    };
  }
}