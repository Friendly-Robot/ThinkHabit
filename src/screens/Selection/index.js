import React from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { colors, fonts } from '../../config/styles';

export default class Selection extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      habitSelected: '',
    }
    this.handleSkip = this.handleSkip.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  render() {
    const { habitSelected } = this.state;
    // const { 
    //   navigation,
    //   setHabitProgress,
    // } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select a Think Habit</Text>
          <TouchableOpacity
            activeOpacity={.8}
            onPress={this.handleSkip}
          >
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.border} />
        <View style={styles.categories}>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Confidence')}
              style={[styles.category, { backgroundColor: '#FF9900' }]}
            >
              {
                habitSelected === 'Confidence' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Confidence</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Meditation')}
              style={[styles.category, { backgroundColor: '#7bb32e' }]}
            >
              {
                habitSelected === 'Meditation' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Meditation</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Relationships')}
              style={[styles.category, { backgroundColor: '#000033' }]}
            >
              {
                habitSelected === 'Relationships' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Relationships</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Responsibility')}
              style={[styles.category, { backgroundColor: '#3b5998' }]}
            >
              {
                habitSelected === 'Responsibility' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Responsibility</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Courage')}
              style={[styles.category, { backgroundColor: '#DB3236' }]}
            >
              {
                habitSelected === 'Courage' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Courage</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={() => this.handleSelection('Freedom')}
              style={[styles.category, { backgroundColor: '#8700CB' }]}
            >
              {
                habitSelected === 'Freedom' ?
                <View style={styles.iconContainer}>
                  <Aicon name={'check'} size={25} color={'#FFFFFF'} />
                </View>
                :
                <Text style={styles.catText}>Freedom</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleStart}
        >
          <View style={[styles.startButton, !habitSelected && { opacity: .4 }]}>
            <Text style={styles.startText}>Start your Think Habit</Text>
            { habitSelected.length > 0 && <Aicon name={'arrow-right'} style={styles.startArrow} /> }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  handleSelection(selection) {
    const { habitSelected } = this.state;
    if (selection === habitSelected) {
      this.setState({ habitSelected: '' });
    } else {
      this.setState({ habitSelected: selection });
    }
  }

  handleSkip() {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'AppNavigator',
        }),
      ],
    });
    navigation.dispatch(resetAction);
  }


  handleStart() {
    const { habitSelected } = this.state;
    const { navigation, setHabitProgress } = this.props;
    if (habitSelected.length === 0) return;
    setHabitProgress(habitSelected);
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'AppNavigator',
        }),
      ],
    });
    navigation.dispatch(resetAction);
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  border: {
    backgroundColor: '#000000',
    height: 1,
  },
  categories: {
    flex: 1,
  },
  category: {
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
  },
  catText: {
    color: '#FFFFFF',
    fontSize: fonts.large,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  iconContainer: {
    borderColor: '#FFFFFF',
    borderRadius: 1000,
    borderWidth: 2,
    padding: '30@ms',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  skip: {
    color: colors.primary,
    fontSize: fonts.small,
  },
  startArrow: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
    position: 'absolute',
    right: '15@ms',
  },
  startButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingVertical: '15@ms',
  },
  startText: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  title: {
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '15@ms',
    paddingVertical: '15@ms',
  }
})