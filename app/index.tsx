import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRootNavigationState, Redirect, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import dayjs from "dayjs";
import ConfettiCannon from "react-native-confetti-cannon";
import { fetchEmissionsData } from "@/api/emissions";
import { testFetchCarbonCreditsByPaymentId } from "@/api/debug";
import { Loading } from "@/components/common";
import { useTheme } from "@/contexts/ThemeContext"; // Assuming you have this context
import { THEME_STORAGE_KEY } from "@/constants";

// Initialize debugMode with useState
export default function Index() {
  const { theme, toggleTheme } = useTheme();
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
      } catch {
        setUser(null);
        setIsAnonymous(false);
      } finally {
        setLoading(false);
      }
    });

    loadThemePreference();

    return () => unsubscribe();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        if (savedTheme !== theme) {
          toggleTheme();
        }
      }
    } catch (error) {
      console.error("Failed to load theme preference", error);
    }
  };

  if (!rootNavigationState?.key) return null;

  if (loading) {
    return <Loading />;
  }

  if (process.env.EXPO_PUBLIC_APP_ENV === "development") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <ScrollView contentContainerStyle={styles.container}>
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
            onPress={() => {
              if (!user) {
                router.navigate("/get-started");
              } else if (isAnonymous) {
                if (!hasCalculatedEmissions) {
                  router.navigate("/pre-survey");
                } else {
                  router.navigate("/signup");
                }
              } else {
                // Regular user
                if (!hasCalculatedEmissions) {
                  router.navigate("/pre-survey");
                } else {
                  router.navigate("/home");
                }
              }
            }}
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
          <TouchableOpacity
            style={styles.button}
            onPress={
              // () => explosionRef.current?.start()
              // () => testFetchCarbonCreditProducts()
              () => testFetchCarbonCreditsByPaymentId("pi_3Pwwo2JNQHxtxrkG0b6OZarf")
            }
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonLabel}>
                <Icon name="smile-o" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Test Button!</Text>
              </View>
              <Icon name="arrow-right" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
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
