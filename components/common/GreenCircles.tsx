import { useThemeColor } from "@/hooks";
import { View, StyleSheet } from "react-native";

const GreenCircles = () => {
  const primary = useThemeColor({}, "primary");

  return (
    <>
      <View style={[styles.greenCircleLarge, { backgroundColor: primary }]} />
      <View style={[styles.greenCircleSmall, { backgroundColor: primary }]} />
    </>
  );
};

const styles = StyleSheet.create({
  greenCircleLarge: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: "0%",
    right: "-45%",
  },
  greenCircleSmall: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 9999,
    top: "25%",
    left: "-25%",
  },
});

export default GreenCircles;
