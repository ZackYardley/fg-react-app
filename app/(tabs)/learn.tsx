import { useState, useEffect } from "react";
import { ScrollView, Text, Pressable, View, StyleSheet, StatusBar } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { isUserSubscribedMailChimp, updateUserSubscriptionMailChimp } from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resources Guides</Text>
            <Text style={styles.cardText}>
              Check out our resources guides with tons of info about how to live a more sustainable lifestyle!
            </Text>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <Text style={styles.buttonText}>Learn More</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Course</Text>
            <Text style={styles.cardText}>
              We have created some follow at your own pace courses about sustainable living!
            </Text>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <Text style={styles.buttonText}>Explore</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Blogs</Text>
            <Text style={styles.cardText}>
              We have tons of blogs about hot climate topics that are easy to read and educational!
            </Text>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/blog")}>
              <Text style={styles.buttonText}>Read Now</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fast Facts</Text>
            <Text style={styles.cardText}>
              Want a quick fact about climate related topics to expand your view? Check out our fast facts now!
            </Text>
            <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
              <Text style={styles.buttonText}>View</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Newsletter Subscription</Text>
            <Text style={styles.cardText}>
              By joining the newsletter you will be sent personalized info about your journey towards net-zero. This is
              a free an easy way to reduce your emissions.
            </Text>
            <Pressable
              style={[styles.button, loading && styles.disabledButton]}
              onPress={() => !loading && handleNewsletterSubscription()}
              disabled={loading || isNewsletterSubscribed}
            >
              {loading ? (
                <Text style={styles.buttonText}>Loading...</Text>
              ) : isNewsletterSubscribed ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.buttonText}>Subscribed</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Subscribe</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    backgroundColor: "#eeeeee",
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
