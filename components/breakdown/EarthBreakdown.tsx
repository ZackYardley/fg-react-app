import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { Earth } from "@/constants/Images";
import { TARGET_EMISSIONS } from "@/constants";
import { ThemedText } from "../common";

const EarthBreakdown = ({ emissions }: { emissions: number }) => {
  const earthsRequired = parseFloat((emissions / TARGET_EMISSIONS).toFixed(2));
  const wholeEarths = Math.floor(Math.max(0, earthsRequired));
  const partialEarth = parseFloat((Math.max(0, earthsRequired) - wholeEarths).toFixed(2));

  const renderEarths = () => {
    if (emissions <= 0) {
      return (
        <View style={styles.specialCaseContainer}>
          <Image source={Earth} style={styles.earthImage} />
          <ThemedText style={styles.specialCaseText}>
            {emissions === 0 ? "Your emissions are neutral!" : "Great job! You're having a net positive impact."}
          </ThemedText>
        </View>
      );
    }

    const earthImages = [];
    const maxEarths = 11;
    const earthsToRender = Math.min(wholeEarths, maxEarths);

    for (let i = 0; i < earthsToRender; i++) {
      earthImages.push(<Image key={`whole-${i}`} source={Earth} style={styles.earthImage} />);
    }

    if (partialEarth > 0 && earthsToRender < maxEarths) {
      earthImages.push(
        <View key="partial" style={[styles.partialEarthContainer, { width: 64 * partialEarth }]}>
          <Image source={Earth} style={styles.earthImage} />
        </View>
      );
    }

    // Create rows of images
    const rows = [];
    const itemsPerRow = 4;
    for (let i = 0; i < earthImages.length; i += itemsPerRow) {
      const rowItems = earthImages.slice(i, i + itemsPerRow);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems}
        </View>
      );
    }

    return (
      <View>
        <ThemedText style={styles.impactText}>If everyone lived like you, we would need:</ThemedText>
        {rows}
        <ThemedText style={styles.earthsRequiredText}>{earthsRequired.toFixed(2)} Earths</ThemedText>
        {wholeEarths > maxEarths && (
          <ThemedText style={styles.additionalEarthsText}>({wholeEarths - maxEarths} more Earths not shown)</ThemedText>
        )}
      </View>
    );
  };

  return <View style={styles.container}>{renderEarths()}</View>;
};

export default EarthBreakdown;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  earthImage: {
    height: 64,
    width: 64,
    marginRight: 8,
  },
  partialEarthContainer: {
    overflow: "hidden",
    height: 64,
    marginRight: 8,
  },
  specialCaseContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  specialCaseText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  impactText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  earthsRequiredText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  additionalEarthsText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
    textAlign: "center",
  },
});
