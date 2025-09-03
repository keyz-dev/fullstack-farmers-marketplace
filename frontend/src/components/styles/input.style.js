import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
    wrapper: (additionWrapperStyles) => ({
        marginBottom: 15,
        ...additionWrapperStyles
    }),
    label: (labelStyles) => ({
        fontFamily: 'regular',
        fontSize: SIZES.small,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "right",
        ...labelStyles
    }),
    inputWrapper: (borderColor, addStyles) => ({
        borderColor: borderColor,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        height: 55,
        paddingHorizontal: SIZES.medium - 1,
        backgroundColor: COLORS.lightWhite,
        ...addStyles
    }),
    iconStyle: (iconStyles) => ({
        marginRight: 10,
        ...iconStyles
    }),
    errorMessage: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        marginLeft: 10,
        color: COLORS.error,
        marginTop: 5
    },
});

export default styles