import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, Loading, PageHeader } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";
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

const ForevergreenSubscriptions = () => {
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{loading ? "isLoading" : isSubscribed ? "Manage Subscription" : price}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.greenCircleLarge} />
        <View style={styles.greenCircleSmall} />
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
            {subscriptionPrice ? (
              <SubscriptionCard
                title="Carbon Credit Subscription"
                description="The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet and support awesome climate projects!"
                price={`${formatPrice(subscriptionPrice)} Month`}
                onPress={() => router.push("/carbon-credit-sub")}
              />
            ) : (
              <Text>Carbon Credit Subscription not available</Text>
            )}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Newsletter Subscription</Text>
              <Text style={styles.cardDescription}>
                By joining the newsletter you will be sent personalized info about your journey towards net-zero. This
                is a free an easy way to reduce your emissions.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleNewsletterSubscribption}>
                <Text style={styles.buttonText}>{isNewsletterSubscribed ? "Unsubscribe" : "Subscribe"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Subscriptions</Text>
              <View style={styles.subscriptionContainer}>
                {/* <View style={styles.subscriptionItem}>
                  <Ionicons name="close" size={18} color="red" />
                  <Text style={styles.subscriptionText}>Tree Planting Subscription</Text>
                </View> */}
                <View style={styles.subscriptionItem}>
                  {isSubscribed ? (
                    <Ionicons name="checkmark" size={18} color="green" />
                  ) : (
                    <Ionicons name="close" size={18} color="red" />
                  )}
                  <Text style={styles.subscriptionText}>Carbon Credit Subscription</Text>
                </View>
                <View style={styles.subscriptionItem}>
                  {isNewsletterSubscribed ? (
                    <Ionicons name="checkmark" size={18} color="green" />
                  ) : (
                    <Ionicons name="close" size={18} color="red" />
                  )}
                  <Text style={styles.subscriptionText}>Email Subscription</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  greenCircleLarge: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 150,
    bottom: "15%",
    right: "-35%",
  },
  greenCircleSmall: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 9999,
    top: "25%",
    left: "-25%",
  },
  card: {
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "#409858",
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
    color: "#333",
    fontSize: 16,
  },
});

export default ForevergreenSubscriptions;
