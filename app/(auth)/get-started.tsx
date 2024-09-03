import { View, Text, StatusBar, Image, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import { TreeLogo } from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import { GreenButton } from "@/components/auth";

export default function GetStartedScreen() {
  const appUrl = "com.fgdevteam.fgreactapp://";
  const appStoreUrl = "https://apps.apple.com/app/6578432563";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.fgdevteam.fgreactapp";

  const handleOpenApp = () => {
    if (Platform.OS === "web") {
      window.location.href = appUrl;
    } else {
      Linking.openURL(appUrl);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webContent}>
          <Text style={styles.webTitle}>
            Forever<Text style={styles.webTitleGreen}>green</Text>
          </Text>
          <View style={styles.centeredContent}>
            <GreenButton
              title="Open App"
              onPress={handleOpenApp}
              style={styles.webButton}
              textStyle={styles.webButtonText}
            />
            <Text style={styles.orText}>or</Text>
            <View style={styles.storeButtonsContainer}>
              <TouchableOpacity onPress={() => Linking.openURL(appStoreUrl)}>
                <Image
                  source={require('../../assets/images/app-store.png')}
                  style={styles.storeButton}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(playStoreUrl)}>
                <Image
                  source={require('../../assets/images/google-play.png')}
                  style={styles.storeButton}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
    backgroundColor: "#f0f4f0", // Light green background
  },
  webContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    width: '100%',
    marginBottom: 100,
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