import { useState, useEffect, useCallback } from "react";
import { ScrollView, Pressable, View, StyleSheet, StatusBar, Dimensions, Image, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { isUserSubscribedMailChimp, updateUserSubscriptionMailChimp } from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { Loading, PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { Link, useFocusEffect } from "expo-router";
import { Book, Camera, Blog, FastFacts, Credit, Newsletter, Methodology } from "@/constants/Images";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks";

const LearnScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const success = useThemeColor({}, "success");
  const onPrimary = useThemeColor({}, "onPrimary");

  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const handleOpenLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const handleOpenPdf = () => {
    router.push("/pdf");
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

  useFocusEffect(
    useCallback(() => {
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
    }, [user?.uid])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.circle, styles.topLeftCircle]} />
          <View style={[styles.circle, styles.bottomRightCircle]} />

          <PageHeader subtitle="Learn" />

          {/* Resource Guides */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Resource Guides</ThemedText>
                <ThemedText style={styles.cardText}>
                  Check out our guides with info about how to live a sustainable lifestyle!{" "}
                </ThemedText>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Explore</ThemedText>
                </Pressable>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Book} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Course */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Courses</ThemedText>
                <ThemedText style={styles.cardText}>
                  Follow at your own pace: courses about sustainable living!{" "}
                </ThemedText>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Explore</ThemedText>
                </Pressable>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Camera} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Blogs */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Blogs</ThemedText>
                <ThemedText style={styles.cardText}>
                  Blogs about hot climate topics: easy to read and educational!
                </ThemedText>
                <Link href="/blog" style={{ marginTop: 10 }}>
                  <View style={[styles.button]}>
                    <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Read Now</ThemedText>
                  </View>
                </Link>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Blog} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Fast Facts */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Fast Facts</ThemedText>
                <ThemedText style={styles.cardText}>
                  Want a quick fact about climate related topics to expand your view?{" "}
                </ThemedText>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>View</ThemedText>
                </Pressable>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={FastFacts} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Credit */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Carbon Credits</ThemedText>
                <ThemedText style={styles.cardText}>
                  Learn more about Carbon Credits and what goes into our projects!{" "}
                </ThemedText>
                <Link href="/carbon-credit" style={{ marginTop: 10 }}>
                  <View style={[styles.button]}>
                    <ThemedText style={[styles.buttonText, { color: onPrimary }]}>View</ThemedText>
                  </View>
                </Link>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Credit} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Methodology */}

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Methodology</ThemedText>
                <ThemedText style={styles.cardText}>Find out how we calculate your emissions first-hand! </ThemedText>
                <Pressable style={styles.button} onPress={handleOpenPdf}>
                  <ThemedText style={[styles.buttonText, { color: onPrimary }]}>Learn More</ThemedText>
                </Pressable>
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Methodology} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>

          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.cardTitle}>Newsletter</ThemedText>
                <ThemedText style={styles.cardText}>
                  Stay up to date with the latest sustainability tips and eco-friendly news!{" "}
                </ThemedText>
                {isNewsletterSubscribed ? (
                  <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <Ionicons name="checkmark-circle" color={success} size={24} />
                    <ThemedText style={styles.buttonText}>Subscribed</ThemedText>
                  </View>
                ) : (
                  <Pressable style={styles.button} onPress={handleNewsletterSubscription}>
                    <ThemedText style={styles.buttonText}>Subscribe</ThemedText>
                  </Pressable>
                )}
              </ThemedView>
              <View style={styles.imageContainer}>
                <Image source={Newsletter} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </View>
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
    flex: 2,
    flexDirection: "column",
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
    width: "80%",
    padding: 16,
    borderRadius: 16,
    marginRight: "2%",
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  resource: {
    flex: 2,
    flexDirection: "row",
    marginTop: 24,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "20%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "200%",
    height: "200%",
  },
});
