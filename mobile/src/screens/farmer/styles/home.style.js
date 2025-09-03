import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

export default StyleSheet.create({
    container: {
        paddingTop: SIZES.xLarge,
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },

    // Header Styles
    header: {
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        marginBottom: SIZES.small,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray2,
    },
    welcomeText: {
        fontSize: SIZES.large,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.gray,
    },

    // Stats Section
    statsSection: {
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        marginBottom: SIZES.small,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontFamily: 'semibold',
        color: COLORS.primary,
        marginBottom: SIZES.medium,
    },
    statsGrid: {
        gap: SIZES.small,
    },

    // Products Section
    productsSection: {
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.medium,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightWhite,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    addButtonText: {
        marginLeft: 4,
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.primary,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.xxLarge,
        paddingVertical: SIZES.xxLarge * 2,
        backgroundColor: COLORS.white,
        margin: SIZES.medium,
        borderRadius: SIZES.medium,
    },
    emptyTitle: {
        fontSize: SIZES.xLarge,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginTop: SIZES.medium,
        marginBottom: SIZES.small,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SIZES.xLarge,
    },
    addProductButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.xLarge,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.medium,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    addProductButtonText: {
        marginLeft: SIZES.small,
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.white,
    },

    // Error and Loading States
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.xLarge,
    },
    errorText: {
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: SIZES.medium,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SIZES.xLarge,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.medium,
    },
    retryText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
    },

    // Utility
    separator: {
        height: SIZES.medium,
    },
});