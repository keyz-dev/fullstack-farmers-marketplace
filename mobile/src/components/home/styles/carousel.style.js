import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    carousel: {
        width: screenWidth,
    },
    carouselItemContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    carouselImage: {
        borderRadius: 15,
        width: screenWidth * 0.93, // 93% of screen width
        height: 180, // Fixed height for consistency
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: COLORS.secondary,
    },
});

export default styles;