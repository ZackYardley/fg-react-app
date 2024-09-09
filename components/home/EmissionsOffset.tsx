import { View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemedText, ThemedView } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { GreenButton } from "../auth";

const EmissionsOffset = ({
  monthlyEmissions,
  totalOffset,
  isNetZero,
  displayNetZeroMonths,
  netZeroMonths,
}: {
  monthlyEmissions: number;
  totalOffset: number;
  isNetZero: boolean;
  displayNetZeroMonths: string;
  netZeroMonths?: number;
}) => {
  const positive = useThemeColor({}, "primary");
  const negative = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");

  return (
    <ThemedView style={styles.carbonFootprint}>
      <ThemedText style={styles.carbonFootprintTitle}>Your Carbon Footprint</ThemedText>
      <View style={styles.carbonFootprintContent}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Emissions</ThemedText>
          <ThemedText style={[styles.emissionText, { color: positive }]}>
            {monthlyEmissions.toFixed(2)}
            <ThemedText style={styles.emissionUnit}> tons of CO₂</ThemedText>
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Offsets</ThemedText>
          <ThemedText style={[styles.offsetText, { color: negative }]}>
            {totalOffset.toFixed(2)}
            <ThemedText style={styles.emissionUnit}> tons of CO₂</ThemedText>
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.netZeroText}>
        {isNetZero
          ? `You are net-zero! You've been net-zero for ${displayNetZeroMonths} month${netZeroMonths !== 1 ? "s" : ""}! 😊`
          : "You are not net-zero this month! 😔"}
      </ThemedText>

      <GreenButton
        onPress={() => router.navigate("/offset-now")}
        title="Offset Now!"
        style={styles.offsetButton}
        textStyle={styles.offsetButtonText}
      />
    </ThemedView>
  );
};

export default EmissionsOffset;

const styles = StyleSheet.create({
  carbonFootprint: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
  },
  carbonFootprintTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "700",
  },
  carbonFootprintContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emissionText: {
    fontSize: 24,
    fontWeight: "700",
  },
  emissionUnit: {
    fontSize: 16,
    fontWeight: "600",
  },
  offsetText: {
    fontSize: 24,
    fontWeight: "700",
  },
  netZeroText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  offsetButton: {
    marginTop: 16,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offsetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
