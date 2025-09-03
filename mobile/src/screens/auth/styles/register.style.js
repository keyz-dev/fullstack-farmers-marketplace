import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../constants';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.lightWhite,
    },
    image: {
        height: SIZES.height / 3,
        width: SIZES.width - 60,
        resizeMode: 'contain',
        marginBottom: SIZES.xxLarge,
    },
    title: {
        fontFamily: 'bold',
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
        alignSelf: 'center',
        marginBottom: SIZES.medium,
        marginTop: SIZES.xxLarge,
    },
    linkText: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: SIZES.small,
    },
    useLocationButton: {
        // position: 'absolute',
        // bottom: -20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e7ff',
        paddingVertical: 12,
        borderBottomLeftRadius: SIZES.small,
        borderBottomRightRadius: SIZES.small,
        gap: 8,
        transformOrigin: 'top'
    },
    useLocationText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: SIZES.medium,
    },
});

export default styles;