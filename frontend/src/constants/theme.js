import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

const COLORS = {
  primary: "#2A4D50",
  secondary: "#e0f2e9",
  tertiary: "#FF7754",

  gray: "#83829A",
  gray2: "#C1C0C8",

  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#212121",
  red: "#e81e4d",
  green: " #00C135",
  lightWhite: "#FAFAFC",

  lightBg: '#f6f8fa',
  placeholder: '#adadad',

  success: '#4DC281',
  successBg: '#C5F1DE',
  pending: '#5e63ff',
  pendingBg: '#adb0fd6b',
  pending1: '#713DC9',
  pending1Bg: '#E1CFFD5b',
  warning: '#E2796C',
  warningBg: '#F6D4CA',
  error: '#FF5540',
  errorBg: '#ffc9cac1',
  info: '#2196F3',
  border: '#C2C2C2',
  line: '#DCDEE3',
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};
export { COLORS, SIZES, SHADOWS };
