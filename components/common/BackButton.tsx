import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Href, router } from "expo-router";
import { useThemeColor } from "@/hooks";

const BackButton = ({ link }: { link?: Href<string> }) => {
  const textColor = useThemeColor({}, "text");
  const navigate = () => {
    if (link) {
      router.replace(link);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <Pressable style={styles.container} onPress={() => navigate()} hitSlop={24}>
      <Icon name="chevron-left" size={36} color={textColor} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
