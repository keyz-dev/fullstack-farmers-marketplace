import { StyleSheet } from "react-native";
import { COLORS, SIZES} from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
        paddingBottom: SIZES.xxLarge + 30
    },
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    }
})

export default styles