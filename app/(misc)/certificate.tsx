import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { PageHeader, BackButton, ThemedSafeAreaView, ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

// Add print and stuff
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function Certificate() {
  let [name, setName] = useState('');

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
          }
          h1 {
            color: #333;
          }
          img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>
        <h1>Congratulations!</h1>
        <p>You have successfully completed the course.</p>
        <img src="https://i.imgur.com/2wTbL6U.png" alt="Certificate" />
        <p>Issued to: ${name}</p>
      </body>
    </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({ 
      html: html,
      base64: false
    });
    await shareAsync(file.uri);
  };


  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader subtitle="rick" description="Build a sustainable future by living net-zero" />
        <BackButton />

        <View style={styles.mainContent}>
          <TouchableOpacity style={styles.factButton} onPress={() => {generatePdf()}}></TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: "row",
    flex: 2,
    marginTop: 16,
  },
  factButton: {
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#22C55E",
    borderRadius: 50,
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
  },
  
});