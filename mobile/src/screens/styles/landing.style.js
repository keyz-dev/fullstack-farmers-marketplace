import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topContainer: {
        flex: 0.6,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    topIconContainer: {
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    bottomContainer: {
        flex: 0.4,
        gap: 30,
        paddingHorizontal: 24,
        paddingBottom: 80,
    },
    content: {
        alignItems: 'left',
        marginTop: -50,
    },
    logo: {
        objectFit: 'contain',
        width: 150,
        height: 100,
    },
    title: {
        fontSize: SIZES.medium,
        fontFamily: 'medium',
        color: COLORS.gray,
    },
    buttonContainer: {
        width: '100%',
    },
    skipButton: {
        marginTop: 16,
    },
    skipText: {
        textAlign: 'center',
        color: COLORS.placeholder,
        fontSize: 14,
        fontFamily: 'regular',
    },
});
export default styles;
