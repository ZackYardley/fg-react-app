import React, { useRef, useCallback } from "react";
import { Pressable, Text, StyleSheet, Animated, Image, View } from "react-native";
import { GoogleLogo } from "@/constants/Images";

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
        style={({ pressed }) => [styles.button, style, pressed && styles.buttonPressed]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.contentContainer}>
          {!noLogo && <Image source={GoogleLogo} style={styles.googleIcon} />}
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 9999,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: "#f0f0f0",
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
