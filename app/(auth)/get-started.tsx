import { useState, useEffect } from "react";
import { View, Text, StatusBar, Image, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import { AppStore, GooglePlay, TreeLogo } from "@/constants/Images";
import { GreenButton } from "@/components/auth";
import { APP_STORE_URL, APP_URL, PLAY_STORE_URL } from "@/constants";
import { ThemedSafeAreaView, ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";

export default function GetStartedScreen() {
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const [error, setError] = useState<string | null>(null);

  const handleOpenApp = () => {
    if (Platform.OS === "web") {
      window.location.href = APP_URL;
      if (!(window.location.href === APP_URL)) {
        setError(
          "Looks like you don't have the app installed or your platform does not support it. Download it from the App Store or Google Play Store today!"
        );
      }
    } else {
      Linking.openURL(APP_URL);
    }
  };

  useEffect(() => {
    if (Platform.OS === "web" && window.location.href !== APP_URL) {
      window.location.href = APP_URL;
    }
  }, []);

  if (Platform.OS === "web") {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webContent}>
          <Text style={styles.webTitle}>
            Forever<Text style={{ color: primaryColor }}>green</Text>
          </Text>
          <View style={styles.centeredContent}>
            <Text style={styles.description}>
              Forevergreen is your all-in-one tool for understanding and managing your carbon footprint. Designed for
              eco-conscious individuals, our app provides everything you need to take control of your environmental
              impact.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featuresTitle}>Key Features</Text>
              <Text style={styles.feature}>• Carbon Footprint Calculator</Text>
              <Text style={styles.feature}>• Track Your Progress</Text>
              <Text style={styles.feature}>• Offset Your Emissions</Text>
              <Text style={styles.feature}>• Personalized Insights</Text>
              <Text style={styles.feature}>• Join a Community</Text>
            </View>
            <GreenButton
              title="Open App"
              onPress={handleOpenApp}
              style={styles.webButton}
              textStyle={styles.webButtonText}
            />
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.orText}>or</Text>
            <View style={styles.storeButtonsContainer}>
              <TouchableOpacity onPress={() => Linking.openURL(APP_STORE_URL)}>
                <Image source={AppStore} style={styles.storeButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(PLAY_STORE_URL)}>
                <Image source={GooglePlay} style={styles.storeButton} />
              </TouchableOpacity>
            </View>
            <Text style={styles.callToAction}>
              Download Forevergreen today and take the first step towards a greener future!
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ThemedSafeAreaView style={[styles.container]}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>
            Forever<Text style={{ color: primaryColor }}>green</Text>
          </ThemedText>
          <Image style={styles.logo} source={TreeLogo} tintColor={primaryColor} />
        </View>
        <View style={styles.buttonContainer}>
          <GreenButton
            title="Get Started"
            onPress={() => router.navigate("/signup")}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already helping our planet? </ThemedText>
            <Link href={"/login"}>
              <ThemedText type="link" style={styles.loginLinkText}>
                Log in
              </ThemedText>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    borderRadius: 9999,
    padding: 24,
    paddingHorizontal: 48,
  },
  buttonText: {
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
    fontWeight: "bold",
    textAlign: "center",
  },
  loginLinkText: {
    fontWeight: "800",
    textDecorationLine: "underline",
    fontSize: 20,
  },
  webContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#f0f4f0",
  },
  webContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  webTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  centeredContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 800,
    width: "100%",
    marginBottom: 100,
  },
  description: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 28,
  },
  featuresList: {
    alignSelf: "stretch",
    marginBottom: 20,
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#16A34A",
    textDecorationLine: "underline",
  },
  feature: {
    fontSize: 18,
    marginBottom: 5,
  },
  callToAction: {
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  webButton: {
    backgroundColor: "#16A34A",
    borderRadius: 50,
    paddingHorizontal: 40,
    borderWidth: 0,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  webButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  orText: {
    fontSize: 28,
    marginVertical: 20,
    fontWeight: "bold",
    color: "#666",
  },
  storeButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  storeButton: {
    width: 250,
    height: 70,
    marginHorizontal: 10,
    resizeMode: "contain",
  },
});
