import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from '../../config/styles';

export default class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateSettings;
    this.state = {
      hideThoughts: props.hideThoughts,
      name: props.name,
      picture: props.picture,
      premium: props.premium,
      rated: props.rated,
      sound: props.sound,
    }
    this.handleContribution = this.handleContribution.bind(this);
    this.handleImageSelection = this.handleImageSelection.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.toggleHideThoughts = this.toggleHideThoughts.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
  }

  render() {
    const {
      // hideThoughts,
      // name,
      navigation,
      // picture,
      // premium,
      // rated,
      // updateSettings,
      // sound,
    } = this.props;
    
    const { 
      hideThoughts,
      name,
      picture,
      premium,
      rated,
      sound,
    } = this.state;

    return (
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header navigation={navigation} title={'Settings'} />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleImageSelection}
          style={styles.profileImage}
        >
          {
            picture ?
            <Image source={{uri: picture}} style={styles.picture} />
            :
            <Aicon name={'user'} style={styles.user} />
          }
        </TouchableOpacity>
        <TextInput
          keyboardType={'default'}
          onChangeText={this.handleNameInput}
          placeholder={'Your name'}
          placeholderTextColor={colors.darkGrey}
          returnKeyType='done'
          selectionColor={'#FF9900'}
          style={styles.input}
          underlineColorAndroid={'#FFFFFF'}
          value={name}
        />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleContribution}
          style={[styles.setting, styles.firstSetting]}
        >
          <Text style={styles.settingText}>Contribute a think habit</Text>
        </TouchableOpacity>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Hide thoughts while typing</Text>
          <Switch
            onTintColor={colors.primary}
            onValueChange={this.toggleHideThoughts}
            thumbTintColor={colors.grey}
            tintColor={colors.darkGrey}
            value={hideThoughts}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Notification sound</Text>
          <Switch
            onTintColor={colors.primary}
            onValueChange={this.toggleSound}
            thumbTintColor={colors.grey}
            tintColor={colors.darkGrey}
            value={sound}
          />
        </View>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleRating}
          style={styles.setting}
        >
          <Text style={styles.settingText}>Give us a quick rating</Text>
          <Aicon name={'heart'} style={[styles.settingIcon, rated && { color: '#A83F39' }]} />
        </TouchableOpacity>
        {
          premium ?
          <View/>
          :
          <View style={styles.upgradeContainer}>
            <View style={styles.perks}>
              <View style={styles.priceContainer}>
                <Text style={[styles.perky, { fontWeight: 'bold' }]}>Upgrade to premium version</Text>
                <Text style={styles.perky}>$0.99</Text>
              </View>
              <Text style={styles.perky}>Unlock favorites queue</Text>
              <Text style={styles.perky}>Support developer</Text>
              <Text style={styles.perky}>Remove ads</Text>
            </View>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={this.handleUpgrade}
              style={styles.upgradeButton}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
    )
  }

  componentWillUnmount() {
    if (this.updateSettings) {
      this.props.updateSettings(this.state);
    }
  }

  handleImageSelection() {
    this.updateSettings = true;
  }

  handleNameInput(text) {
    this.setState({ name: text });
    if (!this.updateSettings) this.updateSettings = true;
  }

  handleContribution() {

  }

  toggleHideThoughts() {
    const { hideThoughts } = this.state;
    this.setState({ hideThoughts: !hideThoughts });
    this.updateSettings = true;
  }

  toggleSound() {
    const { sound } = this.state;
    this.setState({ sound: !sound });
    this.updateSettings = true;
  }

  handleRating() {
    this.setState({ rated: true });
    if (Platform.OS === 'ios') {
      Linking.canOpenURL("itms-apps://itunes.apple.com/us/app/id${com.O2Balloons}?mt=8").then(supported => {
        if (!supported) { 
          // TODO Display a message
          console.log('Can\'t open URL to App Store: ' + '');
        } else {
          return Linking.openURL("itms-apps://itunes.apple.com/us/app/id${com.O2Balloons}?mt=8");
        }
      }).catch(err => console.error('An error occurred opening App Store', err));
    } else {
      // TODO Make sure this works
      Linking.canOpenURL("market://details?id=com.O2Balloons").then(supported => {
        if (!supported) {
          console.log('Can\'t open URL to Google Play: ' + '');
        } else {
          return Linking.openURL("market://details?id=com.O2Balloons");
        }
      }).catch(err => console.error('An error occurred opening Google Play', err));
    }
    this.updateSettings = true;
  }

  handleUpgrade() {
    // TODO IAP
    this.updateSettings = true;
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  firstSetting: {
    borderTopWidth: 1,
    marginTop: '25@vs',
  },
  input: {
    color: colors.darkGrey,
    fontSize: fonts.large,
    marginTop: '15@vs',
    textAlign: 'center',
    width: '80%',
  },
  perks: {
    alignSelf: 'stretch',
    paddingHorizontal: '15@ms',
  },
  perky: {
    fontSize: fonts.medium,
    marginBottom: '5@vs',
  },
  picture: {
    borderRadius: 100,
    height: '75@ms',
    width: '75@ms',
  },
  priceContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.darkGrey,
    borderRadius: 100,
    borderWidth: 1,
    height: '75@ms',
    justifyContent: 'center',
    marginTop: '35@vs',
    overflow: 'hidden',
    width: '75@ms',
  },
  setting: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: colors.grey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '15@ms',
    paddingVertical: '20@vs',
  },
  settingIcon: {
    color: colors.grey,
    fontSize: fonts.xl,
  },
  settingText: {
    color: colors.darkGrey,
    fontSize: fonts.medium,
  },
  upgradeButton: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: '15@ms',
    marginTop: '35@vs',
    paddingHorizontal: '15@ms',
    paddingVertical: '10@ms',
  },
  upgradeContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: '15@ms',
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  user: {
    color: colors.darkGrey,
    fontSize: '40@ms',
  },
});
