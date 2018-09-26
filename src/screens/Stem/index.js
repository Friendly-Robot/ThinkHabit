import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../config/styles';
import Header from '../../components/Header';
import Lockscreen from '../../components/Lockscreen';
import Message from '../../components/Message';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { verticalScale } from 'react-native-size-matters';
import Voice from 'react-native-voice';
import Realm from 'realm';
import Schema from '../../config/realm';

if (!__DEV__) {
  console.log = () => {};
}


export default class Stem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.attemptingUnlock;
    this.internalLock;
    this.reflectionMap = {};
    this.thoughtMap = {};
    this.updatedThoughts;
    this.updatedReflections;
    this.updatedFavorite;
    this.updatedLocked;
    this.valueStore;
    this.vs130 = verticalScale(130);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    this.state = {
      adding: false,
      dotFuncs: {},
      exists: false,
      favorite: props.navigation.state.params && typeof props.navigation.state.params.favorite === 'boolean' ? props.navigation.state.params.favorite : false,
      keyboardShowing: false,
      index: props.navigation.state.params && props.navigation.state.params.reflection ? 1 : 0,
      lockscreen: false,
      locked: props.navigation.state.params && typeof props.navigation.state.params.locked === 'boolean' ? props.navigation.state.params.locked : false,
      message: null,
      recording: false,
      reflectCount: 0,
      reflections: props.navigation.state.params && props.navigation.state.params.reflections ? props.navigation.state.params.reflections : [],
      thoughtCount: 0,
      thoughts: props.navigation.state.params && props.navigation.state.params.thoughts ? props.navigation.state.params.thoughts : [],
      unlocked: props.passed ? true : false,
      value: '',
    }
    if (this.state.thoughts.length) {
      this.state.thoughts.map((thought) => {
        if (!this.thoughtMap[thought]) {
          this.thoughtMap[thought] = 1;
        } else {
          this.thoughtMap[thought] += 1;
        }
      });
    }
    if (this.state.reflections.length) {
      this.state.reflections.map((reflection) => {
        if (!this.reflectionMap[reflection]) {
          this.reflectionMap[reflection] = 1;
        } else {
          this.reflectionMap[reflection] += 1;
        }
      });
    }
    this.closeLockscreen = this.closeLockscreen.bind(this);
    this.displayLockscreen = this.displayLockscreen.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleLocked = this.handleLocked.bind(this);
    this.handleSwiperUpdate = this.handleSwiperUpdate.bind(this);
    this.handleUnlock = this.handleUnlock.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.handleVoiceRecord = this.handleVoiceRecord.bind(this);
    this.toggleMessage = this.toggleMessage.bind(this);
    this.updateStem = this.updateStem.bind(this);
  }

  render() {
    const {
      navigation,
      passcode,
      passed,
      passOnce,
      premium,
      // updatePassed,
      // updateStemInRealm,
    } = this.props;

    const {
      adding,
      dotFuncs,
      favorite,
      index,
      keyboardShowing,
      locked,
      lockscreen,
      message,
      recording,
      reflectCount,
      reflections,
      thoughtCount,
      thoughts,
      unlocked,
      value,
    } = this.state;
    
    const { 
      id,
      // locked,
      thinkDate,
      reflectDate,
      stem,
      // updateBookmarksPage,
      updateRealmStem, // Spread this prop to check whether Stem was open from notification or Habits screen to force update on back press if notification.
    } = this.props.navigation.state.params;

    const lockedStatus = locked && (!unlocked || (!passed && passOnce));
    console.log('Stem "locked" value:', this.props.navigation.state.params.locked);
    console.log('locked status:', lockedStatus);
    console.log(`
      locked status parameters: 
      locked: ${locked}, 
      !unlocked: ${!unlocked},
      !passed: ${!passed}
      !passOnce: ${!passOnce}
    `);
    return (
      <View style={styles.container}>
        <Header
          backArrow={true} 
          navigation={navigation} 
          title={'Think Habit'} 
          subTitle={updateRealmStem ? null : 'Stem'} 
          stemId={id} 
        />
        <View style={styles.stemContainer}>
          <Text style={styles.stem}>{ stem }</Text>
        </View>
        <View style={styles.dots}>
          { keyboardShowing && <Text style={styles.yourThought}>Your thought</Text> }
          { !keyboardShowing &&
            <TouchableOpacity
              activeOpacity={.8}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={this.handleLocked}
              style={styles.lockContainer}
            >
              <Aicon name={'lock'} style={[styles.bookmark, locked && { color: colors.primary }]} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={dotFuncs[0]}
            style={[styles.dot, index === 0 && styles.activeDot]}
          />
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={dotFuncs[1]}
            style={[styles.dot, index === 1 && styles.activeDot]}
          />
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.handleFavorite}
            style={styles.bookmarkContainer}
          >
            <Aicon name={'bookmark'} style={[styles.bookmark, favorite && { color: colors.primary }]} />
          </TouchableOpacity>
            { (keyboardShowing || lockedStatus) &&  <Text style={styles.count}>{ index === 0 ? thoughtCount : reflectCount }</Text> }
        </View>
        {
          !keyboardShowing ?
          lockedStatus ?
            <Swiper
              horizontal={true}
              index={index}
              loadMinimal={true}
              loop={false}
              onMomentumScrollEnd={this.handleSwiperUpdate}
              ref={(ref) => this.swiper = ref}
              showsPagination={false}
            >
              <TouchableOpacity
                activeOpacity={.8}
                onPress={this.displayLockscreen}
                style={styles.bigLockContainer}
              >
                <Aicon name={'lock'} style={styles.bigLock} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.8}
                onPress={this.displayLockscreen}
                style={styles.bigLockContainer}
              >
                <Aicon name={'lock'} style={styles.bigLock} />
              </TouchableOpacity>
            </Swiper>
            :
            <Swiper
              horizontal={true}
              index={index}
              loadMinimal={true}
              loop={false}
              onMomentumScrollEnd={this.handleSwiperUpdate}
              ref={(ref) => this.swiper = ref}
              showsPagination={false}
            >
              <ScrollView 
                contentContainerStyle={styles.scrollview}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.thoughts}>
                  <Text style={styles.thoughtTitle}>Thoughts</Text>
                  <Text style={styles.thoughtCount}>{ thoughts.length }</Text>
                  {
                    thoughts.map((thought, idx) => {
                      const key = this.thoughtMap[thought] > 1 ? idx : thought; 
                      return (<Text key={key} style={styles.thought}>•  { thought }</Text>);
                    })
                  }
                  {
                    thinkDate > 1 && <Text style={styles.date}>{ this.getPrettyDate(thinkDate) }</Text>
                  }
                </View>
              </ScrollView>
              <ScrollView 
                contentContainerStyle={styles.scrollview}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.thoughts}>
                  <Text style={styles.thoughtTitle}>Reflections</Text>
                  <Text style={styles.thoughtCount}>{ reflections.length }</Text>
                  {
                    reflections.map((reflection, idx) => {
                      const key = this.reflectionMap[reflection] > 1 ? idx : reflection; 
                      return (<Text key={key} style={styles.thought}>•  { reflection }</Text>);
                    })
                  }
                  {
                    reflectDate > 1 && <Text style={styles.date}>{ this.getPrettyDate(reflectDate) }</Text>
                  }
                </View>
              </ScrollView>
            </Swiper>
          :
          null
        }
        <View style={[styles.bottomView, keyboardShowing ? { flex: 1 } : { height: this.vs130 }]}>
          {
            keyboardShowing &&
            <AutoGrowingTextInput
              keyboardType={'default'}
              onChangeText={this.handleInput}
              minHeight={45}
              ref={ref => this.input = ref}
              returnKeyType='done'
              scrollEnabled={true}
              selectionColor={'#FF9900'}
              style={[styles.input, Platform.OS === 'ios' && keyboardShowing && styles.iosInput]}
              underlineColorAndroid={[keyboardShowing ? colors.primary : '#FFFFFF']}
              value={value}
            />
          }

          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={this.handleVoiceRecord}
            style={[styles.button, styles.voiceButton, premium && { backgroundColor: colors.primary }]}
          >
            {
              recording ?
              <Micon name={'voice'} style={styles.voice} />
              :
              <Aicon name={'microphone'} style={styles.buttonIcon} />
            }
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.8}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={this.handleAdd}
            style={[styles.button, styles.addButton]}
          >
            {
              adding ?
              <ActivityIndicator
                size="small" 
                color="#FFFFFF"
              />
              :
              <Aicon name={'plus'} style={styles.buttonIcon} />
            }
          </TouchableOpacity>
        </View>
        { Platform.OS === 'ios' && keyboardShowing && <View style={{ height: this.keyboardHeight }} /> }
        { 
          lockscreen && 
          <Lockscreen 
            closeLockscreen={this.closeLockscreen}
            handleUnlock={this.handleUnlock}
            message={'Enter passcode'}
            passcode={passcode}  
          />
        }
        {
          message &&
          <Message
            bodyStyle={message.bodyStyle}
            closeFunc={this.toggleMessage}
            duration={message.duration}
            message={message.message}
            textStyle={message.textStyle}
            timeout={message.timeout}
          />
        }
      </View>
    )
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    const dotFuncs = {
      0: () => this.handleDot(0),
      1: () => this.handleDot(1),
    }
    this.setState({ dotFuncs });
    this.checkExistsAndSetFavoriteAndLocked();
    this.mounted = true;
  }

  componentWillUnmount() {
    if (this.updatedFavorite || this.updatedThoughts || this.updatedReflections || this.updatedLocked) {
      this.updateStem();
    }
    this.mounted = false;
    if (Platform.OS === 'ios') {
      this.keyboardWillShowListener.remove();
    } else {
      this.keyboardDidShowListener.remove();
    }
    this.keyboardDidHideListener.remove();
    if (this.props.premium) {
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch (e) {
        console.error(e);
      }
    }
  }

  _keyboardWillShow(e) {
    if (!this.keyboardHeight) {
      this.keyboardHeight = e.endCoordinates.height;
    }
    this.setState({ keyboardShowing: true })
  }

  _keyboardDidShow() {
    this.setState({ keyboardShowing: true }, () => {
      this.input.focus();
    });
  }

  _keyboardDidHide() {
    this.setState({ keyboardShowing: false })
  }

  handleAdd() {
    if (this.preventAdd) return;
    setTimeout(() => {
      if (this.state.adding) this.setState({ adding: false });
    }, 750);
    this.preventAdd = true;
    setTimeout(() => this.preventAdd = false, 500);
    const { index, reflectCount, thoughtCount, value } = this.state;
    if (value) {
      this.setState({ adding: true });
      if (index === 0) {
        if (this.thoughtMap[value]) {
          this.thoughtMap[value] += 1;
        } else {
          this.thoughtMap[value] = 1;
        }
        const { thoughts } = this.state;
        const res = [value, ...thoughts];
        this.setState({ thoughts: res, value: '', thoughtCount: thoughtCount + 1 });
        this.updatedThoughts = true;
      } else {
        if (this.reflectionMap[value]) {
          this.reflectionMap[value] += 1;
        } else {
          this.reflectionMap[value] = 1;
        }
        const { reflections } = this.state;
        const res = [value, ...reflections];
        if (this.state.recording) {
          this._stopRecognizing();
        }
        this.setState({ 
          recording: false,
          reflectCount: reflectCount + 1, 
          reflections: res, 
          value: '', 
          keyboardShowing: false 
        });
        this.updatedReflections = true;
      }
      if (this.valueStore) this.valueStore = '';
    } else {
      if (this.state.keyboardShowing) {
        this.setState({ keyboardShowing: false });
      } else {
        this.setState({ keyboardShowing: true }, () => {
          this.input.focus();
        });
      }
    }
    if (this.state.recording) {
      this._stopRecognizing();
    }
  }

  handleInput(text) {
    this.setState({ value: text });
  }

  handleDot(index) {
    if (index === 0 && this.swiper.state.index === 1) {
      this.swiper.scrollBy(-1);
      return;
    } else if (index === 0 && this.swiper.state.index === 0) {
      return;
    }
    if (index === 1 && this.swiper.state.index === 0) {
      this.swiper.scrollBy(1);
      return;
    } else if (index === 1 && this.swiper.state.index === 1) {
      return;
    }
  }

  checkExistsAndSetFavoriteAndLocked() {
    const { id } = this.props.navigation.state.params;
    Realm.open({ schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Stem = realm.objectForPrimaryKey('Stem', id);
      if (Stem) {
        this.setState({ favorite: Stem['favorite'], locked: Stem['locked'], exists: true });
      } else {
        this.setState({ exists: false });
      }
    });
  }

  closeLockscreen() {
    this.setState({ lockscreen: false });
  }

  handleUnlock() {
    this.setState({ unlocked: true, lockscreen: false });
    if (this.props.passOnce) {
      this.props.updatePassed();
    }
    if (this.attemptingUnlock) {
      this.setState({ locked: !this.state.locked });
      this.updatedLocked = true;
      this.attemptingUnlock = false;
    }
  }

  displayLockscreen() {
    this.setState({ lockscreen: true });
  }

  handleLocked() {
    const { locked } = this.state;
    if (locked && !this.internalLock) {
      if (this.state.unlocked === false || this.props.passed === false) {
        this.attemptingUnlock = true;
        this.displayLockscreen();
        return;
      } else if (this.state.unlocked || this.props.passed) {
        this.setState({ locked: !locked });
        this.updatedLocked = true;
        return;
      }
    }
    this.internalLock = true;
    this.setState({ locked: !locked });
    this.updatedLocked = true;
  }

  handleFavorite() {
    const { favorite } = this.state;
    this.setState({ favorite: !favorite });
    this.updatedFavorite = true;
    this.props.navigation.state.params && this.props.navigation.state.params.updateBookmarksPage && this.props.navigation.state.params.updateBookmarksPage();
  }

  handleSwiperUpdate() {
    this.setState({ index: this.swiper.state.index });
  }

  getPrettyDate(int) {
    const date = new Date(int);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  onSpeechPartialResults(e) {
    if (Platform.OS === 'ios') {
      this.setState({ value: e.value[0] });
      return;
    }

    let value = '';
    if (this.valueStore) {
      value = `${this.valueStore} ${e.value}`;
    } else {
      value = e.value[0];
    }
    this.setState({ value });
  }

  onSpeechResults(e) {
    if (Platform.OS === 'ios') {
      this.setState({ value: e.value[0] });
      setTimeout(() => {
        if (!this.state.recording && this.state.value) {
          this.setState({ value: `${e.value[0]}.` });
        }
      }, 2000);
      return;
    }
    let value = '';
    if (this.valueStore) {
      if (e.value[0].length) {
        value = `${this.valueStore} ${e.value[0][0].toUpperCase()}${e.value[0].substr(1)}.`;
      } else {
        value = this.valueStore;
      }
    } else {
      value = `${e.value[0][0].toUpperCase()}${e.value[0].substr(1)}.`
    }
    this.setState({ value, recording: false });
    this.valueStore = value;
  }

  async _startRecognizing(e) {
    if (!this.props.premium) {
      const message = {
        bodyStyle: null,
        duration: 500,
        message: 'Upgrade to premium for access to voice dictation.',
        textStyle: null,
        timeout: 4500,
      };
      this.setState({ message });
      return;
    }
    try {
      await Voice.start('en-US');
      if (this.state.value) {
        this.valueStore = this.state.value;
      }
      this.setState({ recording: true, keyboardShowing: true });
      setTimeout(() => {
        if (!this.state.value) {
          this.setState({ recording: false, keyboardShowing: false });
        }
      }, 5000);
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
      this.setState({ recording: false });        
    } catch (e) {
      console.error(e);
    }
  }

  handleVoiceRecord() {
    if (this.state.recording) {
      this._stopRecognizing();
    } else {
      this._startRecognizing();
    }
  }

  toggleMessage(message) {
    this.setState({ message });
  }

  updateStem() {
    if (this.state.keyboardShowing) {
      this.setState({ keyboardShowing: false });
      Keyboard.dismiss();
    }
    const { favorite, index, locked, value } = this.state;
    const { thoughts, reflections } = this.state;
    let updatedThoughts = [];
    let updatedReflections = [];
    if ((!this.updatedThoughts && !this.updatedReflections) && !value && !this.updatedFavorite && !this.updatedLocked) {
      console.log('NOT SAVING THIS STEM')
      return;
    } else if ((!this.updatedThoughts || !this.updatedReflections) && value) {
      if (index === 0) {
        updatedThoughts = [value, ...thoughts]
        this.setState({ thoughts: updatedThoughts });
        this.updatedThoughts = true;
      } else if (index === 1) {
        updatedReflections = [value, ...reflections]
        this.setState({ reflections: updatedReflections });
        this.updatedReflections = true;
      }
    } else if (value) {
      if (index === 0) {
        updatedThoughts = [value, ...thoughts]
        this.setState({ thoughts: updatedThoughts });
        this.updatedThoughts = true;
      } else if (index === 1) {
        updatedReflections = [value, ...reflections]
        this.setState({ reflections: updatedReflections });
        this.updatedReflections = true;
      }
    } else {
      updatedThoughts = [...thoughts];
      updatedReflections = [...reflections];
    }
    const { updateStemInRealm } = this.props;
    const { params } = this.props.navigation.state;
    const date = new Date().getTime();
    if (this.state.exists) {
      const updatedStem = {};
      if (this.updatedThoughts && this.updatedReflections) {
        updatedStem['thinkDate'] = date;
        updatedStem['reflectDate'] = date;
      } else if (this.updatedThoughts) {
        updatedStem['thinkDate'] = date;
      } else if (this.updatedReflections) {
        updatedStem['reflectDate'] = date;
      }
      updatedStem['favorite'] = favorite;
      updatedStem['locked'] = locked;
      if (this.updatedThoughts) updatedStem['thoughts'] = updatedThoughts;
      if (this.updatedReflections) updatedStem['reflections'] = updatedReflections;
      console.log('Updating existing Stem:', updatedStem)
      updateStemInRealm(params['id'], updatedStem, 'update');
    } else {
      const newStem = {
        id: params['id'],
        favorite,
        habit: params['habit'],
        locked,
        stem: params['stem'],
        thinkDate: this.updatedThoughts ? date : 0,
        thoughts: updatedThoughts,
        reflectDate: this.updatedReflections ? date : 0,
        reflections: updatedReflections,
      };
      console.log('Creating new Stem:', newStem)
      updateStemInRealm(params['id'], newStem, 'new');
    }
    this.props.navigation.state.params && this.props.navigation.state.params.updateRealmStem && this.props.navigation.state.params.updateRealmStem();
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  activeDot: {
    backgroundColor: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    bottom: '15@vs',
    position: 'absolute',
    right: '15@ms',
  },
  bigLock: {
    color: colors.primary,
    fontSize: '50@ms',
  },
  bigLockContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bookmark: {
    color: colors.grey,
    fontSize: fonts.medium,
  },
  bookmarkContainer: {
    position: 'absolute',
    right: '20@ms',
  },
  bottomView: {
    backgroundColor: 'transparent',
    paddingBottom: '20@ms',
    zIndex: 10,
  },
  button: {
    alignItems: 'center',
    borderRadius: 100,
    elevation: 4,
    height: '45@ms',
    justifyContent: 'center',
    position: 'absolute',
    width: '45@ms',
  },
  buttons: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  count: {
    color: colors.secondary,
    fontSize: fonts.small,
    position: 'absolute',
    right: '45@ms',
  },
  date: {
    color: colors.darkGrey,
    textAlign: 'center',
    fontSize: fonts.small,
    fontStyle: 'italic',
    marginTop: '15@vs',
  },
  dot: {
    borderColor: colors.primary,
    borderRadius: 100,
    borderWidth: 1,
    height: '10@ms',
    marginHorizontal: '10@ms',
    width: '10@ms',
  },
  dots: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: '10@vs',
  },
  inactiveButton: {
    backgroundColor: colors.lightGrey,
    bottom: '15@vs',
    elevation: 0,
    right: '15@ms',
  },
  input: {
    alignSelf: 'center',
    fontSize: fonts.medium,
    paddingHorizontal: '15@ms',
    width: '90%',
  },
  iosInput: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
  },
  keyboardPadding: {
    height: '250@vs',
  },
  lockContainer: {
    position: 'absolute',
    left: '20@ms',
  },
  scrollview: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    paddingVertical: '20@vs',
  },
  stem: {
    color: '#FFFFFF',
    fontSize: fonts.large,
  },
  stemContainer: {
    backgroundColor: colors.primary,
    elevation: 2,
    paddingHorizontal: '15@ms',
    paddingVertical: '20@vs',
  },
  thought: {
    color: colors.darkGrey,
    fontSize: fonts.small,
    marginBottom: '5@vs',
  },
  thoughtCount: {
    color: colors.secondary,
    fontSize: fonts.medium,
    position: 'absolute',
    top: '15@ms',
    right: '15@ms',
  },
  thoughts: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.darkGrey,
    borderRadius: 5,
    borderWidth: 1,
    elevation: 2,
    marginBottom: '15@vs',
    padding: '15@ms',
    width: '90%',
  },
  thoughtTitle: {
    color: colors.primary,
    fontSize: fonts.medium,
    textAlign: 'center',
    marginBottom: '10@vs',
  },
  voice: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  voiceButton: {
    backgroundColor: colors.grey,
    bottom: '15@vs',
    left: '15@ms',
    position: 'absolute',
  },
  yourThought: {
    color: colors.primary,
    fontSize: fonts.small,
    left: '25@ms',
    position: 'absolute',
  },
});