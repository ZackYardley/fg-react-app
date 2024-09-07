import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getRandomFact } from "@/constants/facts";
import { ThemedText, ThemedView } from "../common";

const FastFact = () => {
  const [fact, setFact] = useState<string>(getRandomFact());
  const handleNewFact = () => {
    setFact(getRandomFact());
  };

  return (
    <ThemedView style={styles.fastFact}>
      <ThemedText style={styles.fastFactTitle}>Forevergreen Fast Fact of the Day</ThemedText>
      <ThemedText style={styles.fastFactText}>{fact}</ThemedText>
      <TouchableOpacity
        style={styles.factButton}
        onPress={handleNewFact} // Call the function directly
      >
        <ThemedText style={styles.offsetButtonText}>See New Fact</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default FastFact;

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
  factButton: {
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#22C55E",
    borderRadius: 50,
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
  },
  offsetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
