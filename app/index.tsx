import { useRootNavigationState, Redirect, router } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchEmissionsData } from "@/api/emissions";
import dayjs from "dayjs";
import { Loading } from "@/components/common";
import ConfettiCannon from "react-native-confetti-cannon";

// Initialize debugMode with useState
export default function Index() {
  const [debugMode, setDebugMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasCalculatedEmissions, setHasCalculatedEmissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const rootNavigationState = useRootNavigationState();
  const explosionRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          setIsAnonymous(currentUser.isAnonymous);

          const emissionsData = await fetchEmissionsData();
          if (emissionsData) {
            const lastUpdated = emissionsData.lastUpdated?.toDate();
            const daysSinceLastUpdate = lastUpdated ? dayjs().diff(dayjs(lastUpdated), "day") : null;

            const hasCalculated = daysSinceLastUpdate !== null && daysSinceLastUpdate <= 30;
            setHasCalculatedEmissions(hasCalculated);
          } else {
            setHasCalculatedEmissions(false);
          }
        } else {
          setUser(null);
          setIsAnonymous(false);
        }

        setDebugMode(!!process.env.EXPO_PUBLIC_APP_ENV);
      } catch {
        setUser(null);
        setIsAnonymous(false);
      } finally {
        console.log("Debug mode:", debugMode);
        console.log(process.env.EXPO_PUBLIC_APP_ENV)
        console.log(debugMode);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!rootNavigationState?.key) return null;

  if (loading) {
    return <Loading />;
  }

  if (debugMode) {
    return (
      <View style={styles.container}>
        <View style={styles.confettiContainer} pointerEvents="none">
          <ConfettiCannon
            count={200}
            origin={{ x: 0, y: 0 }}
            autoStart={false}
            ref={explosionRef}
            fadeOut
            fallSpeed={3000}
            explosionSpeed={1}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {}} // Update debugMode state
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonLabel}>
              <Icon name="user" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Regular App Flow</Text>
            </View>
            <Icon name="arrow-right" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/_sitemap")}>
          <View style={styles.buttonContent}>
            <View style={styles.buttonLabel}>
              <Icon name="map" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Sitemap</Text>
            </View>
            <Icon name="arrow-right" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => explosionRef.current?.start()}>
          <View style={styles.buttonContent}>
            <View style={styles.buttonLabel}>
              <Icon name="smile-o" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Test Button!</Text>
            </View>
            <Icon name="arrow-right" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    if (!user) {
      return <Redirect href="/get-started" />;
    } else if (isAnonymous) {
      if (!hasCalculatedEmissions) {
        return <Redirect href="/pre-survey" />;
      } else {
        return <Redirect href="/signup" />;
      }
    } else {
      // Regular user
      if (!hasCalculatedEmissions) {
        return <Redirect href="/pre-survey" />;
      } else {
        return <Redirect href="/home" />;
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  button: {
    width: "80%",
    padding: 10,
    borderColor: "#1A1A1A",
    borderWidth: 2,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonContent: {
    padding: 12,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonLabel: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // Ensure it is on top of everything else
  },
});
