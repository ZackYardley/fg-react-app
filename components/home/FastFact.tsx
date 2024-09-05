import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getRandomFact } from "@/constants/facts";

const FastFact = () => {
  const [fact, setFact] = useState<string>(getRandomFact());
  const handleNewFact = () => {
    setFact(getRandomFact());
  };

  return (
    <View style={styles.fastFact}>
      <Text style={styles.fastFactTitle}>Forevergreen Fast Fact of the Day</Text>
      <Text style={styles.fastFactText}>{fact}</Text>
      <TouchableOpacity
        style={styles.factButton}
        onPress={handleNewFact} // Call the function directly
      >
        <Text style={styles.offsetButtonText}>See New Fact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FastFact;

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
  factButton: {
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#409858",
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
