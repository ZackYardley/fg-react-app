import { router, useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { ScrollView, Text, Pressable, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Map, CostaRica, Brazil, Penn } from "@/constants/Images";
import { Overlay } from "@rneui/themed";
import { PageHeader } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function TreePlantingScreen() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    checkWaitlistStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setOverlayVisible(true);
    }, [])
  );

  const checkWaitlistStatus = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.customAppWaitlist === "Tree Planting") {
            setIsWaitlisted(true);
            setMessage("You're already on the Tree Planting waitlist");
          } else {
            setMessage("Coming Soon... Join Waitlist?");
          }
        }
      } catch (error) {
        console.error("Error checking waitlist status:", error);
        setMessage("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setMessage("You must be logged in to join the waitlist.");
    }
  };

  const handleWaitlistYes = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, {
          customAppWaitlist: "Tree Planting",
        });
        setIsWaitlisted(true);
        setMessage("You have been added to the Tree Planting waitlist!");
        setShowConfirmation(true);
      } catch (error) {
        console.error("Error updating user document:", error);
        setMessage("An error occurred. Please try again later.");
      }
    } else {
      setMessage("You must be logged in to join the waitlist.");
    }
    setOverlayVisible(false);
  };

  const handleWaitlistNo = () => {
    setOverlayVisible(false);
    router.navigate("/home");
  };

  const handleOk = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    }
    setOverlayVisible(false);
    router.navigate("/home");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container}>
        <Overlay isVisible={overlayVisible} onBackdropPress={handleWaitlistNo}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayText}>{loading ? "Loading..." : message}</Text>
            <View style={styles.overlayButtonsContainer}>
              {isWaitlisted || loading ? (
                <TouchableOpacity style={styles.overlayButton} onPress={loading ? () => {} : () => handleOk()}>
                  <Text style={styles.overlayButtonText}>{loading ? "Loading..." : "Ok"}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.overlayButton} onPress={() => handleWaitlistYes()}>
                    <Text style={styles.overlayButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.overlayNoButton} onPress={() => handleWaitlistNo()}>
                    <Text style={styles.overlayNoButtonText}>No</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Overlay>

        <PageHeader subtitle="Tree Planting" description="Subscribe today to plant a tree monthly!" />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => router.navigate("/plant-a-tree")}>
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
          <Text style={styles.projectsTitle}>Check out our reforestation projects!</Text>
          <View style={styles.projectsButtonContainer}>
            <Pressable style={styles.projectButton}>
              <Image source={CostaRica} style={styles.projectImage} resizeMode="contain" />
              <Text style={styles.projectText}>Costa Rica</Text>
            </Pressable>
            <Pressable style={styles.projectButton}>
              <Image source={Brazil} style={styles.projectImage} resizeMode="contain" />
              <Text style={styles.projectText}>Brazil</Text>
            </Pressable>
            <Pressable style={styles.projectButton}>
              <Image source={Penn} style={styles.projectImage} resizeMode="contain" />
              <Text style={styles.projectText}>Pennsylvania</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.subscriptionContainer}>
          <Text style={styles.subscriptionTitle}>Tree Planting Subscription</Text>
          <Text style={styles.subscriptionText}>
            The Forevergreen tree planting subscription includes 1 tree planted on our reforestation projects. We will
            populate your forest with all the relevant data and credit the carbon sequestered to you. Build a forest and
            a sustainable future with a consistent effort.
          </Text>
          <Pressable style={styles.subscriptionButton}>
            <Text style={styles.subscriptionButtonText}>$10 Month</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 24,
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
    justifyContent: "center",
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
  waitlistStatus: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#e0f2e9",
    borderRadius: 5,
  },
});
