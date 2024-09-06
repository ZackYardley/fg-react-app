import { useState, useEffect } from "react";
import { ScrollView, Pressable, View, StyleSheet, StatusBar } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { isUserSubscribedMailChimp, updateUserSubscriptionMailChimp } from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { Link } from "expo-router";

const LearnScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

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

  const handleOpenLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

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
    <ThemedSafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.circle, styles.topLeftCircle]} />
          <View style={[styles.circle, styles.bottomRightCircle]} />

          {/* <View style={styles.header}>
          <Text style={styles.titleText}>
            Forever<Text style={styles.greenText}>green</Text>
          </Text>
          <Text style={styles.subtitleText}>Learn</Text>
        </View> */}
          <PageHeader subtitle="Learn" />

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Resources Guides</ThemedText>
            <ThemedText style={styles.cardText}>
              Check out our resources guides with tons of info about how to live a more sustainable lifestyle!
            </ThemedText>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <ThemedText style={styles.buttonText}>Learn More</ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Course</ThemedText>
            <ThemedText style={styles.cardText}>
              We have created some follow at your own pace courses about sustainable living!
            </ThemedText>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <ThemedText style={styles.buttonText}>Explore</ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Blogs</ThemedText>
            <ThemedText style={styles.cardText}>
              We have tons of blogs about hot climate topics that are easy to read and educational!
            </ThemedText>
            <Link href="/blog">
              <View style={styles.button}>
                <ThemedText style={styles.buttonText}>Read Now</ThemedText>
              </View>
            </Link>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Fast Facts</ThemedText>
            <ThemedText style={styles.cardText}>
              Want a quick fact about climate related topics to expand your view? Check out our fast facts now!
            </ThemedText>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <ThemedText style={styles.buttonText}>View</ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Newsletter Subscription</ThemedText>
            <ThemedText style={styles.cardText}>
              By joining the newsletter you will be sent personalized info about your journey towards net-zero. This is
              a free an easy way to reduce your emissions.
            </ThemedText>
            <Pressable
              style={[styles.button, loading && styles.disabledButton]}
              onPress={() => !loading && handleNewsletterSubscription()}
              disabled={loading || isNewsletterSubscribed}
            >
              {loading ? (
                <ThemedText style={styles.buttonText}>Loading...</ThemedText>
              ) : isNewsletterSubscribed ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <ThemedText style={styles.buttonText}>Subscribed</ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.buttonText}>Subscribe</ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 150,
  },
  topLeftCircle: {
    top: 150,
    left: -150,
  },
  bottomRightCircle: {
    top: 500,
    left: 300,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  greenText: {
    color: "#409858",
  },
  subtitleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  card: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#409858",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 160,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
