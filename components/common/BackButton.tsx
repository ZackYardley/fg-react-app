import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Href, router } from "expo-router";

const BackButton = ({ link }: { link?: Href<string> }) => {
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
      <Icon name="chevron-left" size={18} color="black" />
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingTop: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginLeft: 4,
  },
});
