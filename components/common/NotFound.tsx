import { router } from "expo-router";
import { StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { fourofour } from "@/constants/Images";
import ThemedSafeAreaView from "./ThemedSafeAreaView";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks";
import { StatusBar } from "expo-status-bar";

const NotFoundComponent = () => {
  const onPrimary = useThemeColor({}, "onPrimary");
  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ThemedText style={styles.errorCode}>404</ThemedText>
      <ThemedText style={styles.errorMessage}>Page Not Found</ThemedText>
      <Image source={fourofour} style={styles.image} />
      <TouchableOpacity onPress={() => router.replace("/")} style={styles.button}>
        <Text style={[styles.buttonText, { color: onPrimary }]}>Back Home</Text>
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
    color: "#22C55E",
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
    backgroundColor: "#22C55E",
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
