import React from "react";
import { View, Text, StatusBar, Image } from "react-native";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";
import { TreeLogo } from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import { GreenButton } from "@/components/common";

export default function GetStartedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
          <Link href={"/login"} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Log in</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 75,
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
  loginLink: {
    marginRight: 32,
  },
  loginLinkText: {
    fontWeight: "800",
    textDecorationLine: "underline",
    fontSize: 20,
  },
});
