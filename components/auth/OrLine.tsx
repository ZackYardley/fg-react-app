import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks";

const OrLine = () => {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.orContainer}>
      <View style={[styles.orLine, { backgroundColor: textColor }]} />
      <Text style={[styles.orText, { color: textColor }]}>Or</Text>
      <View style={[styles.orLine, { backgroundColor: textColor }]} />
    </View>
  );
};

export default OrLine;

const styles = StyleSheet.create({
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    paddingHorizontal: 16,
    fontWeight: "bold",
    fontSize: 20,
  },
});
