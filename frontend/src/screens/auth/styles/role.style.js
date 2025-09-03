import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
        justifyContent: "center",
    },
    container: {
        marginHorizontal: 16,
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontFamily: "bold",
        fontSize: 22,
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: "regular",
        fontSize: 14,
        color: COLORS.placeholder,
        textAlign: "center",
        lineHeight: 20,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12, // Provides space between the cards
        marginBottom: 50,
    },
    footer: {
        alignItems: "center",
    },
    button: {
        width: "100%",
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: "center",
        marginBottom: 24,
    },
    buttonDisabled: {
        backgroundColor: COLORS.gray2,
    },
    buttonText: {
        fontFamily: "bold",
        color: "white",
        fontSize: 16,
    },
    dotsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        backgroundColor: COLORS.primary,
    },
    dotInactive: {
        backgroundColor: COLORS.gray2,
    },
});

export default styles;
