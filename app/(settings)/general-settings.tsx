import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { Notifications } from "@/api/notifications";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/ThemeContext";

const THEME_STORAGE_KEY = "@app_theme";

const GeneralSettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme === "dark");

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();
    setNotificationsEnabled(authStatus === messaging.AuthorizationStatus.AUTHORIZED);
  };

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const permissionGranted = await Notifications.requestUserPermission();
      if (permissionGranted) {
        setNotificationsEnabled(true);
      }
    }
  };

  const handleThemeToggle = async (value: boolean) => {
    setDarkModeEnabled(value);
    toggleTheme();
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  const SettingItem = ({
    title,
    value,
    onValueChange,
  }: {
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#22C55E" }}
        thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
      />
    </ThemedView>
  );

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <ScrollView style={styles.container}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />
        <PageHeader subtitle="General Settings" />
        <BackButton />
        <View style={styles.content}>
          <SettingItem title="Enable Notifications" value={notificationsEnabled} onValueChange={toggleNotifications} />
          <SettingItem title="Dark Mode" value={darkModeEnabled} onValueChange={handleThemeToggle} />
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#22C55E",
    borderRadius: 150,
  },
  topLeftCircle: {
    top: 150,
    left: -150,
  },
  bottomRightCircle: {
    top: 500,
    left: 300,
  },
  card: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default GeneralSettingsScreen;

/*
  Log in to the Firebase Console (https://console.firebase.google.com/).
  Select your project.
  In the left sidebar, click on "Cloud Messaging" (you might need to expand "Engage" first).
  Click on the "New Campaign" button.
  Choose "Firebase Notification messages" as the message type.
  Fill out the notification details (title, text, etc.) as you normally would.
  Scroll down to the "Additional options" section and expand it.
  Look for the "Custom data" field. This is where you'll add your type.
  In the Custom data field, you'll need to use a key-value pair format. For the type, you could use something like this:
  Key: type
  Value: new_message (or promotional, app_update, etc.)
  You can add multiple key-value pairs if needed, each on a new line.
*/
