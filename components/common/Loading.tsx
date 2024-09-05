import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.loadingText}>Loading{dots}</Text>
    </SafeAreaView>
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
    color: "#409858",
  },
  testing: {},
});

export default Loading;
