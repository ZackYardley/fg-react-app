import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  Pressable,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Map, CostaRica, Brazil, Penn } from "@/constants/Images";
import { Overlay, Button, Icon } from "@rneui/themed";

export default function TreePlantingScreen() {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Reset the overlay visibility to true every time the screen comes into focus
      setVisible(true);
    }, [])
  );

  const handleWaitlistYes = () => {
    setVisible(false);
    router.push("/waitlist");
  };

  const handleWaitlistNo = () => {
    setVisible(false);
    router.push("/home");
  };

  return (
    <ScrollView style={styles.container}>
      <Overlay isVisible={visible} onBackdropPress={handleWaitlistNo}>
        <View style={styles.overlayContent}>
          <Text style={styles.overlayText}>Coming Soon... Waitlist?</Text>
          <View style={styles.overlayButtonsContainer}>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={handleWaitlistYes}
              >
                <Text style={styles.overlayButtonText}>Yes</Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={styles.overlayNoButton}
              onPress={handleWaitlistNo}
              >
                <Text style={styles.overlayNoButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
      
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Forever<Text style={styles.headerTitleGreen}>green</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Tree Planting</Text>
          <Text style={styles.headerText}>
            Subscribe today to plant a tree monthly!
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/plant-a-tree")}
        >
          <Text style={styles.buttonEmoji}>🌱</Text>
          <Text style={styles.buttonText}>Plant a new tree!</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonEmoji}>🌳</Text>
          <Text style={styles.buttonText}>View my Forest!</Text>
        </Pressable>
      </View>
      <View style={styles.mapContainer}>
        <Image source={Map} style={styles.mapImage} resizeMode="contain" />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>You have planted:</Text>
          <Text style={styles.statText}>12 trees</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Your trees have sequestered:</Text>
          <Text style={styles.statText}>576 pounds of CO2</Text>
        </View>
      </View>

      <View style={styles.projectsContainer}>
        <Text style={styles.projectsTitle}>
          Check out our reforestation projects!
        </Text>
        <View style={styles.projectsButtonContainer}>
          <Pressable style={styles.projectButton}>
            <Image
              source={CostaRica}
              style={styles.projectImage}
              resizeMode="contain"
            />
            <Text style={styles.projectText}>Costa Rica</Text>
          </Pressable>
          <Pressable style={styles.projectButton}>
            <Image
              source={Brazil}
              style={styles.projectImage}
              resizeMode="contain"
            />
            <Text style={styles.projectText}>Brazil</Text>
          </Pressable>
          <Pressable style={styles.projectButton}>
            <Image
              source={Penn}
              style={styles.projectImage}
              resizeMode="contain"
            />
            <Text style={styles.projectText}>Pennsylvania</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.subscriptionContainer}>
        <Text style={styles.subscriptionTitle}>Tree Planting Subscription</Text>
        <Text style={styles.subscriptionText}>
          The Forevergreen tree planting subscription includes 1 tree planted on
          our reforestation projects. We will populate your forest with all the
          relevant data and credit the carbon sequestered to you. Build a forest
          and a sustainable future with a consistent effort.
        </Text>
        <Pressable style={styles.subscriptionButton}>
          <Text style={styles.subscriptionButtonText}>$10 Month</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    paddingTop: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
  },
  headerTitleGreen: {
    color: "#409858",
  },
  headerSubtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#eeeeee",
    padding: 16,
    borderRadius: 8,
  },
  buttonEmoji: {
    fontSize: 24,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  mapImage: {
    width: 256,
    height: 256,
    marginBottom: 8,
  },
  statsContainer: {
    marginBottom: 16,
    backgroundColor: "#eeeeee",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  statText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  projectsContainer: {
    marginBottom: 16,
    backgroundColor: "#eeeeee",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
  },
  projectsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  projectsButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  projectButton: {
    alignItems: "center",
  },
  projectImage: {
    width: 112,
    height: 112,
    marginBottom: 8,
  },
  projectText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subscriptionContainer: {
    marginBottom: 16,
    backgroundColor: "#eeeeee",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  subscriptionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subscriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  subscriptionButton: {
    backgroundColor: "#409858",
    padding: 16,
    borderRadius: 24,
  },
  subscriptionButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  overlayContent: {
    padding: 20,
    alignItems: "center",
  },
  overlayText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  overlayButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  overlayButton: {
    marginTop: 16,
    marginHorizontal: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#409858",
    borderRadius: 9999,
  },
  overlayNoButton: {
    marginTop: 16,
    marginHorizontal: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#eeeeee",
    borderRadius: 9999,
  },
  overlayButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  overlayNoButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
