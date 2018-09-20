import React from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, height } from '../../config/styles';
import Header from '../../components/Header';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { verticalScale } from 'react-native-size-matters';

export default class Stem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updatedThoughts;
    this.updatedReflections;
    this.keyboardOffset = height - verticalScale(130);
    this.state = {
      dotFuncs: {},
      keyboardShowing: false,
      index: props.navigation.state.params && props.navigation.state.params.reflection ? 1 : 0,
      reflections: props.navigation.state.params && props.navigation.state.params.reflections ? props.navigation.state.params.reflections : [],
      thoughts: props.navigation.state.params && props.navigation.state.params.thoughts ? props.navigation.state.params.thoughts : [],
      value: '',
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSwiperUpdate = this.handleSwiperUpdate.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.updateStem = this.updateStem.bind(this);
  }

  render() {
    const {
      navigation,
      // updateStemInRealm,
    } = this.props;

    const {
      dotFuncs,
      keyboardShowing,
      index,
      reflections,
      thoughts,
      value,
    } = this.state;

    const { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <Header backArrow={true} navigation={navigation} />
        <View style={styles.stemContainer}>
          <Text style={styles.stem}>{ params['stem'] }</Text>
        </View>
        <View style={styles.dots}>
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
        </View>
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
                thoughts.map((thought) => (
                  <Text key={thought} style={styles.thought}>•  { thought }</Text>

                ))
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
              reflections.map((reflection) => (
                <Text key={reflection} style={styles.thought}>•  { reflection }</Text>

              ))
            }
          </View>
        </ScrollView>
        </Swiper>
        <View style={styles.bottomView}>
          <AutoGrowingTextInput
            keyboardType={'default'}
            onChangeText={this.handleInput}
            maxHeight={200}
            minHeight={45}
            ref={ref => this.input = ref}            
            returnKeyType='done'
            scrollEnabled={true}
            selectionColor={'#FF9900'}
            style={[styles.input, Platform.OS === 'ios' && styles.iosInput]}
            underlineColorAndroid={colors.primary}
            value={value}
          />
          <TouchableOpacity
            activeOpacity={.8}
            onPress={this.handleAdd}
            style={[styles.button, styles.addButton]}
          >
            <Aicon name={'plus'} style={styles.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.8}
            onPress={this.updateStem}
            style={[styles.button, styles.checkButton]}
          >
            <Aicon name={'check'} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
        { Platform.OS === 'ios' && keyboardShowing && <View style={{ height: this.keyboardHeight }} /> }
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
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.keyboardWillShowListener.remove();
    } else {
      this.keyboardDidShowListener.remove();
    }
    this.keyboardDidHideListener.remove();
  }

  _keyboardWillShow(e) {
    if (!this.keyboardHeight) {
      this.keyboardHeight = e.endCoordinates.height;
    }
    this.setState({ keyboardShowing: true })
  }

  _keyboardDidShow() {
    this.setState({ keyboardShowing: true })
  }

  _keyboardDidHide() {
    this.setState({ keyboardShowing: false })
  }

  handleAdd() {
    const { index, value } = this.state;
    if (value) {
      if (index === 0) {
        const { thoughts } = this.state;
        this.setState({ thoughts: [value, ...thoughts], value: '' });
        this.updatedThoughts = true;
      } else {
        const { reflections } = this.state;
        this.setState({ reflections: [value, ...reflections], value: '' });
        this.updatedReflections = true;
      }
    } else {
      if (this.state.keyboardShowing) {
        this.input.blur();
      } else {
        this.input.focus();
      }
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

  handleSwiperUpdate() {
    this.setState({ index: this.swiper.state.index });
  }

  updateStem() {
    if (this.state.keyboardShowing) {
      this.setState({ keyboardShowing: false });
      Keyboard.dismiss();
    }
    const { index, value } = this.state;
    const { thoughts, reflections } = this.state;
    let updatedThoughts = [];
    let updatedReflections = [];
    if ((!this.updatedThoughts || !this.updatedReflections) && !value) {
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
    if (params['date']) {
      const updatedStem = {};
      updatedStem['date'] = date;
      if (this.updatedThoughts) updatedStem['thoughts'] = updatedThoughts;
      if (this.updatedReflections) updatedStem['reflections'] = updatedReflections;
      updateStemInRealm(params['id'], updatedStem, 'update');
    } else {
      const newStem = {
        id: params['id'],
        date,
        habit: params['habit'],
        stem: params['stem'],
        thoughts: updatedThoughts,
        reflections: updatedReflections,
      };
      updateStemInRealm(params['id'], newStem, 'new');
    }
    this.setState({ value: '' });
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
    left: '15@ms',
  },
  bottomView: {
    backgroundColor: '#FFFFFF',
    height: '130@vs',
    justifyContent: 'space-between',
    paddingBottom: '60@ms',
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
  checkButton: {
    backgroundColor: colors.secondary,
    bottom: '15@vs',
    right: '15@ms',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
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
});