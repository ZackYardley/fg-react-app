import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import ThemedSafeAreaView from "./ThemedSafeAreaView";
import ThemedText from "./ThemedText";

const Loading = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1);
    }, 500); // Change dots every 500ms

    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ThemedText type="title" style={styles.loadingText}>Loading{dots}</ThemedText>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  testing: {},
});

export default Loading;
