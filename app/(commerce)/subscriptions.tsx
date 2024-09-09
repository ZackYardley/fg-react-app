import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, GreenCircles, PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { router } from "expo-router";
import { fetchCarbonCreditSubscription } from "@/api/products";
import { fetchEmissionsData } from "@/api/emissions";
import { formatPrice } from "@/utils";
import {
  fetchSubscriptionStatus,
  isUserSubscribedMailChimp,
  updateUserSubscriptionMailChimp,
} from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "@/hooks";

const ForevergreenSubscriptions = () => {
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const primary = useThemeColor({}, "primary");

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const userEmissionsData = await fetchEmissionsData();
        if (userEmissionsData) {
          const userEmissions = userEmissionsData.totalEmissions;
          const result = await fetchCarbonCreditSubscription(userEmissions);
          if (result) {
            setSubscriptionPrice(result.recommendedPrice.unit_amount);
            const isSubscribed = await fetchSubscriptionStatus(result.product.id || "");
            setIsSubscribed(isSubscribed);
          } else {
            console.error("No Carbon Credit Subscription found");
          }
        } else {
          console.error("No user emissions data found");
        }

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

  const handleNewsletterSubscribption = async () => {
    try {
      const newStatus = !isNewsletterSubscribed;
      await updateUserSubscriptionMailChimp(user?.uid || "", newStatus);
      setIsNewsletterSubscribed(newStatus);
    } catch (error) {
      console.error("Error updating newsletter subscription:", error);
    }
  };

  const SubscriptionCard = ({
    title,
    description,
    price,
    onPress,
  }: {
    title: string;
    description: string;
    price: string;
    onPress: () => void;
  }) => (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      <TouchableOpacity style={[styles.button, { backgroundColor: primary }]} onPress={onPress}>
        <ThemedText style={styles.buttonText}>
          {loading ? "Loading..." : isSubscribed ? "Manage Subscription" : price}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={styles.scrollView}>
        <GreenCircles />
        <PageHeader subtitle="Subscriptions" description="Choose a subscription to reduce your environmental impact" />
        <BackButton />

        <View style={{ paddingTop: 40 }}>
          <View style={styles.scrollView}>
            {/* <SubscriptionCard
              title="Tree Planting Subscription"
              description="The Forevergreen tree planting subscription includes 1 tree planted on our reforestation projects. We will populate your forest with all the relevant data and credit the carbon sequestered to you. Build a forest and a sustainable future with a consistent effort."
              price="$10 Month"
              onPress={() =>  {}}}
            />  */}
            {loading ? (
              <SubscriptionCard
                title="Carbon Credit Subscription"
                description="The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet and support awesome climate projects!"
                price={""}
                onPress={() => {}}
              />
            ) : subscriptionPrice ? (
              <SubscriptionCard
                title="Carbon Credit Subscription"
                description="The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet and support awesome climate projects!"
                price={`${formatPrice(subscriptionPrice)}/Month`}
                onPress={() => router.push("/carbon-credit-sub")}
              />
            ) : (
              <Text>Carbon Credit Subscription not available</Text>
            )}
            <ThemedView style={styles.card}>
              <ThemedText style={styles.cardTitle}>Newsletter Subscription</ThemedText>
              <ThemedText style={styles.cardDescription}>
                By joining the newsletter you will be sent personalized info about your journey towards net-zero. This
                is a free an easy way to reduce your emissions.
              </ThemedText>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: primary }]}
                onPress={handleNewsletterSubscribption}
              >
                <ThemedText style={styles.buttonText}>
                  {loading ? "Loading..." : isNewsletterSubscribed ? "Unsubscribe" : "Subscribe"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.card}>
              <ThemedText style={styles.cardTitle}>Current Subscriptions</ThemedText>
              <View style={styles.subscriptionContainer}>
                {/* <View style={styles.subscriptionItem}>
                  <Ionicons name="close" size={18} color="red" />
                  <Text style={styles.subscriptionText}>Tree Planting Subscription</Text>
                </View> */}
                <View style={styles.subscriptionItem}>
                  {loading ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : isSubscribed ? (
                    <Ionicons name="checkmark" size={18} color={primary} />
                  ) : (
                    <Ionicons name="close" size={18} color="red" />
                  )}
                  <ThemedText style={styles.subscriptionText}>Carbon Credit Subscription</ThemedText>
                </View>
                <View style={styles.subscriptionItem}>
                  {loading ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : isNewsletterSubscribed ? (
                    <Ionicons name="checkmark" size={18} color={primary} />
                  ) : (
                    <Ionicons name="close" size={18} color="red" />
                  )}
                  <ThemedText style={styles.subscriptionText}>Email Subscription</ThemedText>
                </View>
              </View>
            </ThemedView>
          </View>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 28,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  subscriptionContainer: {
    marginHorizontal: "auto",
  },
  subscriptionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  subscriptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ForevergreenSubscriptions;
