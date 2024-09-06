import { incrementUserReferrals, sendReferralEmail } from "@/api/referral";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedView, ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, StyleSheet, Alert } from "react-native";

const ReferralForm = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const auth = getAuth();
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [note, setNote] = useState("");
  const [emailError, setEmailError] = useState("");

  // Function to validate email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle the referral form submission
  const handleReferral = async () => {
    if (!validateEmail(friendEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await sendReferralEmail(friendEmail, friendName, auth.currentUser?.displayName || "", note);

      // Show a success alert if the email was sent successfully
      Alert.alert("Success", "Referral sent successfully!");

      // Clear input fields after successful send
      setFriendName("");
      setFriendEmail("");
      setNote("");
      setEmailError("");

      // Increment the referral count
      await incrementUserReferrals();

      // Navigate back to the previous screen
      router.back();
    } catch (error) {
      // Show an error alert if the email sending failed
      Alert.alert("Error", "Failed to send referral.");
      console.error("Error sending referral:", error);
    }
  };

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.greenCircle1} />
            <View style={styles.greenCircle2} />

            <PageHeader subtitle="Refer a Friend" description="Help the Cause Today by Referring a Friend" />
            <BackButton />
            <ThemedView style={styles.formContainer}>
              <ThemedText style={styles.formTitle}>Refer a Friend</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Enter Your Friend's Name Below:</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor, color: textColor }]}
                  placeholder="Your Answer"
                  value={friendName}
                  onChangeText={setFriendName}
                  placeholderTextColor={"#B6ABAB"}
                />
              </View>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Enter Your Friend's Email Address Below:</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor, color: textColor }]}
                  placeholder="Your Answer"
                  value={friendEmail}
                  onChangeText={(text) => {
                    setFriendEmail(text);
                    setEmailError("");
                  }}
                  placeholderTextColor={emailError ? "red" : "#B6ABAB"}
                />
                {emailError ? <ThemedText style={styles.errorText}>{emailError}</ThemedText> : null}
              </View>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Enter a Note or Leave Blank:</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor, color: textColor }]}
                  placeholder="Your Answer"
                  value={note}
                  onChangeText={setNote}
                  placeholderTextColor={"#B6ABAB"}
                />
              </View>
              <Pressable style={styles.submitButton} onPress={handleReferral}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </Pressable>
            </ThemedView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default ReferralForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  greenCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 150,
    top: 200,
    left: 200,
  },
  greenCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "#409858",
    borderRadius: 100,
    bottom: 100,
    right: 300,
  },
  formContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 24,
  },
  formTitle: {
    fontSize: 36,
    marginTop: 8,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  submitButton: {
    marginTop: 16,
    marginHorizontal: 90,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#409858",
    borderRadius: 9999,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});
