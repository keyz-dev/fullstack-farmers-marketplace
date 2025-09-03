import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from '../../../constants'

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        minHeight: screenHeight,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    image: {
        height: screenHeight * 0.4, // Reduced from 40% to 25% for better space management
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: SIZES.large,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        marginBottom: 30,
        color: COLORS.primary,
        textAlign: 'center'
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 300, // Ensure minimum height for form elements
    },
    wrapper: {
        marginBottom: 20
    },
    label: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "right"
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        height: 55,
        paddingHorizontal: SIZES.medium - 1,
        backgroundColor: COLORS.lightWhite,
    }),
    iconStyle: {
        marginRight: 10
    },
    errorMessage: {
        fontFamily: 'regular',
        fontSize: SIZES.xSmall,
        marginLeft: 10,
        color: COLORS.error,
        marginTop: 5
    },
    registerText: {
        color: COLORS.primary,
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20, // Add some spacing from the button
    },
});

export default styles