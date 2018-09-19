import Realm from 'realm';

class Habit extends Realm.Object {};
Habit.schema = {
  name: 'Habit',
  properties: {
    completedStemCount: 'int',
    completedStems: 'string[]',
    name: 'string',
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
    habitSeq: 'string[]',
    joinDate: 'int',
    name: 'string?',
    numberOfStemsPerDay: 'int',
    picture: 'string?',
    repeat: 'int',
    reflectNotificationTime: 'int[]',
    reflectNotificationDay: 'int[]',
    thinkNotificationTime: 'int[]',
    thinkNotificationDay: 'int[]',
  }
};

const Schema = [
  Habit,
  Pillar,
  Settings,
];

export default Schema;
