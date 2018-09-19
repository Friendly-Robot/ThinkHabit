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
          numberOfStemsPerDay={props.screenProps.Settings.numberOfStemsPerDay}
          repeat={props.screenProps.Settings.repeat}
          reflectNotificationTime={props.screenProps.Settings.reflectNotificationTime}
          reflectNotificationDay={props.screenProps.Settings.reflectNotificationDay}
          thinkNotificationTime={props.screenProps.Settings.thinkNotificationTime}
          thinkNotificationDay={props.screenProps.Settings.thinkNotificationDay}
          retrieveStemFromRealm={props.screenProps.retrieveStemFromRealm}
          updateHabitSettings={props.screenProps.updateHabitSettings}
        />
      )
    }
  },
  'Stem': {
    screen: function(props) {
      return (
        <Stem
          navigation={props.navigation}
        />
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
    this.retrieveStemFromRealm = this.retrieveStemFromRealm.bind(this);
    this.toggleHabitProgress = this.toggleHabitProgress.bind(this);
    this.updateHabitSettings = this.updateHabitSettings.bind(this);
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

          retrieveStemFromRealm: this.retrieveStemFromRealm,
          toggleHabitProgress: this.toggleHabitProgress,
          updateHabitSettings: this.updateHabitSettings,
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
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Confidence' });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Meditation' });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Relationships' });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Responsibility' });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Courage' });
        realm.create('Habit', { completedStemCount: 0, completedStems: [], name: 'Freedom' });
        realm.create('Settings', { 
          currDay, 
          currHabit: '', 
          daysInRow: 0, 
          habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'], 
          joinDate, 
          name: '', 
          numberOfStemsPerDay: 1, 
          picture: '',
          repeat: 3, 
          reflectNotificationTime, 
          reflectNotificationDay, 
          thinkNotificationTime, 
          thinkNotificationDay,
        });
      });
    });
    this.setState({
      appReady: true,
      appSet: false,
      Settings: { 
        currDay,
        currHabit: '',
        daysInRow: 0,
        habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'],
        joinDate,
        name: '',
        numberOfStemsPerDay: 1,
        picture: '',
        repeat: 3, 
        reflectNotificationTime, 
        reflectNotificationDay,
        thinkNotificationTime,
        thinkNotificationDay,
      },
      Confidence: { completedStemCount: 0, completedStems: [], name: 'Confidence' },
      Meditation: { completedStemCount: 0, completedStems: [], name: 'Meditation' },
      Relationships: { completedStemCount: 0, completedStems: [], name: 'Relationships' },
      Responsibility: { completedStemCount: 0, completedStems: [], name: 'Responsibility' },
      Courage: { completedStemCount: 0, completedStems: [], name: 'Courage' },
      Freedom: { completedStemCount: 0, completedStems: [], name: 'Freedom' },
    });
  }

  toggleHabitProgress(habit) {
    const updatedState = {...this.state};
    const habitSeq = updatedState.Settings.habitSeq;
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
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

  updateHabitSettings(object) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      realm.write(() => {
        Settings['currHabit'] = object['currHabit'];
        Settings['habitSeq'] = object['habitSeq'];
        Settings['numberOfStemsPerDay'] = object['numberOfStemsPerDay'];
        Settings['repeat'] = object['repeat'];
        Settings['reflectNotificationTime'] = object['reflectNotificationTime'];
        Settings['reflectNotificationDay'] = object['reflectNotificationDay'];
        Settings['thinkNotificationTime'] = object['thinkNotificationTime'];
        Settings['thinkNotificationDay'] = object['thinkNotificationDay'];
        this.setState({ Settings });
      });
    });
  }

  retrieveStemFromRealm(id) {
    return Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const aux = realm.objectForPrimaryKey('Stem', id);
      const ref = aux;
      return ref;
    });
  }
}
