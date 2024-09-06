import React, { useRef, useCallback } from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import { useThemeColor } from "@/hooks";
import { darkenColor } from "@/utils";

const GreenButton = ({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");

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
          { backgroundColor: primaryColor },
          style,
          pressed && { backgroundColor: darkenColor(primaryColor) },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default GreenButton;
