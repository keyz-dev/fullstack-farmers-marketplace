import { StyleSheet } from "react-native";
import { COLORS, SIZES } from '../../../constants'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: SIZES.xLarge,
        paddingHorizontal: SIZES.small / 2
    },
    separator: {
        height: SIZES.medium,
    },
    // Empty state styles
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "bold", // or whatever bold font you're using
        color: "#666",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: "regular", // or whatever regular font you're using
        color: "#999",
        textAlign: "center",
        lineHeight: 20,
    },
})

export default styles