import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  cartList: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.medium,
    paddingBottom: 220, // Space for the checkout bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.large,
  },
  emptyText: {
    fontFamily: "bold",
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
  },
  emptySubtext: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.small,
    textAlign: "center",
  },
  checkoutSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderTopLeftRadius: SIZES.large,
    borderTopRightRadius: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  discountInput: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginRight: SIZES.small,
    fontFamily: "regular",
  },
  discountButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.small + 2,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    marginBottom: SIZES.medium,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.xSmall,
  },
  summaryLabel: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  summaryValue: {
    fontFamily: "semibold",
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.small,
    borderTopWidth: 1,
    borderColor: COLORS.gray2,
    paddingTop: SIZES.small,
  },
  totalLabel: {
    fontFamily: "bold",
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  totalAmount: {
    fontFamily: "bold",
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  checkoutButtonDisabled: {
    backgroundColor: COLORS.gray2,
  },
  checkoutButtonText: {
    fontFamily: "bold",
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default styles;