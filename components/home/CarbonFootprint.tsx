import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks";
import { ThemedText, ThemedView } from "../common";
import { useTheme } from "react-native-paper";

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
      <ThemedText style={styles.textButtonLabel}>{label}</ThemedText>
    </View>
  );

  const positive = useThemeColor({}, "primary");
  const negative = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");
  const onPrimary = useThemeColor({}, "onPrimary");

  return (
    <View style={styles.footprintContainer}>
      <TouchableOpacity
        onPress={() => router.navigate("/breakdown")}
        style={[styles.footprintBox, isPositiveImpact ? { backgroundColor: positive } : { backgroundColor: negative }]}
      >
        <ThemedText style={[styles.boxTitle, { color: onPrimary }]}>Your Monthly Emissions</ThemedText>
        <ThemedText style={[styles.footprintText, { color: onPrimary }]}>
          {monthlyEmissions.toFixed(1)}
          <ThemedText style={[styles.footprintUnit, { color: onPrimary }]}> Tons of CO2</ThemedText>
        </ThemedText>
        <ThemedText style={[styles.offsetTitle, { color: onPrimary }]}>Your Monthly Offsets</ThemedText>
        <ThemedText style={[styles.footprintText, { color: onPrimary }]}>
          {totalOffset.toFixed(1)}
          <ThemedText style={[styles.footprintUnit, { color: onPrimary }]}> Tons of CO2</ThemedText>
        </ThemedText>
        <ThemedText style={[styles.offsetTitle, { color: onPrimary }]}>Net Impact</ThemedText>
        <ThemedText style={[styles.footprintText, { color: onPrimary }]}>
          {netImpact.toFixed(1)}
          <ThemedText style={[styles.footprintUnit, { color: onPrimary }]}> Tons of CO2</ThemedText>
        </ThemedText>
        <ThemedText style={[styles.netZeroCheck, { color: onPrimary }]}>{isPositiveImpact ? "Net-Zero ✅" : "Net-Zero ❌"}</ThemedText>
      </TouchableOpacity>
      <ThemedView style={{ width: "47%", borderRadius: 16, alignContent: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={() => router.push("/pre-survey")} style={styles.calculatorBox}>
          <ThemedText style={styles.boxTitle}>Calculate your impact</ThemedText>
          <View style={styles.calculator}>
            {/* Calculator buttons */}
            <>
              <View style={styles.calculatorRow}>
                <TextButton label="AC" style={styles.grayButton} />
                <TextButton label="+/-" style={[styles.grayButton, styles.marginLeft]} />
                <TextButton label="%" style={[styles.grayButton, styles.marginLeft]} />
                <TextButton label="/" style={[styles.greenButton, { backgroundColor: primary }, styles.marginLeft]} />
              </View>
              <View style={styles.calculatorRow}>
                <TextButton label="7" style={styles.darkButton} />
                <TextButton label="8" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="9" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="X" style={[styles.greenButton, { backgroundColor: primary }, styles.marginLeft]} />
              </View>
              <View style={styles.calculatorRow}>
                <TextButton label="4" style={styles.darkButton} />
                <TextButton label="5" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="6" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="-" style={[styles.greenButton, { backgroundColor: primary }, styles.marginLeft]} />
              </View>
              <View style={styles.calculatorRow}>
                <TextButton label="1" style={styles.darkButton} />
                <TextButton label="2" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="3" style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="+" style={[styles.greenButton, { backgroundColor: primary }, styles.marginLeft]} />
              </View>
              <View style={styles.calculatorRow}>
                <TextButton label="0" style={[styles.darkButton, styles.wideButton]} />
                <TextButton label="." style={[styles.darkButton, styles.marginLeft]} />
                <TextButton label="=" style={[styles.greenButton, { backgroundColor: primary }, styles.marginLeft]} />
              </View>
            </>
          </View>
        </TouchableOpacity>
      </ThemedView>
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
    borderRadius: 16,
    width: "47%",
    padding: 16,
  },
  calculatorBox: {
    width: "100%",
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
  netZeroCheck: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CarbonFootprintSection;
