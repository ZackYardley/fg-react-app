import { useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { handleResetPassword } from "@/api/auth";
import { GreenButton, CustomTextInput, GoogleButton, OrLine, TitleWithLogo } from "@/components/auth";
import { ThemedSafeAreaView, ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const primary = useThemeColor({}, "primary");

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TitleWithLogo title="Reset" titleAlt="Password" />

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
              <ThemedText style={styles.infoText}>
                By clicking the "Reset Password" button you'll receive an email with a link to create a new password.
                This helps to ensure your account remains secure and accessible to you.
              </ThemedText>
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
              onPress={() => router.navigate("/login")}
              noLogo={true}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    marginHorizontal: 20,
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
    borderWidth: 1,
    borderRadius: 50,
    padding: 16,
  },
  backToLoginText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
