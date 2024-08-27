import { Alert, PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";

export const Notifications = {

  requestUserPermission: async (): Promise<boolean> => {
    // Android notification permissions
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    // IOS notification permissions
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  },

  setupMessaging: async () => {
    const permissionGranted = await Notifications.requestUserPermission();
    if (permissionGranted) {
      const token = await messaging().getToken();
      console.log("FCM Token:", token);
    } else {
      console.log("Notification permission not granted");
    }
  },

  handleNotification: async (remoteMessage: any) => {
    if (remoteMessage?.notification) {
      Alert.alert(
        remoteMessage.notification.title || "New Notification",
        remoteMessage.notification.body || "You have a new notification"
      );
    }
  },

  initializeNotifications: () => {
    // Foreground state messages
    const unsubscribe = messaging().onMessage(Notifications.handleNotification);

    // Check whether an initial notification is available
    messaging().getInitialNotification().then(Notifications.handleNotification);

    // Background state messages
    messaging().onNotificationOpenedApp(Notifications.handleNotification);

    // Register background handler
    messaging().setBackgroundMessageHandler(Notifications.handleNotification);

    return unsubscribe;
  }
};