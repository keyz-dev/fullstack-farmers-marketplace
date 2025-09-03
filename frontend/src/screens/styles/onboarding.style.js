import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
  footer: {
    height: SIZES.height * 0.25,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    height: 4,
    width: 10,
    backgroundColor: COLORS.placeholder,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.successBg,
    borderRadius: 5,
    color: COLORS.white,
  },
  btnText: {
    fontFamily: "bold",
    fontSize: 15,
    color: COLORS.primary,
  },
});

export default styles;
