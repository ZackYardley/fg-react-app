import { View, Text, StatusBar, Image, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import { AppStore, GooglePlay, TreeLogo } from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import { GreenButton } from "@/components/auth";
import { APP_STORE_URL, APP_URL, PLAY_STORE_URL } from "@/constants";

export default function GetStartedScreen() {
  const handleOpenApp = () => {
    if (Platform.OS === "web") {
      window.location.href = APP_URL;
    } else {
      Linking.openURL(APP_URL);
    }
  };

  if (Platform.OS === "web") {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webContent}>
          <Text style={styles.webTitle}>
            Forever<Text style={styles.webTitleGreen}>green</Text>
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
    backgroundColor: "#f0f4f0",
  },
  webContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  webTitle: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  webTitleGreen: {
    color: "#409858",
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
    color: "#409858",
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
    backgroundColor: "#409858",
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
  orText: {
    fontSize: 28,
    marginVertical: 20,
    fontWeight: "bold",
    color: "#666",
  },
  storeButtonsContainer: {
    flexDirection: "row",
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
