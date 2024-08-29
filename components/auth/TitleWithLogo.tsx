import { View, Text, Image, StyleSheet } from "react-native";
import { TreeLogo } from "@/constants/Images";

const TitleWithLogo = ({ title, titleAlt }: { title: string; titleAlt: string }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>
        {title} <Text style={styles.titleHighlight}>{titleAlt}</Text>
      </Text>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={TreeLogo} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  googleButton: {
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
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  googleIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  googleButtonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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

export default TitleWithLogo;
