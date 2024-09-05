import { View, Text, StyleSheet } from "react-native";

const Tips = ({ highestEmissionGroup }: { highestEmissionGroup: string }) => {
  return (
    <View style={styles.fastFact}>
      <Text style={styles.fastFactTitle}>Top 3 Ways to Reduce your Emissions</Text>
      <Text style={styles.highestEmissionsText}>Your highest emissions source: {highestEmissionGroup}</Text>
      <Text style={styles.fastFactText}>Turn off your lights!</Text>
      <Text style={styles.fastFactText}>Carpool to work!</Text>
      <Text style={styles.fastFactText}>Try meatless Monday!</Text>
    </View>
  );
};

export default Tips;

const styles = StyleSheet.create({
  fastFact: {
    backgroundColor: "#eeeeee",
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
  },
  fastFactTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  fastFactText: {
    fontSize: 18,
    textAlign: "center",
  },
  highestEmissionsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 16,
  },
});
