import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Realm from 'realm';
import Schema from './config/realm';
import SplashScreen from './screens/SplashScreen';
import Selection from './screens/Selection';
import Habits from './screens/Habits';
import Stem from './screens/Stem';
import Settings from './screens/Settings';
import About from './screens/About';

if (!__DEV__) {
  console.log = () => {};
}

const HabitsNavigator = createStackNavigator({
  'Habits': {
    screen: function(props) {
      return (
        <Habits
          appSet={props.screenProps.appSet}
          Confidence={props.screenProps.Confidence}
          Meditation={props.screenProps.Meditation}
          Relationships={props.screenProps.Relationships}
          Responsibility={props.screenProps.Responsibility}
          Courage={props.screenProps.Courage}
          Freedom={props.screenProps.Freedom}
          currHabit={props.screenProps.Settings.currHabit}
          habitSeq={props.screenProps.Settings.habitSeq}
          navigation={props.navigation}
        />
      )
    }
  },
  'Stem': {
    screen: function(props) {
      return (
        <Stem/>
      )
    }
  },
}, {
  headerMode: 'none',
  navigationOptions: {
    header: false,
  },
});

const AppNavigator = createDrawerNavigator({
  'Habits': {
    screen: HabitsNavigator
  },
  'Settings': {
    screen: function(props) {
      return (
        <Settings/>
      )
    }
  },
  'About': {
    screen: function(props) {
      return (
        <About/>
      )
    }
  }
}, {
  headerMode: 'none',
  navigationOptions: {
    header: false,
  },
  initialRouteName: 'Habits',
  // contentComponent: function(props) {
  //   return (
  //     <Navigator  
  //       activeItemKey={props.activeItemKey}
  //       favorites={props.screenProps.favorites}
  //       getLabel={props.getLabel}
  //       image={props.screenProps.image}
  //       items={props.items}
  //       lockQ={props.screenProps.lockQ}
  //       name={props.screenProps.name}
  //       navigation={props.navigation}
  //       onItemPress={props.onItemPress}
  //       playTap={props.screenProps.playTap}
  //       queueLen={props.screenProps.queueLen}
  //       renderIcon={props.renderIcon}
  //     />
  //   )
  });
  
  const BaseNavigator = createStackNavigator({
    'SplashScreen': {
      screen: function(props) {
        return (
          <SplashScreen 
            appReady={props.screenProps.appReady} 
            appSet={props.screenProps.appSet} 
            navigation={props.navigation}
          />
        )
      }
    },
    'Selection': {
      screen: function(props) {
        return (
          <Selection 
            navigation={props.navigation} 
            toggleHabitProgress={props.screenProps.toggleHabitProgress}
          />
        )
      }
    },
    AppNavigator: {
      screen: AppNavigator
    }
  }, {
    headerMode: 'none',
    navigationOptions: {
      header: false,
    },
  });

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      appReady: false,
      appSet: false,
      Settings: {},
      Confidence: {},
      Meditation: {},
      Relationships: {},
      Responsibility: {},
      Courage: {},
      Freedom: {},
    }
    this.toggleHabitProgress = this.toggleHabitProgress.bind(this);
  }

  render() {
    const {
      appReady,
      appSet,
      Settings,
      Confidence,
      Meditation,
      Relationships,
      Responsibility,
      Courage,
      Freedom,
    } = this.state;

    return (
      <BaseNavigator 
        screenProps={{
          appReady,
          appSet,

          Settings,
          Confidence,
          Meditation,
          Relationships,
          Responsibility,
          Courage,
          Freedom,

          toggleHabitProgress: this.toggleHabitProgress,
        }}
      />
    );
  }

  componentDidMount() {
    this.initializeApp();
  }

  initializeApp() {
    // Realm.clearTestState();
    Realm.open({schema: Schema, schemaVersion: 0})
    .then((realm) => {
      const Settings = realm.objects('Settings')[0];
      if (Settings) {
        this.restoreEnvironment();
      } else {
        this.buildEnvironment();
      }
    })
    .catch((e) => {
      throw new Error(`Catch Error from initializeApp()`, e);
    });
  }

  restoreEnvironment() {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      const day = new Date().getDay();
      const currDay = Settings.currDay;
      if (day !== currDay) {
        realm.write(() => {
          if (day === currDay + 1) {
            Settings.daysInRow += 1;
          } else if (Settings.daysInRow !== 1) {
            Settings.daysInRow = 1;            
          }
          Settings.currDay = day;
        });
      }
      const Habits = realm.objects('Habit');
      let Confidence = {};
      let Meditation = {};
      let Relationships = {};
      let Responsibility = {};
      let Courage = {};
      let Freedom = {};
      Habits.map((habit) => {
        switch (habit.name) {
          case 'Confidence':
            Confidence = habit;
            break;
          case 'Meditation':
            Meditation = habit;
            break;
          case 'Relationships':
            Relationships = habit;
            break;
          case 'Responsibility':
            Responsibility = habit;
            break;
          case 'Courage':
            Courage = habit;
            break;
          case 'Freedom':
            Freedom = habit;
            break;
        }
      });
      this.setState({ 
        appReady: true,
        appSet: true,
        Settings,
        Confidence,
        Meditation,
        Relationships,
        Responsibility,
        Courage,
        Freedom,
      });
    });
  }

  buildEnvironment() {
    const date = new Date();
    const currDay = date.getDay();
    const joinDate = date.getTime();
    const reflectNotificationDay = [1,2,3,4,5,6,7];
    const reflectNotificationTime = [21];
    const thinkNotificationDay = [1,2,3,4,5,6,7];
    const thinkNotificationTime = [9];
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      realm.write(() => {
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Confidence', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Meditation', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Relationships', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Responsibility', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Courage', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Freedom', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay });
        realm.create('Settings', { currDay, currHabit: '', daysInRow: 0, habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'], joinDate, name: '', picture: '' });
      });
    });
    this.setState({
      appReady: true,
      appSet: false,
      Settings: { currDay, currHabit: '', daysInRow: 0, habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'], joinDate, name: '', picture: '' },
      Confidence: { completedStemCount: 0, completedStems: [], name: 'Confidence', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
      Meditation: { completedStemCount: 0, completedStems: [], name: 'Meditation', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
      Relationships: { completedStemCount: 0, completedStems: [], name: 'Relationships', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
      Responsibility: { completedStemCount: 0, completedStems: [], name: 'Responsibility', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
      Courage: { completedStemCount: 0, completedStems: [], name: 'Courage', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
      Freedom: { completedStemCount: 0, completedStems: [], name: 'Freedom', numberOfStemsPerDay: 1, repeat: 3, reflectNotificationTime, reflectNotificationDay, thinkNotificationTime, thinkNotificationDay },
    });
  }

  toggleHabitProgress(habit) {
    const updatedState = {...this.state};
    const habitSeq = updatedState.Settings.habitSeq;
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings');
      realm.write(() => {
        habitSeq.splice(habitSeq.indexOf(habit), 1);
        habitSeq.unshift(habit);
        updatedState['Settings']['habitSeq'] = habitSeq;
        updatedState['Settings']['currHabit'] = habit;
        this.setState({...updatedState})
        Settings['currHabit'] = habit;
        Settings['habitSeq'] = habitSeq;
      });
    });
  }
}
