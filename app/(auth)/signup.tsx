import { useState, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "expo-router";
import { onSignup, onGoogleSignUp, onContinueAnonymously } from "@/api/auth";
import { GreenButton, TitleWithLogo } from "@/components/common";
import GoogleButton from "@/components/GoogleButton";
import CustomTextInput from "@/components/CustomTextInput";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { height } = useWindowDimensions();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAnonymous(user.isAnonymous);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={[styles.contentContainer, { minHeight: height }]}>
            <TitleWithLogo title="Sign" titleAlt="up" />
            <View style={styles.formContainer}>
              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Ex. abc@example.com"
                leftIcon="at"
              />
              <CustomTextInput
                label="Your Name"
                value={name}
                onChangeText={setName}
                placeholder="Ex. John Smith"
                leftIcon="account"
              />
              <CustomTextInput
                label="Your Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your Password"
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
              <GreenButton
                title="Create Account"
                onPress={() => onSignup(email, password, name)}
                style={styles.createAccountButton}
                textStyle={styles.createAccountButtonText}
              />
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.orLine} />
              </View>
              <GoogleButton title="Continue with Google" onPress={() => onGoogleSignUp()} />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already helping our planet?</Text>
                <Link href={"/login"}>
                  <Text style={styles.loginLink}>Log In</Text>
                </Link>
              </View>
              {isAnonymous ? (
                <View style={styles.anonymousContainer}>
                  <Text style={styles.anonymousText}>
                    Create an account to save your progress, access all features, and continue making a real impact on
                    the environment!
                  </Text>
                </View>
              ) : (
                <View style={styles.guestContainer}>
                  <Link onPress={() => onContinueAnonymously()} href={"/pre-survey"} replace>
                    <Text style={styles.guestLink}>Or continue as guest</Text>
                  </Link>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 20,
  },
  titleHighlight: {
    color: "#409858",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 320,
    height: 160,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    width: "100%",
  },
  createAccountButton: {
    backgroundColor: "#409858",
    borderRadius: 9999,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  createAccountButtonText: {
    color: "#fff",
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
    backgroundColor: "black",
  },
  orText: {
    paddingHorizontal: 16,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  loginContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  loginText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginLink: {
    textDecorationLine: "underline",
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  anonymousContainer: {
    marginTop: 16,
  },
  anonymousText: {
    textAlign: "center",
    fontSize: 18,
    color: "#4a4a4a",
  },
  guestContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  guestLink: {
    textDecorationLine: "underline",
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
