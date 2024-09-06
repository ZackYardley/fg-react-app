import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks";
import { ThemedText, ThemedView } from "../common";

const Tips = ({ highestEmissionGroup }: { highestEmissionGroup: string }) => {
  const negative = useThemeColor({}, "error");
  return (
    <ThemedView style={styles.fastFact}>
      <ThemedText style={styles.fastFactTitle}>Top 3 Ways to Reduce your Emissions</ThemedText>
      <ThemedText style={[styles.highestEmissionsText, { color: negative }]}>
        Your highest emissions source: {highestEmissionGroup}
      </ThemedText>
      <ThemedText style={styles.fastFactText}>Turn off your lights!</ThemedText>
      <ThemedText style={styles.fastFactText}>Carpool to work!</ThemedText>
      <ThemedText style={styles.fastFactText}>Try meatless Monday!</ThemedText>
    </ThemedView>
  );
};

export default Tips;

const styles = StyleSheet.create({
  fastFact: {
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
    textAlign: "center",
    marginBottom: 16,
  },
});
