import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

export default StyleSheet.create({
    productCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    productImageContainer: {
        position: 'relative',
        height: 150,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.gray2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stockBadge: {
        position: 'absolute',
        top: SIZES.small,
        right: SIZES.small,
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.small,
        paddingVertical: 4,
        borderRadius: SIZES.small,
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    stockText: {
        fontSize: SIZES.small,
        fontFamily: 'semibold',
    },
    productInfo: {
        padding: SIZES.medium,
        flex: 1,
    },
    productName: {
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    productCategory: {
        fontSize: SIZES.small,
        fontFamily: 'regular',
        color: COLORS.gray,
        marginBottom: 6,
    },
    productPrice: {
        fontSize: SIZES.large,
        fontFamily: 'bold',
        color: COLORS.secondary,
        marginBottom: SIZES.small,
    },
    productStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: SIZES.small,
        fontFamily: 'medium',
        color: COLORS.gray,
    },
    productDate: {
        fontSize: SIZES.small,
        fontFamily: 'regular',
        color: COLORS.gray,
    },
    productActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.gray2,
    },
    actionButton: {
        flex: 1,
        paddingVertical: SIZES.medium,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: SIZES.medium,
    },
    deleteButton: {
        backgroundColor: COLORS.error,
        borderBottomRightRadius: SIZES.medium,
        borderLeftWidth: 1,
        borderLeftColor: COLORS.white,
    },
})
