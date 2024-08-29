import { useState } from "react";
import { View, Text, Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import { handleResetPassword } from "@/api/auth";
import { TreeLogo } from "@/constants/Images";
import { GreenButton, CustomTextInput, GoogleButton, OrLine } from "@/components/auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <Text style={styles.header}>
            Reset <Text style={styles.headerHighlight}>Password</Text>
          </Text>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={TreeLogo} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={(text: string) => setEmail(text)}
                placeholder="Ex. abc@example.com"
                leftIcon="at"
              />
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                By clicking the "Reset Password" button you'll receive an email with a link to create a new password.
                This helps to ensure your account remains secure and accessible to you.
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            {/* Reset password button */}
            <GreenButton
              title="Reset Password"
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
              onPress={() => handleResetPassword(email)}
            />

            {/* Or */}
            <OrLine />

            {/* Back to Log in button */}
            <GoogleButton
              title="Back to Log in"
              style={styles.backToLoginButton}
              textStyle={styles.backToLoginText}
              onPress={() => router.push("/login")}
              noLogo={true}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    marginHorizontal: 24,
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -1,
    marginVertical: 40,
  },
  headerHighlight: {
    color: "#409858",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 125,
  },
  formContainer: {
    rowGap: 16,
    marginTop: 24,
  },
  inputContainer: {
    position: "relative",
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    width: "100%",
  },
  infoContainer: {
    marginTop: 16,
    padding: 8,
  },
  infoText: {
    lineHeight: 24,
  },
  controlsContainer: {
    marginTop: 24,
  },
  resetButton: {
    backgroundColor: "#409858",
    borderRadius: 9999,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  resetButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#191C19",
  },
  orText: {
    marginHorizontal: 16,
    fontWeight: "bold",
    fontSize: 20,
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 9999,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  backToLoginText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
