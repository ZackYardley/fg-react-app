import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { isUserSubscribedMailChimp, updateUserSubscriptionMailChimp } from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { GoogleButton, GreenButton } from "@/components/auth";
import { useThemeColor } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { Credit } from "@/constants/Images";
import { Credits } from "@/components/home";
import { darkenColor } from "@/utils";

export default function OffsetNowScreen() {
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  const onPrimary = useThemeColor({}, "onPrimary");
  const primary = useThemeColor({}, "primary");

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const subscribed = await isUserSubscribedMailChimp(user?.uid || "");
        setIsNewsletterSubscribed(subscribed);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user?.uid]);

  const handleNewsletterSubscription = async () => {
    try {
      const newStatus = !isNewsletterSubscribed;
      await updateUserSubscriptionMailChimp(user?.uid || "", newStatus);
      setIsNewsletterSubscribed(newStatus);
    } catch (error) {
      console.error("Error updating newsletter subscription:", error);
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PageHeader subtitle="Offset your Emissions!" description="Reduce your climate impact in a few clicks" />
        <BackButton />

        <View style={styles.content}>
          <ThemedView style={styles.carbonCreditSection}>
            <LinearGradient
              colors={[darkenColor(primary, 10), primary]}
              start={{ x: 0.5, y: 0.6 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradientBackground}
            >
              <ThemedText style={[styles.sectionTitle, { color: onPrimary }]}>Carbon Credit Subscription</ThemedText>
              <Credits justCredits />
              <ThemedText style={[styles.sectionText, { color: onPrimary }]}>
                Make a lasting impact with our carbon credit subscription. Offset your carbon footprint and support
                innovative climate projects every month!
              </ThemedText>
              <View style={styles.buttonContainer}>
                <GoogleButton
                  title="Buy a credit"
                  onPress={() => router.navigate("/carbon-credit")}
                  style={styles.carbonButton}
                  noLogo
                />
                <GoogleButton
                  title="Start Subscription"
                  onPress={() => router.navigate("/carbon-credit-sub")}
                  style={styles.carbonButton}
                  noLogo
                />
              </View>
            </LinearGradient>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Reduce with Habitual Changes</ThemedText>
            <ThemedText style={styles.sectionText}>
              Subscribe to our newsletter for tips on making small, impactful changes in your daily life to reduce
              emissions.
            </ThemedText>
            <View style={styles.centeredButtonContainer}>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: isNewsletterSubscribed ? "#4CAF50" : primary },
                  loading && styles.disabledButton,
                ]}
                onPress={() => !loading && handleNewsletterSubscription()}
                disabled={loading || isNewsletterSubscribed}
              >
                {loading ? (
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Loading...</ThemedText>
                ) : isNewsletterSubscribed ? (
                  <View style={styles.subscribedButton}>
                    <Ionicons name="checkmark-circle" size={24} color={onPrimary} />
                    <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Subscribed</ThemedText>
                  </View>
                ) : (
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Subscribe</ThemedText>
                )}
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  carbonCreditSection: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 5,
  },
  gradientBackground: {
    padding: 24,
    alignItems: "center",
  },
  section: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  carbonButton: {
    minWidth: 150,
  },
  centeredButtonContainer: {
    alignItems: "center",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    minWidth: 200,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  subscribedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
