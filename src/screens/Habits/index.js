import React from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts, height } from '../../config/styles';
import Header from '../../components/Header';
import Swiper from 'react-native-swiper';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { verticalScale } from 'react-native-size-matters';

export default class Habits extends React.PureComponent {
  constructor() {
    super();
    this.swiper;
    this.scrollRight = this.scrollRight.bind(this);
  }

  render() {
    const {
      // Confidence,
      // Meditation,
      // Relationships,
      // Responsibility,
      // Courage,
      // Freedom,
      currHabit,
      habitSeq,
      navigation,
    } = this.props;

    return (
      <View style={styles.mainContainer}>
        <Header navigation={navigation} />
        <Swiper
          horizontal={true}
          index={0}
          loadMinimal={true}
          loop={true}
          ref={(ref) => this.swiper = ref}
          showsPagination={false}
          style={styles.swiper}
        >
          {
            habitSeq.map((habit) => (
              <Habit
                currHabit={currHabit}
                habitData={this.props[habit]}
                key={habit}
                scrollRight={this.scrollRight} 
              />
            ))
          }
        </Swiper>
      </View>
    )
  }

  componentDidMount() {
    console.log('props', this.props)
  }

  scrollRight() {
    if (this.swiper.state.index === 5) {
      this.swiper.scrollBy(-5);
    } else {
      this.swiper.scrollBy(1);
    }
  }
}

class Habit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.vs65 = verticalScale(65);
    this.vs250 = height - this.vs65;
    this.animatedHeight = new Animated.Value(this.vs65);
    this.functions = {};
    this.state = {
      displaySettings: false,
      inProgress: props.currHabit === props.habitData.name,
      numberOfStemsPerDay: props.habitData.numberOfStemsPerDay,
      repeat: props.habitData.repeat,
      RNT: {},
      RND: {},
      TNT: {},
      TND: {},
    }
    this.toggleSettings = this.toggleSettings.bind(this);
  }

  render() {
    const {
      displaySettings,
      inProgress,
      numberOfStemsPerDay,
      repeat,
      RNT,
      RND,
      TNT,
      TND,
    } = this.state;

    const {
      // currHabit,
      habitData,
      scrollRight,
    } = this.props;

    // const {
    //   completedStemCount: 'int',
    //   completedStems: 'string[]',
    //   name: 'string',
    //   numberOfStemsPerDay: 'int',
    //   repeat: 'int',
    //   reflectNotificationTime: 'int[]',
    //   reflectNotificationDay: 'int[]',
    //   thinkNotificationTime: 'int[]',
    //   thinkNotificationDay: 'int[]',
    // } = this.props.habitData;

    return (
      <View style={styles.habitContainer}>
        <Animated.View style={this.animatedHabit()}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity
              activeOpacity={.8}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
              onPress={this.toggleSettings}
              style={styles.caretContainer}
            >
              {
                displaySettings ?
                <Aicon name={'caret-up'} style={styles.caret} />
                :
                <Aicon name={'caret-down'} style={styles.caret} />
              }
            </TouchableOpacity>
            <Text style={styles.habit}>{ habitData['name'] }</Text>
            {
              displaySettings ?
              <TouchableOpacity
                activeOpacity={.8}
                style={styles.nextContainer}
              >
                <Text style={styles.save}>Save</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                activeOpacity={.8}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                onPress={scrollRight}
                style={styles.nextContainer}
              >
                <Aicon name={'arrow-circle-right'} style={styles.nextIcon} />
              </TouchableOpacity>
            }
          </View>
          <View style={styles.progress}>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => {}} 
              style={styles.checkbox}
            >
              { inProgress && <Aicon name={'check'} style={styles.x} />}
            </TouchableOpacity>
            <Text style={styles.progressText}>
              {
                inProgress ?
                `currently in progress`
                :
                `currently disabled`
              }
            </Text>
          </View>

          {
            displaySettings &&
            <View style={styles.secondarySettings}>
              <View style={styles.incContainer}>
                <Text style={styles.incTitle}>Number of stems per day</Text>
                <View style={styles.incButtons}>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {}}
                    style={styles.incButton}
                  >
                    <Aicon name={'minus'} style={styles.incIcon} />
                  </TouchableOpacity>

                  <Text style={styles.incCount}>{ numberOfStemsPerDay }</Text>

                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {}}
                    style={styles.incButton}
                  >
                    <Aicon name={'plus'} style={styles.incIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.incContainer}>
                <Text style={styles.incTitle}>Repeat</Text>
                <View style={styles.incButtons}>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {}}
                    style={styles.incButton}
                  >
                    <Aicon name={'minus'} style={styles.incIcon} />
                  </TouchableOpacity>

                  <Text style={styles.incCount}>{ repeat }</Text>

                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {}}
                    style={styles.incButton}
                  >
                    <Aicon name={'plus'} style={styles.incIcon} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.incContainer}>
                <Text style={styles.incTitle}>Notification Time</Text>
                <View style={styles.timeContainer}>
                  <Text style={styles.ampm}>AM:</Text>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT0']}
                    style={[styles.timeButton, TNT[0] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[0] && { color: '#FFFFFF' }]}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT1']}
                    style={[styles.timeButton, TNT[1] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[1] && { color: '#FFFFFF' }]}>1</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT2']}
                    style={[styles.timeButton, TNT[2] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[2] && { color: '#FFFFFF' }]}>2</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT3']}
                    style={[styles.timeButton, TNT[3] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[3] && { color: '#FFFFFF' }]}>3</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT4']}
                    style={[styles.timeButton, TNT[4] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[4] && { color: '#FFFFFF' }]}>4</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT5']}
                    style={[styles.timeButton, TNT[5] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[5] && { color: '#FFFFFF' }]}>5</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT6']}
                    style={[styles.timeButton, TNT[6] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[6] && { color: '#FFFFFF' }]}>6</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT7']}
                    style={[styles.timeButton, TNT[7] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[7] && { color: '#FFFFFF' }]}>7</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT8']}
                    style={[styles.timeButton, TNT[8] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[8] && { color: '#FFFFFF' }]}>8</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT9']}
                    style={[styles.timeButton, TNT[9] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[9] && { color: '#FFFFFF' }]}>9</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT10']}
                    style={[styles.timeButton, TNT[10] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[10] && { color: '#FFFFFF' }]}>10</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT11']}
                    style={[styles.timeButton, TNT[11] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[11] && { color: '#FFFFFF' }]}>11</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.ampm}>PM:</Text>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT12']}
                    style={[styles.timeButton, TNT[12] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[12] && { color: '#FFFFFF' }]}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT13']}
                    style={[styles.timeButton, TNT[13] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[13] && { color: '#FFFFFF' }]}>1</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT14']}
                    style={[styles.timeButton, TNT[14] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[14] && { color: '#FFFFFF' }]}>2</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT15']}
                    style={[styles.timeButton, TNT[15] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[15] && { color: '#FFFFFF' }]}>3</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT16']}
                    style={[styles.timeButton, TNT[16] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[16] && { color: '#FFFFFF' }]}>4</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT17']}
                    style={[styles.timeButton, TNT[17] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[17] && { color: '#FFFFFF' }]}>5</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT18']}
                    style={[styles.timeButton, TNT[18] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[18] && { color: '#FFFFFF' }]}>6</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT19']}
                    style={[styles.timeButton, TNT[19] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[19] && { color: '#FFFFFF' }]}>7</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT20']}
                    style={[styles.timeButton, TNT[20] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[20] && { color: '#FFFFFF' }]}>8</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT21']}
                    style={[styles.timeButton, TNT[21] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[21] && { color: '#FFFFFF' }]}>9</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT22']}
                    style={[styles.timeButton, TNT[22] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[22] && { color: '#FFFFFF' }]}>10</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TNT23']}
                    style={[styles.timeButton, TNT[23] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TNT[23] && { color: '#FFFFFF' }]}>11</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.incTitle}>Notification Day</Text>
                <View style={styles.timeContainer}>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND1']}
                    style={[styles.timeButton, styles.dayButton, TND[1] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[1] && { color: '#FFFFFF' }]}>Mon</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND2']}
                    style={[styles.timeButton, styles.dayButton, TND[2] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[2] && { color: '#FFFFFF' }]}>Tue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND3']}
                    style={[styles.timeButton, styles.dayButton, TND[3] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[3] && { color: '#FFFFFF' }]}>Wed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND4']}
                    style={[styles.timeButton, styles.dayButton, TND[4] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[4] && { color: '#FFFFFF' }]}>Thu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND5']}
                    style={[styles.timeButton, styles.dayButton, TND[5] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[5] && { color: '#FFFFFF' }]}>Thu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND6']}
                    style={[styles.timeButton, styles.dayButton, TND[6] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[6] && { color: '#FFFFFF' }]}>Sat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['TND7']}
                    style={[styles.timeButton, styles.dayButton, , TND[7] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, TND[7] && { color: '#FFFFFF' }]}>Sun</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.incContainer}>
                <Text style={styles.incTitle}>Reflection Time</Text>
                <View style={styles.timeContainer}>
                  <Text style={styles.ampm}>AM:</Text>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT0']}
                    style={[styles.timeButton, RNT[0] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[0] && { color: '#FFFFFF' }]}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT1']}
                    style={[styles.timeButton, RNT[1] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[1] && { color: '#FFFFFF' }]}>1</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT2']}
                    style={[styles.timeButton, RNT[2] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[2] && { color: '#FFFFFF' }]}>2</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT3']}
                    style={[styles.timeButton, RNT[3] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[3] && { color: '#FFFFFF' }]}>3</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT4']}
                    style={[styles.timeButton, RNT[4] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[4] && { color: '#FFFFFF' }]}>4</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT5']}
                    style={[styles.timeButton, RNT[5] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[5] && { color: '#FFFFFF' }]}>5</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT6']}
                    style={[styles.timeButton, RNT[6] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[6] && { color: '#FFFFFF' }]}>6</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT7']}
                    style={[styles.timeButton, RNT[7] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[7] && { color: '#FFFFFF' }]}>7</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT8']}
                    style={[styles.timeButton, RNT[8] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[8] && { color: '#FFFFFF' }]}>8</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT9']}
                    style={[styles.timeButton, RNT[9] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[9] && { color: '#FFFFFF' }]}>9</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT10']}
                    style={[styles.timeButton, RNT[10] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[10] && { color: '#FFFFFF' }]}>10</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT11']}
                    style={[styles.timeButton, RNT[11] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[11] && { color: '#FFFFFF' }]}>11</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.ampm}>PM:</Text>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT12']}
                    style={[styles.timeButton, RNT[12] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[12] && { color: '#FFFFFF' }]}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT13']}
                    style={[styles.timeButton, RNT[13] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[13] && { color: '#FFFFFF' }]}>1</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT14']}
                    style={[styles.timeButton, RNT[14] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[14] && { color: '#FFFFFF' }]}>2</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT15']}
                    style={[styles.timeButton, RNT[15] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[15] && { color: '#FFFFFF' }]}>3</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT16']}
                    style={[styles.timeButton, RNT[16] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[16] && { color: '#FFFFFF' }]}>4</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT17']}
                    style={[styles.timeButton, RNT[17] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[17] && { color: '#FFFFFF' }]}>5</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT18']}
                    style={[styles.timeButton, RNT[18] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[18] && { color: '#FFFFFF' }]}>6</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT19']}
                    style={[styles.timeButton, RNT[19] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[19] && { color: '#FFFFFF' }]}>7</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT20']}
                    style={[styles.timeButton, RNT[20] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[20] && { color: '#FFFFFF' }]}>8</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT21']}
                    style={[styles.timeButton, RNT[21] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[21] && { color: '#FFFFFF' }]}>9</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT22']}
                    style={[styles.timeButton, RNT[22] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[22] && { color: '#FFFFFF' }]}>10</Text>
                  </TouchableOpacity>              
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RNT23']}
                    style={[styles.timeButton, RNT[23] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RNT[23] && { color: '#FFFFFF' }]}>11</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.incTitle}>Reflection Day</Text>
                <View style={styles.timeContainer}>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND1']}
                    style={[styles.timeButton, styles.dayButton, RND[1] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[1] && { color: '#FFFFFF' }]}>Mon</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND2']}
                    style={[styles.timeButton, styles.dayButton, RND[2] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[2] && { color: '#FFFFFF' }]}>Tue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND3']}
                    style={[styles.timeButton, styles.dayButton, RND[3] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[3] && { color: '#FFFFFF' }]}>Wed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND4']}
                    style={[styles.timeButton, styles.dayButton, RND[4] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[4] && { color: '#FFFFFF' }]}>Thu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND5']}
                    style={[styles.timeButton, styles.dayButton, RND[5] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[5] && { color: '#FFFFFF' }]}>Thu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND6']}
                    style={[styles.timeButton, styles.dayButton, RND[6] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[6] && { color: '#FFFFFF' }]}>Sat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.functions['RND7']}
                    style={[styles.timeButton, styles.dayButton, , RND[7] && { backgroundColor: colors.secondary }]}
                  >
                    <Text style={[styles.timeText, RND[7] && { color: '#FFFFFF' }]}>Sun</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </Animated.View>
        <KeyboardAwareScrollView
          style={styles.scrollview}
        >
        
        </KeyboardAwareScrollView>
      </View>
    )
  }

  componentDidMount() {
    const { 
      reflectNotificationTime,
      reflectNotificationDay,
      thinkNotificationTime,
      thinkNotificationDay,
    } = this.props.habitData;
    const RNT = {};
    const RND = {};
    const TNT = {};
    const TND = {};
    reflectNotificationTime.map((time) => {
      RNT[time] = true;
    });
    reflectNotificationDay.map((day) => {
      RND[day] = true;
    });
    thinkNotificationTime.map((time) => {
      TNT[time] = true;
    });
    thinkNotificationDay.map((day) => {
      TND[day] = true;
    });
    this.setState({ RNT, RND, TNT, TND });
    this.initFunctions();
  }

  initFunctions() {
    this.functions = {
      'TNT0': () => this.toggleTNT(0),
      'TNT1': () => this.toggleTNT(1),
      'TNT2': () => this.toggleTNT(2),
      'TNT3': () => this.toggleTNT(3),
      'TNT4': () => this.toggleTNT(4),
      'TNT5': () => this.toggleTNT(5),
      'TNT6': () => this.toggleTNT(6),
      'TNT7': () => this.toggleTNT(7),
      'TNT8': () => this.toggleTNT(8),
      'TNT9': () => this.toggleTNT(9),
      'TNT10': () => this.toggleTNT(10),
      'TNT11': () => this.toggleTNT(11),
      'TNT12': () => this.toggleTNT(12),
      'TNT13': () => this.toggleTNT(13),
      'TNT14': () => this.toggleTNT(14),
      'TNT15': () => this.toggleTNT(15),
      'TNT16': () => this.toggleTNT(16),
      'TNT17': () => this.toggleTNT(17),
      'TNT18': () => this.toggleTNT(18),
      'TNT19': () => this.toggleTNT(19),
      'TNT20': () => this.toggleTNT(20),
      'TNT21': () => this.toggleTNT(21),
      'TNT22': () => this.toggleTNT(22),
      'TNT23': () => this.toggleTNT(23),
      'TND1': () => this.toggleTND(1),
      'TND2': () => this.toggleTND(2),
      'TND3': () => this.toggleTND(3),
      'TND4': () => this.toggleTND(4),
      'TND5': () => this.toggleTND(5),
      'TND6': () => this.toggleTND(6),
      'TND7': () => this.toggleTND(7),
      'RNT0': () => this.toggleRNT(0),
      'RNT1': () => this.toggleRNT(1),
      'RNT2': () => this.toggleRNT(2),
      'RNT3': () => this.toggleRNT(3),
      'RNT4': () => this.toggleRNT(4),
      'RNT5': () => this.toggleRNT(5),
      'RNT6': () => this.toggleRNT(6),
      'RNT7': () => this.toggleRNT(7),
      'RNT8': () => this.toggleRNT(8),
      'RNT9': () => this.toggleRNT(9),
      'RNT10': () => this.toggleRNT(10),
      'RNT11': () => this.toggleRNT(11),
      'RNT12': () => this.toggleRNT(12),
      'RNT13': () => this.toggleRNT(13),
      'RNT14': () => this.toggleRNT(14),
      'RNT15': () => this.toggleRNT(15),
      'RNT16': () => this.toggleRNT(16),
      'RNT17': () => this.toggleRNT(17),
      'RNT18': () => this.toggleRNT(18),
      'RNT19': () => this.toggleRNT(19),
      'RNT20': () => this.toggleRNT(20),
      'RNT21': () => this.toggleRNT(21),
      'RNT22': () => this.toggleRNT(22),
      'RNT23': () => this.toggleRNT(23),
      'RND1': () => this.toggleRND(1),
      'RND2': () => this.toggleRND(2),
      'RND3': () => this.toggleRND(3),
      'RND4': () => this.toggleRND(4),
      'RND5': () => this.toggleRND(5),
      'RND6': () => this.toggleRND(6),
      'RND7': () => this.toggleRND(7),
    }
  }

  animatedHabit() {
    return {
      backgroundColor: colors.primary,
      height: this.animatedHeight,
    }
  }

  toggleSettings() {
    const { displaySettings } = this.state;
    if (displaySettings) {
      Animated.timing(
        this.animatedHeight, {
          toValue: this.vs65,
          duration: 750,
        }
      ).start();
    } else {
      Animated.timing(
        this.animatedHeight, {
          toValue: this.vs250,
          duration: 500,
        }
      ).start();
    }
    this.setState({ displaySettings: !displaySettings });
  }

  toggleTNT(time) {
    const { TNT } = this.state;
    if (TNT[time]) {
      const updatedTNT = {...TNT};
      delete updatedTNT[time];
      this.setState({ TNT: updatedTNT });
    } else {
      const updatedTNT = {...TNT};
      updatedTNT[time] = true;
      this.setState({ TNT: updatedTNT });
    }
  }

  toggleTND(day) {
    const { TND } = this.state;
    if (TND[day]) {
      const updatedTND = {...TND};
      delete updatedTND[day];
      this.setState({ TND: updatedTND });
    } else {
      const updatedTND = {...TND};
      updatedTND[day] = true;
      this.setState({ TND: updatedTND });
    }
  }

  toggleRNT(time) {
    const { RNT } = this.state;
    if (RNT[time]) {
      const updatedRNT = {...RNT};
      delete updatedRNT[time];
      this.setState({ RNT: updatedRNT });
    } else {
      const updatedRNT = {...RNT};
      updatedRNT[time] = true;
      this.setState({ RNT: updatedRNT });
    }
  }

  toggleRND(day) {
    const { RND } = this.state;
    if (RND[day]) {
      const updatedRND = {...RND};
      delete updatedRND[day];
      this.setState({ RND: updatedRND });
    } else {
      const updatedRND = {...RND};
      updatedRND[day] = true;
      this.setState({ RND: updatedRND });
    }
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  ampm: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  caret: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  caretContainer: {
    left: '15@ms',
    position: 'absolute',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 2,
    borderWidth: 1,
    height: '20@ms',
    justifyContent: 'center',
    left: '25@ms',
    position: 'absolute',
    width: '20@ms',
  },
  dayButton:{
    width: '30@ms',
  },
  habit: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  habitContainer: {
    flex: 1,
  },
  incButton: {
    alignItems: 'center',
    height: '20@ms',
    justifyContent: 'center',
    width: '20@ms',
  },
  incButtons: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  incContainer: {
    alignItems: 'center',
  },
  incCount: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
    marginHorizontal: '15@ms',
  },
  incIcon: {
    color: '#FFFFFF',
    fontSize: fonts.small,
  },
  incTitle: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
    fontWeight: 'bold',
    marginBottom: '5@vs',
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  nextContainer: {
    position: 'absolute',
    right: '15@ms',
  },
  nextIcon: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  progress: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: '20@vs',
    justifyContent: 'center',
  },
  progressText: {
    color: colors.lightGrey,
    fontSize: fonts.medium,
    fontStyle: 'italic',
  },
  save: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  scrollview: {
    flexGrow: 1,
  },
  secondarySettings: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: '15@vs',
  },
  settingsHeader: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '65@vs',
    paddingHorizontal: '15@ms',
  },
  swiper: {
    flex:  1,
  },
  timeButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: '20@ms',
    justifyContent: 'center',
    width: '20@ms',
  },
  timeContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '10@vs',
  },
  timeText: {
    color: colors.primary,
    fontSize: fonts.small,
  },
  x: {
    color: colors.secondary,
    fontSize: fonts.small,
  },
})