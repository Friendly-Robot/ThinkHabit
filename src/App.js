import React from 'react';
import { PushNotificationIOS } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Realm from 'realm';
import Schema from './config/realm';
import SplashScreen from './screens/SplashScreen';
import Selection from './screens/Selection';
import Habits from './screens/Habits';
import Stem from './screens/Stem';
import Settings from './screens/Settings';
import About from './screens/About';
import PushNotification from 'react-native-push-notification'
import Data from './config/data';
import { NavigationActions } from 'react-navigation';

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
          passNavigationContext={props.screenProps.passNavigationContext}
          repeat={props.screenProps.Settings.repeat}
          reflectNotificationTime={props.screenProps.Settings.reflectNotificationTime}
          reflectNotificationDay={props.screenProps.Settings.reflectNotificationDay}
          thinkNotificationTime={props.screenProps.Settings.thinkNotificationTime}
          thinkNotificationDay={props.screenProps.Settings.thinkNotificationDay}
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
          updateStemInRealm={props.screenProps.updateStemInRealm}
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
            passNavigationContext={props.screenProps.passNavigationContext}
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
      navigation: null,
      Settings: {},
      Confidence: {},
      Meditation: {},
      Relationships: {},
      Responsibility: {},
      Courage: {},
      Freedom: {},
    }
    this.passNavigationContext = this.passNavigationContext.bind(this);
    this.toggleHabitProgress = this.toggleHabitProgress.bind(this);
    this.updateHabitSettings = this.updateHabitSettings.bind(this);
    this.updateStemInRealm = this.updateStemInRealm.bind(this);
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log( 'ON NOTIFICATION:', notification );

        setTimeout(() => this.handleOpenedNotification(notification.tag), 500);

        // ** How do we handle not sending the same unopened stem??
        this.setNextPushNotification();
        
        // process the notification
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    
      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: "YOUR GCM (OR FCM) SENDER ID",
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
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

          passNavigationContext: this.passNavigationContext,
          toggleHabitProgress: this.toggleHabitProgress,
          updateHabitSettings: this.updateHabitSettings,
          updateStemInRealm: this.updateStemInRealm,
        }}
      />
    );
  }

  componentDidMount() {
    this.initializeApp();
    setTimeout(() => this.setNextPushNotification(), 1000);
  }

  componentWillUnmount() { 
    this.attemptNavigation = 0;
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
          queue: [],
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
        queue: [],
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

  // registerNotificationActions() {
  //   if (Platform.OS === 'android') {
  //     PushNotification.registerNotificationActions(['Later', 'Think', 'Reflect']);
  //     DeviceEventEmitter.addListener('notificationActionReceived', (action) => {
  //       console.log ('Notification action received: ' + action);
  //       const info = JSON.parse(action.dataJSON);
  //       if (info.action == 'Later') {

  //       } else if (info.action === 'Think') {
  //         this.handleNotificationRoute(info.tag);
  //       } else if (info.action === 'Reflect') {
  
  //       }
  //       // Add all the required actions handlers
  //     });
  //   }
  // }

  // handleNotificationRoute(params) {
  //   console.log('navigation', this.state.navigation)
  //   const navigateAction = NavigationActions.navigate({
  //     routeName: 'Stem',
  //     params,
  //   });
  //   this.state.navigation.dispatch(navigateAction);
  // }

  handleOpenedNotification(notification) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Stem = realm.objectForPrimaryKey('Stem', notification['id']);
      if (Stem['date']) {
        notification['date'] = Stem['date'];
        notification['thoughts'] = Stem['thoughts'];
        notification['reflections'] = Stem['reflections'];
        const navigateAction = NavigationActions.navigate({
          routeName: 'Stem',
          params: notification,
        });
        this.state.navigation.dispatch(navigateAction);
      } else {
        const navigateAction = NavigationActions.navigate({
          routeName: 'Stem',
          params: notification,
        });
        this.state.navigation.dispatch(navigateAction);
      }
    });
  }

  setNextPushNotification(queuedStem) {
    PushNotification.cancelAllLocalNotifications();
    const { Settings } = this.state;
    const { currHabit, numberOfStemsPerDay, queue, reflectNotificationTime, repeat } = Settings;
    if (!currHabit && !queuedStem) return;
    let notification = {};
    let queueRef = [...queue];
    if (!queuedStem) {
      // Example Queue object:
      // {
      //   notified: 'int',
      //   id: 'string',
      //   stem: 'string',
      //   habit: 'string',
      //   reflection: 'bool',
      // }
      if (queueRef.length === 0) {
        // Populate queueRef with notifications
        queueRef = this.addNewStemsToQueue(numberOfStemsPerDay, currHabit, this.state[currHabit]['completedStems']);
        if (queueRef.length === 0) {
          // TODO How to handle when user is finished with this think habit?
          // TODO Notify the user that they've finished this think habit
          queueRef = this.resetNewStemsToQueue(numberOfStemsPerDay, currHabit);
        }
      }
      const queuedNotification = JSON.parse(queueRef.shift());
      const multiply = reflectNotificationTime.length ? 2 : 1;
      if (queuedNotification.notified + 1 !== repeat * multiply) { // * multiply to factor in reflections
        queuedNotification.notified += 1;
        queueRef.unshift(JSON.stringify(queuedNotification));
        // ** Pay attention to whether a reflection is coming up for the most recent think habit
      }

      notification = queuedNotification;
    } else {
      PushNotification.cancelAllLocalNotifications();
      notification = {
        notified: 1,
        id: queuedStem['id'],
        stem: queuedStem['stem'],
        habit: queuedStem['habit'],
      }
      queueRef.unshift(JSON.stringify(notification));
    }
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      realm.write(() => {
        Settings['queue'] = queueRef;
      });
    });
    console.log('Notification QUEUE:', notification);
    console.log('Notification:', notification);

    const date = new Date();
    const { thinkNotificationDay, thinkNotificationTime, reflectNotificationDay } = Settings;
    const today = date.getDay();
    const hourNow = date.getHours();
    const millisecondsLeftInHour = (60 - date.getMinutes()) * 60 * 1000;
    const millisecondsInHour = 3600000;
    const millisecondsInDay = 86400000;
    let nextThinkNotificationTime;
    let nextReflectNotificationTime;
    let millisecondsTillNextNotification = 0;
    const thinkTitles = ['Food for thought', currHabit, 'Complete this sentence', `Build a ${currHabit.toLowerCase()} mindset`];
    const reflectTitles = ['Reflect', 'How was your day?', 'Mark your improvements', `Reflect on ${currHabit.toLowerCase()}`];
    let title;

    if (thinkNotificationTime.length && reflectNotificationTime.length) {
      // Find the next nearest hour in the same day
      thinkNotificationTime.some((hour) => {
        if (hour > hourNow) {
          nextThinkNotificationTime = hour;
          return true;
        }
      });
      reflectNotificationTime.some((hour) => {
        if (hour > hourNow) {
          nextReflectNotificationTime = hour;
          return true;
        }
      });
  
      if (!nextThinkNotificationTime && !nextReflectNotificationTime) {
        // If the next nearest hour does not exist later in the same day
        // Look for the next nearest hour in the following day.
        if (!nextThinkNotificationTime) {
          nextThinkNotificationTime = thinkNotificationTime[0];
        }
        if (!nextReflectNotificationTime) {
          nextReflectNotificationTime = reflectNotificationTime[0];
        }
      }
  
      let sameThinkDay;
      let nextThinkDay;
      let daySought;
      if (today < thinkNotificationDay[thinkNotificationDay.length - 1] || today < reflectNotificationDay[reflectNotificationDay.length - 1]) {
        daySought = 'greater';
      } else {
        daySought = 'least';
      }
      thinkNotificationDay.map((day) => {
        if (day === today) {
          if (nextThinkNotificationTime > hourNow) {
            sameThinkDay = true;
          }
        }
      });
      if (!sameThinkDay) {
        if (daySought === 'least') {
          nextThinkDay = thinkNotificationDay[0];
        } else if (daySought === 'greater') {
          thinkNotificationDay.some((day) => {
            if (day > today) {
              nextThinkDay = day;
              return true;
            }
          });
        }
        nextThinkNotificationTime = thinkNotificationTime[0];
      }
      let sameReflectDay;
      let nextReflectDay;
      reflectNotificationDay.map((day) => {
        if (day === today) {
          if (nextReflectNotificationTime > hourNow) {
            sameReflectDay = true;
          }
        }
      });
      if (!sameReflectDay) {
        if (daySought === 'least') {
          nextReflectDay = reflectNotificationDay[0];
        } else if (daySought === 'greater') {
          reflectNotificationDay.some((day) => {
            if (day > today) {
              nextReflectDay = day;
              return true;
            }
          });
        }
        nextReflectNotificationTime = reflectNotificationTime[0];
      }

      console.log('Pre calculation variables', daySought, sameThinkDay, nextThinkDay, sameReflectDay, nextReflectDay, nextThinkNotificationTime, nextReflectNotificationTime)

      if (sameThinkDay && sameReflectDay) {
        if (nextThinkNotificationTime < nextReflectNotificationTime) {
          const timeBetween = nextThinkNotificationTime - hourNow;
          millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
          title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
          console.log('nextThinkNotificationTime < nextReflectNotificationTime')
        } else {
          const timeBetween = nextReflectNotificationTime - hourNow;
          millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          notification.reflection = true;   
          console.log('nextThinkNotificationTime > nextReflectNotificationTime')
        }
  
  
  
      } else if (sameThinkDay || sameReflectDay) {
        if (sameThinkDay) {
          const timeBetween = nextThinkNotificationTime - hourNow;
          millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
          title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
          console.log('sameThinkDay')
        } else {
          const timeBetween = nextReflectNotificationTime - hourNow;
          millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          notification.reflection = true;   
          console.log('sameReflectDay')
        }
  
  
  
      } else if (daySought === 'least') {
        const millisecondsLeftInDay = ((24 - hourNow) * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
        if (nextThinkDay < nextReflectDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + (((7 - today) * millisecondsInDay) + (nextThinkDay * millisecondsInDay)) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
          title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)];
          console.log('daySought === "least" &&  nextThinkDay < nextReflectDay')        
        } else {
          millisecondsTillNextNotification = millisecondsLeftInDay + (((7 - today) * millisecondsInDay) + (nextReflectDay * millisecondsInDay)) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          notification.reflection = true;   
          console.log('daySought === "least" && nextThinkDay > nextReflectDay')
        }
  
  
  
      } else if (daySought === 'greater') {
        const millisecondsLeftInDay = ((24 - hourNow) * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
        if (nextThinkDay > nextReflectDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
          title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
          console.log('daySought === "greater" && nextThinkDay > nextReflectDay')     
        } else if (nextThinkDay < nextReflectDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + ((nextThinkDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          notification.reflection = true;   
          console.log('daySought === "greater" && nextThinkDay < nextReflectDay')
        } else if (nextThinkDay === nextReflectDay) {
          if (nextThinkNotificationTime < nextReflectNotificationTime) {
            millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
            title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
            console.log('nextThinkDay === nextReflectDay && nextThinkNotificationTime < nextReflectNotificationTime')        
          } else {
            millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
            title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
            notification.reflection = true;   
            console.log('nextThinkDay === nextReflectDay && nextThinkNotificationTime > nextReflectNotificationTime')
          }
        } else if (nextThinkDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + ((nextThinkDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          notification.reflection = true;   
          console.log('daySought === "greater" && nextThinkDay')
        } else if (nextReflectDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
          title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
          console.log('daySought === "greater" && nextReflectDay')   
        }
      }

    } else if (thinkNotificationTime.length) {
      
      millisecondsTillNextNotification = this.getTimeForSingleNotificationBatch(thinkNotificationTime, thinkNotificationDay, hourNow, today, millisecondsInDay, millisecondsInHour, millisecondsLeftInHour);
      title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]      
      console.log('thinkNotificationTime.length')

    } else if (reflectNotificationTime.length) {

      millisecondsTillNextNotification = this.getTimeForSingleNotificationBatch(reflectNotificationTime, reflectNotificationDay, hourNow, today, millisecondsInDay, millisecondsInHour, millisecondsLeftInHour);
      title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
      notification.reflection = true;   
      console.log('reflectNotificationTime.length')

    } else {
      // Something is wrong. We shouldn't ever be in this scenario.
      console.log('SERIOUS ERROR: NOTIFICATION IS EMPTY!');
      return;
    }

    console.log('NOTIFICATION VARIABLES:')
    console.log('thinkNotificationTime', thinkNotificationTime)
    console.log('reflectNotificationTime', reflectNotificationTime)
    console.log('nextThinkNotificationTime', nextThinkNotificationTime)
    console.log('thinkNotificationDay', thinkNotificationDay)
    console.log('nextReflectNotificationTime', nextReflectNotificationTime)
    console.log('reflectNotificationDay', reflectNotificationDay)
    console.log('millisecondsTillNextNotification', millisecondsTillNextNotification)
    // console.log('sameThinkDay', sameThinkDay)
    // console.log('sameReflectDay', sameReflectDay)
    // console.log('nextThinkDay', nextThinkDay)
    // console.log('nextReflectDay', nextReflectDay)
    // console.log('daySought', daySought)



    const dateOfNotification = new Date(Date.now() + millisecondsTillNextNotification);

    console.log('date of notification', dateOfNotification)

    PushNotification.localNotificationSchedule({
      /* Android Only Properties */
      // id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      // subText: "This is a subText", // (optional) default: none
      // color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: notification, // (optional) add tag to message
      // group: "group", // (optional) add group to message
      // ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high

      /* iOS only properties */
      // alertAction: // (optional) default: view
      // category: // (optional) default: null
      // userInfo: // (optional) default: null (object containing additional notification data)

      /* iOS and Android properties */
      title: title, // (optional)
      message: notification.stem, // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: 'time', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      repeatTime: 86400000,
      // actions: '["Later", "Think"]',  // (Android only) See the doc for notification actions to know more

      date: new Date(Date.now() + 10000), //dateOfNotification, 
    });
  }

  getTimeForSingleNotificationBatch(timeArray, dayArray, hourNow, today, millisecondsInDay, millisecondsInHour, millisecondsLeftInHour) {
    let nextThinkNotificationTime;
    let millisecondsTillNextNotification;
    timeArray.some((hour) => {
      if (hour > hourNow) {
        nextThinkNotificationTime = hour;
        return true;
      }
    });
    let sameThinkDay;
    let nextThinkDay;
    let daySought;
    if (today < dayArray[dayArray.length - 1]) {
      daySought = 'greater';
    } else {
      daySought = 'least';
    }
    dayArray.map((day) => {
      if (day === today) {
        if (nextThinkNotificationTime > hourNow) {
          sameThinkDay = true;
        }
      }
    });
    if (!sameThinkDay) {
      if (daySought === 'least') {
        nextThinkDay = dayArray[0];
      } else if (daySought === 'greater') {
        dayArray.some((day) => {
          if (day > today) {
            nextThinkDay = day;
            return true;
          }
        });
      }
      nextThinkNotificationTime = timeArray[0];
    }
    if (sameThinkDay) {
      const timeBetween = nextThinkNotificationTime - hourNow;
      millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
      console.log('getTimeForSingleNotificationBatch && sameThinkDay')
    } else if (daySought === 'least') {
      const millisecondsLeftInDay = ((24 - hourNow) * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
      millisecondsTillNextNotification = millisecondsLeftInDay + (((7 - today) * millisecondsInDay) + (nextThinkDay * millisecondsInDay)) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
      console.log('getTimeForSingleNotificationBatch && daySought === "least"') 
    } else if (daySought === 'greater') {
      const millisecondsLeftInDay = ((24 - hourNow) * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
      millisecondsTillNextNotification = millisecondsLeftInDay + ((nextThinkDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
      console.log('getTimeForSingleNotificationBatch && daySought === "greater"')  
    }
    return millisecondsTillNextNotification;
  }

  resetNewStemsToQueue(numberOfStemsPerDay, currHabit) {
    const queue = [];
    const addedToQueue = {};
    const length = Data[currHabit].length;
    for (let i = 0; i < numberOfStemsPerDay; i += 1) {
      let randomThought = Math.floor(Math.random() * length);
      let id = Data[currHabit][randomThought]['id'];
      if (!addedToQueue[id]) {
        addedToQueue[id] = true;
        const stem = JSON.stringify({
          notified: 0,
          id,
          stem: Data[currHabit][randomThought]['stem'],
          habit: currHabit,
        });
        queue.push(stem);
      } else {
        while (addedToQueue[id]) {
          randomThought = Math.floor(Math.random() * length);
          id = Data[currHabit][randomThought]['id'];
          if (!addedToQueue[id]) {
            const stem = JSON.stringify({
              notified: 0,
              id,
              stem: Data[currHabit][randomThought]['stem'],
              habit: currHabit,
            });
            queue.push(stem);
          }
        }
        addedToQueue[id] = true;
      }
    }
    return queue;
  }

  addNewStemsToQueue(numberOfStemsPerDay, currHabit, completedStems) {
    const queue = [];
    const addedToQueue = {};
    for (let i = 0; i < numberOfStemsPerDay; i += 1) {
      for (let j = 0; j < Data[currHabit].length; j += 1) {
        const id = Data[currHabit][j]['id'];
        if (!addedToQueue[id] && completedStems.indexOf(id) === -1) {
          const stem = JSON.stringify({
            notified: 0,
            id,
            stem: Data[currHabit][j]['stem'],
            habit: currHabit,
          });
          queue.push(stem);
          addedToQueue[id] = true;
          break;
        }
      }
    }
    return queue;
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
        if (!habit) {
          Settings['queue'] = [];
          PushNotification.cancelAllLocalNotifications();
        }
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

  updateStemInRealm(id, object, type) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Stem = realm.objectForPrimaryKey('Stem', id);
      if (type === 'new') {
        realm.write(() => {
          realm.create('Stem', object);
          const Habit = realm.objectForPrimaryKey('Habit', object['habit']);
          Habit['completedStems'].unshift(id);
        });
      } else if (Stem['id']) {
        realm.write(() => {
          Stem['date'] = object['date'];
          if (object['thoughts']) Stem['thoughts'] = object['thoughts'];
          if (object['reflections']) Stem['reflections'] = object['reflections'];
        });
      }
    });
  }

  passNavigationContext(context) {
    if (!this.state.navigation) {
      this.setState({ navigation: context });
    }
  }
}
