import { ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../config/styles';

export default styles = ScaledSheet.create({
  close: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  closeContainer: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 100,
    borderWidth: 1,
    height: '35@ms',
    justifyContent: 'center',
    position: 'absolute',
    right: '15@ms',
    bottom: '15@vs',
    width: '35@ms',
  },
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'space-around',
  },
  forgot: {
    color: colors.secondary,
    fontSize: fonts.small,
  },
  forgotContainer: {
    bottom: '20@vs',
    position: 'absolute',
  },
  input: {
    color: colors.secondary,
    fontSize: fonts.large,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '5@s',
    height: '40@ms',
    justifyContent: 'center',
    marginHorizontal: '10@s',
    width: '40@ms',
  },
  inputsContainer: {
    flexDirection: 'row',
  },
  key: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  keyCenter: {
    justifyContent: 'center',
  },
  keyContainer:{
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 100,
    borderWidth: 1,
    height: '50@vs',
    justifyContent: 'center',
    marginHorizontal: '10@ms',
    width: '50@vs',
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: '20@vs',
  },
  message: {
    color: colors.secondary,
    fontSize: fonts.large,
    fontWeight: 'bold',
    position: 'absolute',
    top: '15@vs',
  },
  orange: {
    backgroundColor: colors.secondary,
  },
  underline: {
    bottom: '5@vs',
    height: 1,
    position: 'absolute',
    width: '30@ms',
  },
  white: {
    backgroundColor: 'white',
  },
});