import React from 'react';
import { PushNotificationIOS } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Realm from 'realm';
import Schema from './config/realm';
import Navigator from './screens/Navigator';
import SplashScreen from './screens/SplashScreen';
import Selection from './screens/Selection';
import Habits from './screens/Habits';
import Stem from './screens/Stem';
import Settings from './screens/Settings';
import About from './screens/About';
import PushNotification from 'react-native-push-notification'
import Data from './config/data';
import { NavigationActions } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';


if (!__DEV__) {
  console.log = () => {};
}

const HabitsNavigator = createStackNavigator({
  'Habits': {
    screen: function(props) {
      return (
        <Habits
          addToQueue={props.screenProps.addToQueue}
          appSet={props.screenProps.appSet}
          daysInRow={props.screenProps.Settings.daysInRow}
          Confidence={props.screenProps.Confidence}
          Meditation={props.screenProps.Meditation}
          Relationships={props.screenProps.Relationships}
          Responsibility={props.screenProps.Responsibility}
          Courage={props.screenProps.Courage}
          Freedom={props.screenProps.Freedom}
          currHabit={props.screenProps.Settings.currHabit}
          habitSeq={props.screenProps.Settings.habitSeq}
          navigation={props.navigation}
          passNavigationContext={props.screenProps.passNavigationContext}
          premium={props.screenProps.Settings.premium}
          queue={props.screenProps.Settings.queue}
          removeFromQueue={props.screenProps.removeFromQueue}
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
          passcode={props.screenProps.Settings.passcode}
          passed={props.screenProps.passed}
          passOnce={props.screenProps.Settings.passOnce}
          premium={props.screenProps.Settings.premium}
          updatePassed={props.screenProps.updatePassed}
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
    screen: HabitsNavigator,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Micon name={'brain'} color={tintColor} size={moderateScale(18)} />
      ),
    },
  },
  'Settings': {
    screen: function(props) {
      return (
        <Settings 
          name={props.screenProps.Settings.name}
          navigation={props.navigation}
          passcode={props.screenProps.Settings.passcode}
          passOnce={props.screenProps.Settings.passOnce}
          picture={props.screenProps.Settings.picture}
          premium={props.screenProps.Settings.premium}
          rated={props.screenProps.Settings.rated}
          sound={props.screenProps.Settings.sound}
          updateSettings={props.screenProps.updateSettings}
        />
      )
    },
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Aicon name={'cogs'} color={tintColor} size={moderateScale(18)} />
      ),
    },
  },
  'About': {
    screen: function(props) {
      return (
        <About navigation={props.navigation} />
      )
    },
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Aicon name={'info-circle'} color={tintColor} size={moderateScale(18)} />
      ),
    },
  }
}, {
  headerMode: 'none',
  navigationOptions: {
    header: false,
  },
  initialRouteName: 'Habits',
  contentComponent: function(props) {
    return (
      <Navigator  
        activeItemKey={props.activeItemKey}
        favorites={props.screenProps.favorites}
        getLabel={props.getLabel}
        image={props.screenProps.image}
        items={props.items}
        lockQ={props.screenProps.lockQ}
        name={props.screenProps.Settings.name}
        navigation={props.navigation}
        onItemPress={props.onItemPress}
        picture={props.screenProps.Settings.picture}
        playTap={props.screenProps.playTap}
        queueLen={props.screenProps.queueLen}
        renderIcon={props.renderIcon}
      />
    )
  }
});
  
  const BaseNavigator = createStackNavigator({
    'SplashScreen': {
      screen: function(props) {
        return (
          <SplashScreen 
            appReady={props.screenProps.appReady} 
            appSet={props.screenProps.appSet}
            checkOnNotificationAndRender={props.screenProps.checkOnNotificationAndRender} 
            navigation={props.navigation}
            notification={props.screenProps.notification}
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
            setHabitProgress={props.screenProps.setHabitProgress}
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
    this.notificationAttempt = 0;
    this.state = {
      appReady: false,
      appSet: false,
      navigation: null,
      notification: false,
      passed: false,
      Settings: {},
      Confidence: {},
      Meditation: {},
      Relationships: {},
      Responsibility: {},
      Courage: {},
      Freedom: {},
    }
    this.addToQueue = this.addToQueue.bind(this);
    this.checkOnNotificationAndRender = this.checkOnNotificationAndRender.bind(this);
    this.passNavigationContext = this.passNavigationContext.bind(this);
    this.removeFromQueue = this.removeFromQueue.bind(this);    
    this.setHabitProgress = this.setHabitProgress.bind(this);
    this.updateHabitSettings = this.updateHabitSettings.bind(this);
    this.updatePassed = this.updatePassed.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.updateStemInRealm = this.updateStemInRealm.bind(this);
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log( 'ON NOTIFICATION:', notification );

        this.onNotification = notification.tag;
        this.checkOnNotificationAndRender();
        this.setNextPushNotification();

        this.setState({ notification: true });

        // ** How do we handle not sending the same unopened stem??
        
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
      notification,
      passed,
      // queue,
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
          notification,
          passed,

          Settings,
          Confidence,
          Meditation,
          Relationships,
          Responsibility,
          Courage,
          Freedom,

          addToQueue: this.addToQueue,
          checkOnNotificationAndRender: this.checkOnNotificationAndRender,
          passNavigationContext: this.passNavigationContext,
          removeFromQueue: this.removeFromQueue,
          setHabitProgress: this.setHabitProgress,
          updateHabitSettings: this.updateHabitSettings,
          updatePassed: this.updatePassed,
          updateSettings: this.updateSettings,
          updateStemInRealm: this.updateStemInRealm,
        }}
      />
    );
  }

  componentDidMount() {
    this.initializeApp();
    setTimeout(() => this.setNextPushNotification(), 1000);
  }
  
  initializeApp() {
    // Realm.clearTestState();
    Realm.open({schema: Schema, schemaVersion: 0})
    .then((realm) => {
      const Settings = realm.objects('Settings')[0];
      if (Settings) {
        this.restoreEnvironment();
        setTimeout(() => this.checkToQueueNotifications(), 1000);
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
        // queue,
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
          currStem: '',
          daysInRow: 0, 
          habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'],
          joinDate, 
          name: '', 
          passcode: '',
          passOnce: true,
          picture: '',
          premium: false,
          queue: [],
          rated: false,
          repeat: 3, 
          reflectNotificationTime, 
          reflectNotificationDay,
          sound: true,
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
        currStem: '',
        daysInRow: 0,
        habitSeq: ['Confidence', 'Meditation', 'Relationships', 'Responsibility', 'Courage', 'Freedom'],
        joinDate,
        name: '',
        passcode: '',
        passOnce: true,
        picture: '',
        premium: false, // TODO Check IAP if purchase history found somehow?
        queue: [],
        rated: false,
        repeat: 3, 
        reflectNotificationTime, 
        reflectNotificationDay,
        sound: true,
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

  checkToQueueNotifications() {
    if (this.onNotification) return;
    const { Settings } = this.state;
    const queueItem = Settings['queue'][0];
    const now = Date.now();
    if (queueItem && queueItem['date'] > now) {
      return;
    } else {
      // The app was opened after a passed notification so replenish the queue.
      this.setNextPushNotification();
    }
  }

  checkOnNotificationAndRender() {
    if (this.onNotification && this.notificationAttempt < 4) {
      if (this.state.navigation) {
        this.handleOpenedNotification(this.onNotification);
      } else {
        setTimeout(() => {
          this.notificationAttempt += 1;
          this.checkOnNotificationAndRender();
        }, 500);
      }
    }
  }

  handleOpenedNotification(notification) {
    if (!this.state.navigation) {
      // Prevent navigation until context is passed.
      this.checkOnNotificationAndRender();
      return;
    }
    this.setState({ notification: true });
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Stem = realm.objectForPrimaryKey('Stem', notification['id']);
      if (Stem && Stem['id']) {
        notification['thinkDate'] = Stem['thinkDate'];
        notification['reflectDate'] = Stem['reflectDate'];
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
    this.notificationAttempt = 0;
    this.onNotification = null;
    setTimeout(() => {
      // This is not necessary because state refreshes before next cold startup.
      // Small cost for a worry-free "stuck in splash screen" state
      this.setState({ notification: false });
    }, 2000);
  }

  setBufferNotifications(date) {
    const stems = [];
    const { Settings } = this.state;
    const { currHabit, currStem, thinkNotificationTime, thinkNotificationDay, sound } = Settings;
    let count = 0;
    let stem = currStem;
    while (count < 15) {
      const newStem = this.addNewStemToQueue(currHabit, stem, true);
      stem = newStem[0]['id'];
      stems.push(newStem[0]);
      count += 1;
    }
    let nextQueuedDate = date;
    let nextQueuedDay = date.getDay();
    let nextQueuedHour = date.getHours();
    let title = '';
    const millisecondsLeftInHour = (60 - date.getMinutes()) * 60 * 1000;
    const millisecondsInHour = 3600000;
    const millisecondsInDay = 86400000;
    const thinkTitles = ['Food for thought', currHabit, 'Complete this sentence', `Build a ${currHabit.toLowerCase()} mindset`];
    stems.map(stem => {
      nextQueuedDate = this.getNextNotificationDate(nextQueuedDate, nextQueuedDay, nextQueuedHour, thinkNotificationTime, thinkNotificationDay, millisecondsLeftInHour, millisecondsInHour, millisecondsInDay);
      nextQueuedDay = nextQueuedDate.getDay();
      nextQueuedHour = nextQueuedDate.getHours();
      console.log('Next Queued Date/Day/Hour', nextQueuedDate, nextQueuedDay, nextQueuedHour)
      title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)];
      this.scheduleNotification(nextQueuedDate, stem, title, stem.stem, sound);
    });
  }

  getNextNotificationDate(startDate, startDay, startHour, thinkNotificationTime, thinkNotificationDay, millisecondsLeftInHour, millisecondsInHour, millisecondsInDay) {
    let nextThinkNotificationTime;
    thinkNotificationTime.some((hour) => {
      if (hour > startHour) {
        nextThinkNotificationTime = hour;
        return true;
      }
    });
    if (!nextThinkNotificationTime) {
      nextThinkNotificationTime = thinkNotificationTime[0];
    }
    let sameThinkDay;
    let nextThinkDay;
    let daySought;
    if (startDay < thinkNotificationDay[thinkNotificationDay.length - 1]) {
      daySought = 'greater';
    } else {
      daySought = 'least';
    }
    thinkNotificationDay.map((day) => {
      if (day === startDay) {
        if (nextThinkNotificationTime > startHour) {
          sameThinkDay = true;
        }
      }
    });
    if (!sameThinkDay) {
      if (daySought === 'least') {
        nextThinkDay = thinkNotificationDay[0];
      } else if (daySought === 'greater') {
        thinkNotificationDay.some((day) => {
          if (day > startDay) {
            nextThinkDay = day;
            return true;
          }
        });
      }
      nextThinkNotificationTime = thinkNotificationTime[0];
    }
    if (sameThinkDay) {
      const timeBetween = nextThinkNotificationTime - startHour;
      millisecondsTillNextNotification = (timeBetween * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
      console.log('SameThinkDay nextThinkNotificationTime of next queued item', millisecondsTillNextNotification);
    } else if (nextThinkDay) {
      const millisecondsLeftInDay = ((24 - startHour) * millisecondsInHour) - (millisecondsInHour - millisecondsLeftInHour);
      if (daySought === 'least') {
        millisecondsTillNextNotification = millisecondsLeftInDay + (((7 - startDay) * millisecondsInDay) + (nextThinkDay * millisecondsInDay)) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
        console.log('daySought === "least" &&  nextThinkDay of next queued item', millisecondsTillNextNotification);        
      } else if (daySought === 'greater') {
        millisecondsTillNextNotification = millisecondsLeftInDay + ((nextThinkDay - startDay) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
        console.log('daySought === "greater" && nextThinkDay of next queued item', millisecondsTillNextNotification);
      }
    }
    return new Date(startDate.getTime() + millisecondsTillNextNotification);
  }

  setNextPushNotification(queuedStem) {
    PushNotification.cancelAllLocalNotifications();
    const { Settings } = this.state;
    const { currHabit, currStem, queue, reflectNotificationTime, repeat, sound } = Settings;
    console.log('Queue in setNextPushNotification from state:', queue)
    if (!currHabit && !queuedStem) return;
    let newQueue = [];
    let notification = {};
    let queuedNotification = queue[0] || {};
    if (!queuedStem) {
      // Example Queue object:
      // {
      //   date: 'int',
      //   notified: 'int',
      //   id: 'string',
      //   stem: 'string',
      //   habit: 'string',
      //   reflection: 'bool',
      // }
      if (queue.length === 0) {
        if (currHabit === 'Bookmarks') {
          newQueue = this.addNewBookmarksToQueue(currStem);
        } else {
          // Populate newQueue with notifications
          newQueue = this.addNewStemToQueue(currHabit, currStem);
          if (newQueue.length === 0) {
            // TODO How to handle when user is finished with this think habit?
            // TODO Notify the user that they've finished this think habit
            newQueue = this.resetNewStemsToQueue(currHabit, currStem);
          }
          queuedNotification = newQueue[0];
          Realm.open({schema: Schema, schemaVersion: 0})
          .then(realm => {
            realm.write(() => {
              newQueue.map(item => {
                const QueueItem = realm.create('QueueItem', item);
                Settings['queue'].push(QueueItem);
              });
            });
          });
        }
      }

      const multiply = reflectNotificationTime.length ? 2 : 1;
      notification = queuedNotification;
      if (queuedNotification.notified + 1 <= repeat * multiply) { // * multiply to factor in reflections
        Realm.open({schema: Schema, schemaVersion: 0})
        .then(realm => {
          realm.write(() => {
            Settings['queue'][0]['notified'] += 1;
          });
        });
        // ** Pay attention to whether a reflection is coming up for the most recent think habit
      } else {
        Realm.open({schema: Schema, schemaVersion: 0})
        .then(realm => {
          realm.write(() => {
            const oldStem = Settings['queue'].shift();
            realm.delete(oldStem);
            this.setState({ Settings });
          });
        });
      }

    } else {
      PushNotification.cancelAllLocalNotifications();
      queuedNotification = {
        date: 0,
        notified: 1,
        id: queuedStem['id'],
        stem: queuedStem['stem'],
        habit: queuedStem['habit'],
      }
      notification = queuedNotification;
      Realm.open({schema: Schema, schemaVersion: 0})
      .then(realm => {
        realm.write(() => {
          const QueueItem = realm.create('QueueItem', queuedNotification);
          Settings['queue'].unshift(QueueItem);
        });
      });
    }

    console.log('Queue in setNextPushNotification after state:', queue)
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
    const reflectTitles = ['Reflection', 'How was your day?', 'Mark your improvements', `Reflect on ${currHabit.toLowerCase()}`];
    let title;
    let type;

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

      console.log(
        `Pre calculation variables:'
        daySought: ${daySought},
        sameThinkDay: ${sameThinkDay},
        nextThinkDay: ${nextThinkDay},
        sameReflectDay: ${sameReflectDay},
        nextReflectDay: ${nextReflectDay},
        nextThinkNotificationTime: ${nextThinkNotificationTime},
        nextReflectNotificationTime: ${nextReflectNotificationTime}
      `)

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
          type = 'reflection';   
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
          type = 'reflection';   
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
          type = 'reflection';   
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
          type = 'reflection';   
          console.log('daySought === "greater" && nextThinkDay < nextReflectDay')
        } else if (nextThinkDay === nextReflectDay) {
          if (nextThinkNotificationTime < nextReflectNotificationTime) {
            millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
            title = thinkTitles[Math.floor(Math.random() * thinkTitles.length)]
            console.log('nextThinkDay === nextReflectDay && nextThinkNotificationTime < nextReflectNotificationTime')        
          } else {
            millisecondsTillNextNotification = millisecondsLeftInDay + ((nextReflectDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextReflectNotificationTime * millisecondsInHour));
            title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
            type = 'reflection';   
            console.log('nextThinkDay === nextReflectDay && nextThinkNotificationTime > nextReflectNotificationTime')
          }
        } else if (nextThinkDay) {
          millisecondsTillNextNotification = millisecondsLeftInDay + ((nextThinkDay - today) * millisecondsInDay) - ((millisecondsInDay) - (nextThinkNotificationTime * millisecondsInHour));
          title = reflectTitles[Math.floor(Math.random() * reflectTitles.length)];
          type = 'reflection';   
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
      // notification.reflection = true;
      type = 'reflection';   
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

    const dateOfNotification = new Date(Date.now() + millisecondsTillNextNotification);
    this.setBufferNotifications(dateOfNotification);
    const queueItemDate = dateOfNotification.getTime();

    console.log('date of notification', dateOfNotification)

    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      realm.write(() => {
        if (Settings['queue'][0]) Settings['queue'][0]['date'] = queueItemDate;
      });
    });

    if (type === 'reflect') {
      notification['reflection'] = true;
    }

    this.scheduleNotification(dateOfNotification, notification, title, notification.stem, sound);
  }

  scheduleNotification(date, tag, title, message, sound) {
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
      tag, // (optional) add tag to message
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
      title, // (optional)
      message, // (required)
      playSound: sound, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: 'time', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      repeatTime: 86400000,
      // actions: '["Later", "Think"]',  // (Android only) See the doc for notification actions to know more

      date, 
      // date: new Date(Date.now() + 1000),
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

  resetNewStemsToQueue(currHabit, currStem) {
    const length = Data[currHabit].length;
    let randomThought = Math.floor(Math.random() * length);
    let id = Data[currHabit][randomThought]['id'];
    let stem;

    while (currStem === id) {
      randomThought = Math.floor(Math.random() * length);
      id = Data[currHabit][randomThought]['id'];
      if (currStem !== id) {
        stem = {
          date: 0,
          notified: 0,
          id,
          stem: Data[currHabit][randomThought]['stem'],
          habit: currHabit,
        };
      }
    }
    this.updateCurrStem(id);
    return [stem];
  }

  addNewStemToQueue(currHabit, currStem, buffer) {
    let currStemIndex = 0;
    Data[currHabit].some((stem, idx) => {
      if (currStem === stem['id']) {
        currStemIndex = idx;
        return true;
      }
    });
    let nextIndex = 0;
    if (currStemIndex === Data[currHabit].length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += currStemIndex + 1;
    }
    let id = Data[currHabit][nextIndex]['id'];
    const stem = {
      date: 0,
      notified: 0,
      id,
      stem: Data[currHabit][nextIndex]['stem'],
      habit: currHabit,
    };
    if (!buffer) this.updateCurrStem(id);
    return [stem];
  }

  addNewBookmarksToQueue(currStem) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Bookmarks = realm.objects('Stem').filtered('favorite = $0', true);
      let random = Math.floor(Math.random() * Bookmarks.length);
      if (Bookmarks[random]['id'] === currStem && Bookmarks.length > 1) {
        while (Bookmarks[random]['id'] === currStem) {
          random = Math.floor(Math.random() * Bookmarks.length);
        }
      }
      const queueItem = {
        date: 0,
        notified: 0,
        id: Bookmarks[random]['id'],
        stem: Bookmarks[random]['stem'],
        habit: Bookmarks[random]['habit'],
      };
      this.updateCurrStem(Bookmarks[random]['id']);
      return [queueItem];
    });
  }

  updateCurrStem(id) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      realm.write(() => {
        Settings['currStem'] = id;
        this.setState({ Settings });
      });
    });
  }

  setHabitProgress(habit) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      const habitSeq = Settings['habitSeq'];
      realm.write(() => {
        habitSeq.splice(habitSeq.indexOf(habit), 1);
        habitSeq.unshift(habit);
        Settings['currHabit'] = habit;
        this.setState({ Settings });
        setTimeout(() => this.setNextPushNotification(), 1000);
      });
    });
  }

  updateHabitSettings(object) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      realm.write(() => {
        if (Settings['currHabit'] !== object['currHabit']) {
          setTimeout(() => this.setNextPushNotification(), 1000);
        } else if (object['currHabit'] === '') {
          PushNotification.cancelAllLocalNotifications();
        }
        Settings['currHabit'] = object['currHabit'];
        Settings['habitSeq'] = object['habitSeq'];
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
          if (object['thoughts'].length || object['reflections'].length) {
            const Habit = realm.objectForPrimaryKey('Habit', object['habit']);
            Habit['completedStems'].unshift(id);
          }
        });
      } else if (Stem['id']) {
        realm.write(() => {
          if ((object['thoughts'] && object['thoughts'].length) && Stem['thoughts'].length === 0) {
            const Habit = realm.objectForPrimaryKey('Habit', Stem['habit']);
            Habit['completedStems'].unshift(id);
          }
          if (object['favorite'] !== Stem['favorite']) Stem['favorite'] = object['favorite'];
          if (object['locked'] !== Stem['locked']) Stem['locked'] = object['locked'];
          if (object['thinkDate']) Stem['thinkDate'] = object['thinkDate'];
          if (object['reflectDate']) Stem['reflectDate'] = object['reflectDate'];
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

  addToQueue(stem) {
    this.setNextPushNotification(stem);
  }

  removeFromQueue(id) {
    const { Settings } = this.state;
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      realm.write(() => {
        const QueueItem = Settings['queue'].filtered('id = $0', id);
        realm.delete(QueueItem);
        this.setNextPushNotification();
      });
    });
  }

  updateSettings(settings) {
    Realm.open({schema: Schema, schemaVersion: 0})
    .then(realm => {
      const Settings = realm.objects('Settings')[0];
      realm.write(() => {
        if (Settings['name'] !== settings['name']) Settings['name'] = settings['name'];
        if (Settings['passcode'] !== settings['passcode']) Settings['passcode'] = settings['passcode'];
        if (Settings['passOnce'] !== settings['passOnce']) Settings['passOnce'] = settings['passOnce'];
        if (Settings['picture'] !== settings['picture']) Settings['picture'] = settings['picture'];
        if (Settings['premium'] !== settings['premium']) Settings['premium'] = settings['premium'];
        if (Settings['rated'] !== settings['rated']) Settings['rated'] = settings['rated'];
        if (Settings['sound'] !== settings['sound']) {
          Settings['sound'] = settings['sound'];
          setTimeout(() => this.setNextPushNotification(), 500);
        }
        this.setState({ Settings });
      });
    });
  }

  updatePassed() {
    this.setState({ passed: true });
  }
}
