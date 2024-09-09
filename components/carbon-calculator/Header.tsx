import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks";
import { ThemedText } from "../common";

const Header = ({ progress, title }: any) => {
  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  return (
    <>
      <View style={styles.container}>
        <Icon name="arrow-left" size={24} color={textColor} onPress={() => router.back()} style={styles.backButton} />
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            color={primaryColor}
            unfilledColor="#FFF"
            borderColor={border}
            borderWidth={1.5}
            height={15}
            borderRadius={9999}
          />
        </View>
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  backButton: {
    marginRight: 24,
  },
  progressBarContainer: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    marginTop: 12,
    marginBottom: 12,
  },
});
