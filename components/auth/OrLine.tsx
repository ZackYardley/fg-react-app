import { View, Text, StyleSheet } from "react-native";

const OrLine = () => {
  return (
    <View style={styles.orContainer}>
      <View style={styles.orLine} />
      <Text style={styles.orText}>Or</Text>
      <View style={styles.orLine} />
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
    backgroundColor: "black",
  },
  orText: {
    paddingHorizontal: 16,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});
