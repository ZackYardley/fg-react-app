import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider, TextInput as RNPTextInput } from "react-native-paper";
import { Linking, Platform, Text, TextInput } from "react-native";
import { StripeProvider, useStripe } from "@/utils/stripe";
import { initializeFirebase } from "@/utils/firebaseConfig";
import { Notifications } from "../api/notifications"; // Import the new module
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {
  initializeFirebase();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Disable font scaling
  //@ts-ignore
  Text.defaultProps = { allowFontScaling: false };
  RNPTextInput.defaultProps = { allowFontScaling: false };
  //@ts-ignore
  TextInput.defaultProps = { allowFontScaling: false };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    GoogleSignin.configure({
      webClientId: "489135632905-iu340mh7lub0iis2q18upvus42fa2roo.apps.googleusercontent.com",
    });

    let unsubscribe;
    if (Platform.OS === "android" || Platform.OS === "ios") {
      Notifications.setupMessaging();
      unsubscribe = Notifications.initializeNotifications();
    }
    return unsubscribe;
  }, [loaded]);

  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was not a Stripe URL - you can return or add extra handling here as you see fit
          // For example, you could use the URL to navigate to a specific screen in your app
          // router.push(url);
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl || "");
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener("url", (event: { url: string }) => {
      handleDeepLink(event.url);
    });

    return () => {
      deepLinkListener.remove();
    };
  }, [handleDeepLink]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <StripeProvider
        publishableKey="pk_test_51Pch2uJNQHxtxrkGVjNCflMy3L4mKNxA76N3W7vyowpCgVtKsisTowCdORHOZjBYsPYhuukodKiGF6FBRpj6FJPD00H3lUT9fK"
        merchantIdentifier="merchant.com.fgdevteam.fgreactapp"
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="index" />
        </Stack>
      </StripeProvider>
    </PaperProvider>
  );
}
