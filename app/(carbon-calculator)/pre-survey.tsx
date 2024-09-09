import { PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GreenButton } from "@/components/auth";
import { useThemeColor } from "@/hooks";

const PreSurveyScreen = () => {
  const { fromIndex } = useLocalSearchParams<{ fromIndex: string }>();
  const primaryColor = useThemeColor({}, "primary");

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <View style={[styles.circleBottom, { backgroundColor: primaryColor }]} />
      <View style={[styles.circleTop, { backgroundColor: primaryColor }]} />
      <ScrollView style={{ marginHorizontal: 20 }}>
        <PageHeader />

        <ThemedView style={styles.contentContainer}>
          <ThemedText type="title" style={styles.contentTitle}>
            Welcome!
          </ThemedText>
          {fromIndex ? (
            <ThemedText style={styles.contentText}>
              It looks like it's been a while since we last checked your emissions. Let's start with a few questions to
              update your carbon footprint calculation.
            </ThemedText>
          ) : (
            <ThemedText style={styles.contentText}>
              Before we begin, we'll ask you a few quick questions about your transportation, diet, and energy use to
              help calculate your carbon footprint. Completing this survey will give you personalized tips to reduce
              your impact on the environment.
            </ThemedText>
          )}

          <GreenButton title="Begin Survey" onPress={() => router.navigate("/transportation")} style={styles.button} />
        </ThemedView>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default PreSurveyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 9999,
    bottom: "-12%",
    left: "-30%",
  },
  circleTop: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 9999,
    top: "16%",
    right: "-30%",
  },
  contentContainer: {
    padding: 16,
    borderRadius: 24,
    display: "flex",
    top: "20%",
  },
  contentTitle: {
    fontSize: 36,
    marginTop: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 16,
  },
  button: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});
