import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

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
  netZeroMonths: number;
}) => {
  return (
    <View style={styles.carbonFootprint}>
      <Text style={styles.carbonFootprintTitle}>Your Carbon Footprint</Text>
      <View style={styles.carbonFootprintContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emissions</Text>
          <Text style={styles.emissionText}>
            {monthlyEmissions.toFixed(2)}
            <Text style={styles.emissionUnit}> tons of CO₂</Text>
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offsets</Text>
          <Text style={styles.offsetText}>
            {totalOffset.toFixed(2)}
            <Text style={styles.emissionUnit}> tons of CO₂</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.netZeroText}>
        {isNetZero
          ? `You are net-zero! You've been net-zero for ${displayNetZeroMonths} month${netZeroMonths !== 1 ? "s" : ""}! 😊`
          : "You are not net-zero this month! 😔"}
      </Text>

      <TouchableOpacity onPress={() => router.push("/offset-now")} style={styles.offsetButton}>
        <Text style={styles.offsetButtonText}>Offset Now!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmissionsOffset;

const styles = StyleSheet.create({
  carbonFootprint: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
    backgroundColor: "#eeeeee",
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
    color: "#b91c1c",
  },
  emissionUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  offsetText: {
    fontSize: 24,
    fontWeight: "700",
    color: "green",
  },
  netZeroText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  offsetButton: {
    marginTop: 10,
    backgroundColor: "#409858",
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  offsetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
