import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ThemedSafeAreaView, ThemedText } from "../common";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "@/hooks";

const CalculatingScreen = () => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = ["hourglass-start", "hourglass-half", "hourglass-end"];
  const primaryColor = useThemeColor({}, "primary");

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1000); // Change icon every 1 second

    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <View style={[styles.greenCircleLarge, { backgroundColor: primaryColor }]} />
      <View style={[styles.greenCircleSmall, { backgroundColor: primaryColor }]} />

      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>
          Forever<Text style={{ color: primaryColor }}>green</Text>
        </ThemedText>
      </View>

      <View style={styles.resultContainer}>
        <ThemedText style={styles.resultText}>Calculating your result</ThemedText>
        <View style={styles.iconContainer}>
          <Icon name={icons[iconIndex]} size={100} color={primaryColor} />
        </View>
      </View>
    </ThemedSafeAreaView>
  );
};

export default CalculatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  greenCircleLarge: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -8,
    right: "-25%",
  },
  greenCircleSmall: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -32,
    left: "-25%",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 128,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 8,
  },
  resultContainer: {
    marginTop: 160,
  },
  resultText: {
    fontSize: 24,
    marginTop: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconContainer: {
    marginTop: 24,
    alignSelf: "center",
  },
});
