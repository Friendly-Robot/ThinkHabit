import Realm from 'realm'

class Pillar extends Realm.Object {};
Pillar.schema = {
  name: 'Pillar',
  properties: {
    date: 'int',
    habit: 'string',
    stem: 'string',
    thoughts: 'string[]',
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
    habit: 'string?',
    joinDate: 'int',
    name: 'string?',
    picture: 'string?',
    progress: 'string', // JSON string of an object e.g. '{"Confidence": {"level": 95, "track": 3} ...}'
    reflectNotificationTime: 'int',
    reflectNotificationDay: 'int',
    thinkNotificationTime: 'int',
    thinkNotificationDay: 'int',
  }
};

const Schema = [
  Pillar,
  Pillars,
  Settings,
];

export default Schema;
