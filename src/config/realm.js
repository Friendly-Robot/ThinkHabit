import Realm from 'realm';

class Habit extends Realm.Object {};
Habit.schema = {
  name: 'Habit',
  primaryKey: 'name',
  properties: {
    completedStemCount: 'int',
    completedStems: 'string[]',
    name: 'string',
  }
};


class QueueItem extends Realm.Object {};
QueueItem.schema = {
  name: 'QueueItem',
  properties: {
    notified: 'int',
    id: 'string',
    stem: 'string',
    habit: 'string?',
  }
};

class Stem extends Realm.Object {};
Stem.schema = {
  name: 'Stem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    favorite: 'bool',
    habit: 'string',
    stem: 'string',
    thinkDate: 'int',
    thoughts: 'string[]',
    reflectDate: 'int',
    reflections: 'string[]',
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
    hideThoughts: 'bool',
    joinDate: 'int',
    name: 'string?',
    numberOfStemsPerDay: 'int',
    picture: 'string?',
    premium: 'bool',
    queue: { type: 'list', objectType: 'QueueItem' },
    rated: 'bool',
    repeat: 'int',
    reflectNotificationTime: 'int[]',
    reflectNotificationDay: 'int[]',
    sound: 'bool',
    thinkNotificationTime: 'int[]',
    thinkNotificationDay: 'int[]',
  }
};

const Schema = [
  Habit,
  QueueItem,
  Stem,
  Settings,
];

export default Schema;
