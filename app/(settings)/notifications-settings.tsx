import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from '../../api/notifications';

const NotificationSettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

  const SettingItem = ({ title, value, onValueChange }: { title: string, value: boolean, onValueChange: (value: boolean) => void }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#409858" }}
        thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />

        <View style={styles.header}>
          <Text style={styles.titleText}>
            Forever<Text style={styles.greenText}>green</Text>
          </Text>
          <Text style={styles.subtitleText}>Notification Settings</Text>
        </View>

        <SettingItem
          title="Enable Notifications"
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 24,
  },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
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
  header: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  greenText: {
    color: "#409858",
  },
  subtitleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#eeeeee",
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default NotificationSettingsScreen;

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