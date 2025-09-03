import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
    },
    progressStep: {
        flexDirection: "row",
        alignItems: "center",
    },
    progressCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    activeStep: {
        backgroundColor: COLORS.primary,
    },
    inactiveStep: {
        backgroundColor: COLORS.lightGray,
    },
    progressText: {
        fontSize: 14,
        fontFamily: 'bold',
    },
    activeText: {
        color: COLORS.white,
    },
    inactiveText: {
        color: COLORS.gray,
    },
    progressLine: {
        width: 30,
        height: 2,
        marginHorizontal: 5,
    },
    activeLine: {
        backgroundColor: COLORS.primary,
    },
    inactiveLine: {
        backgroundColor: COLORS.lightGray,
    },
    stepContainer: {
        marginTop: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
        textAlign: "center",
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
    },
    dateText: {
        color: COLORS.gray,
        fontSize: 16,
    },
    inputWrapper: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
        marginBottom: 8,
    },
    textArea: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 5,
        fontSize: 16,
        color: COLORS.dark,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    sliderLabel: {
        fontSize: 14,
        color: COLORS.gray,
    },
    mapContainer: {
        height: 200,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 10,
    },
    map: {
        flex: 1,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    termsText: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.gray,
        marginLeft: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previousButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
    },
    previousButtonText: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.dark,
    },
    nextButton: {
        flex: 1,
        marginLeft: 10,
    },
    useLocationButton: {
        // position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e7ff', // A light blue/purple
        paddingVertical: 12,
        borderBottomLeftRadius: SIZES.small, // Match your Input's border radius
        borderBottomRightRadius: SIZES.small,
        gap: 8,
    },
    useLocationText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: SIZES.medium,
    },
    mapWrapper: {
        marginTop: 20,
    },
    mapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    recenterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 8,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    recenterText: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    map: {
        width: '100%',
        height: 250,
        borderRadius: SIZES.small,
    },
});

export default styles;