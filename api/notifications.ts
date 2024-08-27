import { Alert, PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";

export const Notifications = {
  shouldShowNotification: async (notificationType: string | undefined) => {
    if (!notificationType) return true;
    const shouldShow = await AsyncStorage.getItem(`${notificationType}Notifications`);
    return shouldShow !== 'false';
  },

  requestUserPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }

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

  handleDataMessage: async (remoteMessage: any) => {
    console.log('Received data message:', JSON.stringify(remoteMessage, null, 2));
    
    if (remoteMessage.data) {
      const notificationType = remoteMessage.data.type;
      const show = await Notifications.shouldShowNotification(notificationType);

      if (show && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        PushNotification.localNotification({
          title: remoteMessage.data.title || "New Notification",
          message: remoteMessage.data.body || "You have a new notification",
          userInfo: remoteMessage.data, // Store the entire data payload
        });
      }
    }
  },

  initializeNotifications: () => {
    // Handle data messages in foreground
    messaging().onMessage(Notifications.handleDataMessage);

    // Handle data messages in background and when app is closed
    messaging().setBackgroundMessageHandler(Notifications.handleDataMessage);

    if (Platform.OS === 'ios' || Platform.OS === 'android'){
      PushNotification.configure({
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);
          // Handle notification tap here if needed
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });
    }


    // Check for initial notification that opened the app
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened by notification:', JSON.stringify(remoteMessage, null, 2));
          // Handle the initial notification if needed
        }
      });
  }
};