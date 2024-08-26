// Import necessary libraries and components
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  // Alert,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
// import axios from "axios";
import { BackButton, PageHeader } from "@/components/common";


const Waitlist = () => {
  // Define state variables to hold the input values
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [note, setNote] = useState("");

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.greenCircle1} />
          <View style={styles.greenCircle2} />

          <View style={styles.header}>
            <PageHeader subtitle="Waitlist" />
            <BackButton />
            <Text style={styles.description}>
              Submit your email to join the waitlist!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Enter Your Name Below:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Your Answer"
                value={Name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Enter Your Email Address Below:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Your Answer"
                value={Email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Enter a Note:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Your Answer"
                value={note}
                onChangeText={setNote}
              />
            </View>
            <Pressable style={styles.submitButton} 
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Waitlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 24,
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
  header: {
    alignItems: "center",
    marginTop: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  greenText: {
    color: "#409858",
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: "#eeeeee",
    marginTop: 32,
    padding: 16,
    borderRadius: 24,
  },
  formTitle: {
    fontSize: 36,
    marginTop: 8,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
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
    paddingHorizontal: 16,
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
