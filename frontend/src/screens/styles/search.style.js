import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
    searchImage: {
        resizeMode: 'contain',
        width: SIZES.width - 100,
        height: SIZES.height - 300
    }
})

export default styles;