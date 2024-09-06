import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EmissionsSummary = ({
  totalEmissions,
  monthlyEmissions,
  totalOffset,
  netImpact,
}: {
  totalEmissions: number;
  monthlyEmissions: number;
  totalOffset: number;
  netImpact: number;
}) => {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  const error = useThemeColor({}, "error");
  const onPrimary = useThemeColor({}, "onPrimary");

  const isPositiveImpact = netImpact <= 0;

  return (
    <ThemedView style={styles.container}>
      {/* Annual Footprint */}
      <View style={[styles.card]}>
        <MaterialCommunityIcons name="earth" size={40} color={primary} style={styles.icon} />
        <ThemedText style={styles.cardTitle}>Annual Footprint</ThemedText>
        <ThemedText style={styles.emissionsStat}>{totalEmissions.toFixed(1)}</ThemedText>
        <ThemedText style={styles.emissionsLabel}>tons of CO2/year</ThemedText>
      </View>

      {/* Monthly Stats */}
      <View style={styles.monthlyStatsContainer}>
        {/* Monthly Carbon Emissions */}
        <View style={[styles.monthlyCard]}>
          <MaterialCommunityIcons name="smoke" size={30} color={primary} style={styles.icon} />
          <ThemedText style={styles.monthlyCardTitle}>Monthly Emissions</ThemedText>
          <ThemedText style={styles.monthlyEmissionsStat}>{monthlyEmissions.toFixed(1)}</ThemedText>
          <ThemedText style={styles.monthlyEmissionsLabel}>tons CO2/month</ThemedText>
        </View>

        {/* Monthly Carbon Offsets */}
        <View style={[styles.monthlyCard]}>
          <MaterialCommunityIcons name="leaf" size={30} color={primary} style={styles.icon} />
          <ThemedText style={styles.monthlyCardTitle}>Monthly Offsets</ThemedText>
          <ThemedText style={styles.monthlyEmissionsStat}>{totalOffset.toFixed(1)}</ThemedText>
          <ThemedText style={styles.monthlyEmissionsLabel}>tons CO2/month</ThemedText>
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: textColor }]} />

      {/* Net Impact */}
      <View style={[styles.card, isPositiveImpact ? { backgroundColor: primary } : { backgroundColor: error }]}>
        <MaterialCommunityIcons
          name={isPositiveImpact ? "check-circle" : "alert-circle"}
          size={40}
          color={onPrimary}
          style={styles.icon}
        />
        <ThemedText style={[styles.cardTitle, { color: onPrimary }]}>Net Impact this month</ThemedText>
        <ThemedText style={[styles.emissionsStat, { color: onPrimary }]}>{Math.abs(netImpact).toFixed(1)}</ThemedText>
        <ThemedText style={[styles.emissionsLabel, { color: onPrimary }]}>tons of CO2</ThemedText>
        <ThemedText style={[styles.statusText, { color: onPrimary }]}>
          {isPositiveImpact ? "You are Net-Zero! 😊" : "Not Net-Zero yet 😥"}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emissionsStat: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  emissionsLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  monthlyStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthlyCard: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  monthlyCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  monthlyEmissionsStat: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  monthlyEmissionsLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  separator: {
    height: 1,
    marginVertical: 16,
    width: "100%",
    opacity: 0.2,
  },
  positiveImpact: {
    backgroundColor: "#E8F5E9",
  },
  negativeImpact: {
    backgroundColor: "#FFEBEE",
  },
  positiveText: {
    color: "#4CAF50",
  },
  negativeText: {
    color: "#F44336",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  icon: {
    marginBottom: 10,
  },
});

export default EmissionsSummary;
