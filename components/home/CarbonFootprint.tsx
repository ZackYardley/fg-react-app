import { Link, router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CarbonFootprintSection = ({
  monthlyEmissions,
  totalOffset,
}: {
  monthlyEmissions: number;
  totalOffset: number;
}) => {
  const netImpact = monthlyEmissions - totalOffset;
  const isPositiveImpact = netImpact <= 0;

  const TextButton = ({ label, style }: { label: string; style: object }) => (
    <View style={[styles.textButton, style]}>
      <Text style={styles.textButtonLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.footprintContainer}>
      
      <TouchableOpacity onPress={() => router.navigate("/user-breakdown")} style={[styles.footprintBox, isPositiveImpact ? styles.positiveImpact : styles.negativeImpact]}>
        <Text style={styles.boxTitle}>Your Carbon Footprint</Text>
        <Text style={styles.footprintText}>
          {monthlyEmissions.toFixed(1)}
          <Text style={styles.footprintUnit}> Tons of CO2</Text>
        </Text>
        <Text style={styles.offsetTitle}>Your Carbon Offsets</Text>
        <Text style={styles.footprintText}>
          {totalOffset.toFixed(1)}
          <Text style={styles.footprintUnit}> Tons of CO2</Text>
        </Text>
        <Text style={styles.offsetTitle}>Net Impact</Text>
        <Text style={styles.footprintText}>
          {netImpact.toFixed(1)}
          <Text style={styles.footprintUnit}> Tons of CO2</Text>
        </Text>
          <Text style={styles.netZeroCheck}>
            {isPositiveImpact ? "Net-Zero ✅" : "Net-Zero ❌"}
          </Text>
        
      </TouchableOpacity>
      <TouchableOpacity style={styles.calculatorBox} onPress={() => router.push("/pre-survey")}>
        <Text style={styles.boxTitle}>Calculate your impact</Text>
        <View style={styles.calculator}>
          {/* Calculator buttons */}
          <>
            <View style={styles.calculatorRow}>
              <TextButton label="AC" style={styles.grayButton} />
              <TextButton label="+/-" style={[styles.grayButton, styles.marginLeft]} />
              <TextButton label="%" style={[styles.grayButton, styles.marginLeft]} />
              <TextButton label="/" style={[styles.greenButton, styles.marginLeft]} />
            </View>
            <View style={styles.calculatorRow}>
              <TextButton label="7" style={styles.darkButton} />
              <TextButton label="8" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="9" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="X" style={[styles.greenButton, styles.marginLeft]} />
            </View>
            <View style={styles.calculatorRow}>
              <TextButton label="4" style={styles.darkButton} />
              <TextButton label="5" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="6" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="-" style={[styles.greenButton, styles.marginLeft]} />
            </View>
            <View style={styles.calculatorRow}>
              <TextButton label="1" style={styles.darkButton} />
              <TextButton label="2" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="3" style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="+" style={[styles.greenButton, styles.marginLeft]} />
            </View>
            <View style={styles.calculatorRow}>
              <TextButton label="0" style={[styles.darkButton, styles.wideButton]} />
              <TextButton label="." style={[styles.darkButton, styles.marginLeft]} />
              <TextButton label="=" style={[styles.greenButton, styles.marginLeft]} />
            </View>
          </>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footprintContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  footprintBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    width: "47%",
    padding: 16,
  },
  calculatorBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    width: "47%",
    padding: 16,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  footprintText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  footprintUnit: {
    fontSize: 12,
    fontWeight: "normal",
  },
  offsetTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  calculator: {
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
  },
  calculatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  grayButton: {
    backgroundColor: "#a5a5a5",
    width: "22%",
  },
  darkButton: {
    backgroundColor: "#333333",
    width: "22%",
  },
  greenButton: {
    backgroundColor: "#409858",
    width: "22%",
  },
  wideButton: {
    width: "48%",
  },
  marginLeft: {
    marginLeft: "4%",
  },
  textButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  textButtonLabel: {
    color: "white",
    fontSize: 16,
  },
  positiveImpact: {
    backgroundColor: "#d4edda", // Light green for positive impact
  },
  negativeImpact: {
    backgroundColor: "#f8d7da", // Light red for negative impact
  },
  netZeroCheck: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CarbonFootprintSection;
