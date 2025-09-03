import { StyleSheet } from "react-native";
import { SIZES } from "../../constants";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: SIZES.large
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    headerIcon: {
        padding: 4,
    },
    cartBadge: {
        position: "absolute",
        right: -4,
        top: -4,
        backgroundColor: "#34d399",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingTop: 16,
        justifyContent: "center",
    },
    row: {
        justifyContent: "space-between",
    },
    cardContainer: {
        flex: 0.5, // Each card takes up 50% of the row's width
        padding: 8,
        alignItems: "center",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
    },
});

export default styles;