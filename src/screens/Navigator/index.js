import React from 'react';
import { 
  Image,
  Text,
  TouchableOpacity,
  View, 
  ScrollView,
} from 'react-native';
import { DrawerActions, DrawerItems, NavigationActions, SafeAreaView } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from '../../config/styles';


export default class Navigator extends React.PureComponent {
  render() {
    const {
      activeItemKey,
      items,
      getLabel,
      name,
      navigation,
      onItemPress,
      picture,
      renderIcon,
    } = this.props;

    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {
              picture ?
              <Image source={{uri: picture}} style={styles.picture} />
              :
              <Aicon name={'user'} style={styles.user} />
            }
          </View>
          <Text style={styles.name}>{ name ? name : picture ? '' :  'Setup your profile' }</Text>
        </View>
        <ScrollView contentContainerStyle={styles.flexGrow}>
          <SafeAreaView style={styles.flex} forceInset={{ top: 0, horizontal: 'never' }}>
            <DrawerItems
              activeTintColor={colors.primary}
              activeItemKey={activeItemKey}
              navigation={navigation} 
              inactiveTintColor={colors.darkGrey}
              items={items}
              onItemPress={onItemPress} 
              renderIcon={renderIcon}
              getLabel={getLabel}
            />
          </SafeAreaView>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footer}>Think Habit</Text>
        </View>
      </View>
    )
  }

  componentDidMount() {
    const routes = {
      'HireMe': () => this.navigateToScreen('HireMe'),
      'Checkout': () => this.navigateToScreen('Checkout'),
      'Favorites': () => this.navigateToScreen('Favorites'),
      'Queue': () => this.navigateToScreen('Queue'),
    };
    this.setState({ routes });
  }

}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  flex: {    
    backgroundColor: colors.darkBlue,
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  footer: {
    color: colors.primary,
    fontSize: fonts.large,
    textAlign: 'center',
  },
  footerContainer: {
    bottom: 0,
    left: 0,
    paddingVertical: 15,
    position: 'absolute',
    right: 0,
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    height: '150@vs',
    justifyContent: 'space-between',
    padding: '15@ms',
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 100,
    height: '75@ms',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '75@ms',
  },
  name: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  picture: {
    borderRadius: 100,
    height: '75@ms',
    width: '75@ms',
  },
  user: {
    color: colors.darkGrey,
    fontSize: '40@ms',
  },
});