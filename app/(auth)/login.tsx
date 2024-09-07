import { useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { onLogin, onGoogleLogin } from "@/api/auth";
import { TitleWithLogo, GreenButton, GoogleButton, CustomTextInput, OrLine } from "@/components/auth";
import { ThemedSafeAreaView, ThemedText } from "@/components/common";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ThemedSafeAreaView style={styles.safeAreaView}>
      <StatusBar />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TitleWithLogo title="Log" titleAlt="in" />
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Ex. abc@example.com"
                leftIcon="at"
              />
            </View>
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your Password"
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>
            <View style={styles.forgotPasswordContainer}>
              <Link href="/forgot-password">
                <ThemedText type="link" style={styles.forgotPasswordText}>
                  Forgot Password?
                </ThemedText>
              </Link>
            </View>
            <GreenButton
              title="Log in"
              onPress={() => {
                onLogin(email, password);
              }}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
            <OrLine />
            <GoogleButton
              onPress={() => {
                onGoogleLogin();
              }}
            />
            <View style={styles.signUpContainer}>
              <Link href="/signup">
                <Text style={styles.signUpText}>Back to Sign Up</Text>
              </Link>
            </View>
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
  safeAreaView: {
    flex: 1,
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -1,
    marginVertical: 40,
  },
  formContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    rowGap: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 18,
    fontWeight: "normal",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: "#22C55E",
    borderRadius: 9999,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  loginButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  signUpText: {
    fontSize: 20,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
