import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
    container: {
      height: 60,
      width: SIZES.width,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 18,
      fontFamily: 'bold',
    },
});

export default styles