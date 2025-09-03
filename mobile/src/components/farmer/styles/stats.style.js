import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

export default StyleSheet.create({
    statsCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.small,
        padding: SIZES.medium,
        borderLeftWidth: 4,
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: SIZES.small,
    },
    statsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsText: {
        flex: 1,
    },
    statsValue: {
        fontSize: SIZES.xLarge,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statsTitle: {
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.gray,
    },
})
