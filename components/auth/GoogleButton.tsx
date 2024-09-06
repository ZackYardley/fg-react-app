import React, { useRef, useCallback } from "react";
import { Pressable, Text, StyleSheet, Animated, Image, View } from "react-native";
import { GoogleLogo } from "@/constants/Images";
import { useThemeColor } from "@/hooks";
import { darkenColor } from "@/utils";

const GoogleButton = ({
  title = "Continue with Google",
  onPress,
  style,
  textStyle,
  noLogo,
}: {
  title?: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  noLogo?: boolean;
}) => {
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: backgroundColor, borderColor: textColor },
          style,
          pressed && { backgroundColor: darkenColor(backgroundColor) },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.contentContainer}>
          {!noLogo && <Image source={GoogleLogo} style={styles.googleIcon} />}
          <Text style={[styles.buttonText, { color: textColor }, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default GoogleButton;
