import { router } from "expo-router";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { fourofour } from "@/constants/Images";
import ThemedSafeAreaView from "./ThemedSafeAreaView";
import ThemedText from "./ThemedText";

const NotFoundComponent = () => {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText style={styles.errorCode}>404</ThemedText>
      <ThemedText style={styles.errorMessage}>Page Not Found</ThemedText>
      <Image source={fourofour} style={styles.image} />
      <TouchableOpacity onPress={() => router.replace("/")} style={styles.button}>
        <ThemedText style={styles.buttonText}>Back Home</ThemedText>
      </TouchableOpacity>
    </ThemedSafeAreaView>
  );
};

export default NotFoundComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#409858",
  },
  errorMessage: {
    fontSize: 24,
    fontWeight: "500",
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#409858",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
