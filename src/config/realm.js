import Realm from 'realm'

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

class Habits extends Realm.Object {};
Habits.schema = {
  name: 'Habits',
  properties: {
    list: { type: 'list', objectType: 'Pillar' },
  }
};

class Pillar extends Realm.Object {};
Pillar.schema = {
  name: 'Pillar',
  properties: {
    date: 'int',
    habit: 'string',
    stem: 'string',
    thoughts: 'string[]',
    track: 'int',
    reflection: 'string?',
  }
};

class Pillars extends Realm.Object {};
Pillars.schema = {
  name: 'Pillars',
  properties: {
    stems: { type: 'list', objectType: 'Pillar' },
  }
};

class Settings extends Realm.Object {};
Settings.schema = {
  name: 'Settings',
  properties: {
    daysInRow: 'int',
    joinDate: 'int',
    name: 'string?',
    picture: 'string?',
  }
};

const Schema = [
  Habit,
  Habits,
  Pillar,
  Pillars,
  Settings,
];

export default Schema;
