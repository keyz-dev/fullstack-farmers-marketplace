import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.base,
        width: 182,
        height: 240,
        marginEnd: 22,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.secondary
    },
    imageContainer: {
        width: 170,
        flex: 1,
        marginLeft: SIZES.small/2,
        marginTop: SIZES.small/2,
        borderRadius: SIZES.small,
        overflow: 'hidden',
        position: 'relative',
    },
    favoriteIcon: {
        position: 'absolute', 
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: COLORS.white,
    },
    details: {
        marginTop: SIZES.base,
        padding: SIZES.small,
    },
    productName: {
        fontFamily: 'regular',
        fontSize: SIZES.medium - 1,
        color: COLORS.gray,
    },
    productDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    productPrice: {
        fontFamily: 'semibold',
        fontSize: SIZES.medium,
        color: COLORS.black,
    },
});

export default styles;
