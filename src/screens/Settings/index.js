import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from '../../config/styles';

export default class Settings extends React.PureComponent {
  render() {
    const { 
      image,
      name,
      navigation,
      premium, // TODO
      rated, // TODO
    } = this.props;

    return (
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header navigation={navigation} title={'Settings'} />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={() => {}}
          style={styles.profileImage}
        >
          {
            image ?
            <Image source={{uri: image}} style={styles.image} />
            :
            <Aicon name={'user'} style={styles.user} />
          }
        </TouchableOpacity>
        <TextInput
          keyboardType={'default'}
          // onChangeText={this.handleInput}
          // ref={ref => this.input = ref}   
          placeholder={name ? name : 'Your name'}
          placeholderTextColor={colors.darkGrey}
          returnKeyType='done'
          selectionColor={'#FF9900'}
          style={styles.input}
          underlineColorAndroid={'#FFFFFF'}
        />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={() => {}}
          style={[styles.setting, styles.firstSetting]}
        >
          <Text style={styles.settingText}>Contribute a think habit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={() => {}}
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
              onPress={() => {}}
              style={styles.upgradeButton}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
    )
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  firstSetting: {
    borderTopWidth: 1,
    marginTop: '25@vs',
  },
  image: {
    borderRadius: 100,
    height: '75@ms',
    width: '75@ms',
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
    paddingHorizontal: '15@ms',
    paddingVertical: '10@ms',
  },
  upgradeContainer: {
    alignSelf: 'stretch',
    flex: 1,
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
