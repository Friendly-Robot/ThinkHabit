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
    date: 'int',
    habit: 'string',
    stem: 'string',
    thoughts: 'string[]',
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
    joinDate: 'int',
    name: 'string?',
    numberOfStemsPerDay: 'int',
    picture: 'string?',
    queue: { type: 'list', objectType: 'QueueItem' },
    repeat: 'int',
    reflectNotificationTime: 'int[]',
    reflectNotificationDay: 'int[]',
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
