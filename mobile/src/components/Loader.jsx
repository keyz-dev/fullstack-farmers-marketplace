import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import { COLORS, SIZES } from '../constants'

const Loader = () => {
  return (
    <View style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    }}>
      <ActivityIndicator
        size={SIZES.xxLarge} 
        color={COLORS.primary} 
      />
    </View>
  );
};

export default Loader;
