import { View, Text, StatusBar, Image, ScrollView, Platform } from "react-native";
import { Link, router } from "expo-router";
import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import { TreeLogo } from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import { GreenButton } from "@/components/auth";

export default function GetStartedScreen() {
  const appUrl = "com.fgdevteam.fgreactapp://";
  const appStoreUrl = "https://apps.apple.com/app/your-app-id"; // Replace with your actual App Store URL
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.fgdevteam.fgreactapp"; // Replace with your actual Play Store URL

  const handleOpenApp = () => {
    if (Platform.OS === "web") {
      window.location.href = appUrl;
    } else {
      Linking.openURL(appUrl);
    }
  };

  if (Platform.OS === "web") {
    return (
      <ScrollView style={styles.webContainer}>
        <Text style={styles.webTitle}>
          Forever<Text style={{ color: "#409858" }}>green</Text>
        </Text>
        <Text style={styles.webMessage}>Open our app to continue or download it if you haven't installed it yet.</Text>
        <View style={styles.webButtonContainer}>
          <GreenButton
            title="Open App"
            onPress={handleOpenApp}
            style={styles.webButton}
            textStyle={styles.webButtonText}
          />
          <Text style={styles.orText}>or</Text>
          <Text style={styles.downloadText}>Download from:</Text>
          <View style={styles.storeButtonsContainer}>
            <GreenButton
              title="App Store"
              onPress={() => Linking.openURL(appStoreUrl)}
              style={styles.storeButton}
              textStyle={styles.storeButtonText}
            />
            <GreenButton
              title="Google Play"
              onPress={() => Linking.openURL(playStoreUrl)}
              style={styles.storeButton}
              textStyle={styles.storeButtonText}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Forever<Text style={styles.titleHighlight}>green</Text>
          </Text>
          <Image style={styles.logo} source={TreeLogo} />
        </View>
        <View style={styles.buttonContainer}>
          <GreenButton
            title="Get Started"
            onPress={() => router.push("/signup")}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already helping our planet? </Text>
            <Link href={"/login"}>
              <Text style={styles.loginLinkText}>Log in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  titleHighlight: {
    color: "#409858",
  },
  logo: {
    width: 768,
    height: 384,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: "#409858",
    borderRadius: 9999,
    padding: 24,
    paddingHorizontal: 48,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  loginContainer: {
    marginVertical: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "800",
  },
  loginLinkText: {
    fontWeight: "800",
    textDecorationLine: "underline",
    fontSize: 20,
  },
  webContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  webTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  webMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  webButtonContainer: {
    alignItems: "center",
  },
  webButton: {
    backgroundColor: "#409858",
    borderRadius: 9999,
    padding: 16,
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  webButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
  },
  downloadText: {
    fontSize: 16,
    marginBottom: 10,
  },
  storeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  storeButton: {
    backgroundColor: "#409858",
    borderRadius: 9999,
    padding: 12,
    paddingHorizontal: 24,
    marginHorizontal: 5,
  },
  storeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
