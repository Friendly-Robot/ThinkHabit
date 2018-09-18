import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const { height, width } = Dimensions.get('window');

export const colors = {
  primary: '#1568A1',
  darkGrey: '#545454',
  grey: '#d3d3d3',
  lightGrey: '#FAFAFA',
  secondary: '#FF9900', // rgba(255, 153, 0, 1)
}

export const fonts = {
  xs: moderateScale(12, 0.2),
  small: moderateScale(14, 0.1),
  medium: moderateScale(18, 0.1),
  large: moderateScale(22, 0.2),
  xl: moderateScale(32),
};