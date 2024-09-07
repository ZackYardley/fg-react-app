import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { PageHeader, BackButton, ThemedSafeAreaView, ThemedText } from "@/components/common";
import { Credit } from "@/constants/Images";
import { useThemeColor } from "@/hooks";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

// Add print and stuff
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function Certificate() {
  let [name, setName] = useState('');

  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carbon Offset Certificate</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .certificate {
            border: 2px solid #000;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .logo {
            max-width: 100px;
        }
        .title {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .icon {
            width: 50px;
            height: 50px;
            background-color: #FFD700;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <img src="/api/placeholder/100/50" alt="Forevergreen logo" class="logo">
            <img src="/api/placeholder/100/50" alt="VERRA logo" class="logo">
        </div>
        <div class="title">
            <img src="/api/placeholder/200/100" alt="Verified Carbon Standard logo" class="logo">
            <h2>Monthly Offset</h2>
            <h3>Certificate of Verified Carbon Unit (VCU) Retirement</h3>
            <p>1 Carbon Credit retired in September 2024 to offset 1 Ton of CO2 on behalf of Mitchell Bugalski</p>
        </div>
        <div class="content">
            <h4>Project Name:</h4>
            <p>Energy Efficiency and Solid Waste Diversion Activities within the Quebec Sustainable Community</p>
            <h4>VCU Serial Number:</h4>
            <p>15312-681393912-681394011-VCS-VCU-208-VER-CA-3-929-01012018-31122018-O</p>
            <h4>Retirement Reason</h4>
            <p>Consumer Offsets</p>
            <h4>Registry Link:</h4>
            <p><a href="https://registry.verra.org/myModule/rpt/myrpt.asp?r=206&h=239992">https://registry.verra.org/myModule/rpt/myrpt.asp?r=206&h=239992</a></p>
        </div>
        <div class="footer">
            <div></div>
            <div class="icon">:zap:</div>
        </div>
    </div>
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