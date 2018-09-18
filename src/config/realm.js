import Realm from 'realm';

class Habit extends Realm.Object {};
Habit.schema = {
  name: 'Habit',
  properties: {
    completedStemCount: 'int',
    completedStems: 'string[]',
    inProgress: 'bool',
    name: 'string',
    numberOfStemsPerDay: 'int',
    repeat: 'int',
    reflectNotificationTime: 'int',
    reflectNotificationDay: 'int',
    thinkNotificationTime: 'int',
    thinkNotificationDay: 'int',
  }
};

class Pillar extends Realm.Object {};
Pillar.schema = {
  name: 'Pillar',
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'int',
    habit: 'string',
    stem: 'string',
    thoughts: 'string[]',
    track: 'int',
    reflection: 'string?',
  }
};

class Settings extends Realm.Object {};
Settings.schema = {
  name: 'Settings',
  properties: {
    badges: 'string[]',
    currDay: 'int',
    currHabit: 'string?',
    daysInRow: 'int',
    joinDate: 'int',
    name: 'string?',
    picture: 'string?',
  }
};

const Schema = [
  Habit,
  Pillar,
  Settings,
];

export default Schema;
