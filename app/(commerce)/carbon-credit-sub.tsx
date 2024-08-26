import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useStripe } from "@/utils/stripe";
import dayjs from "dayjs";
import Icon from "react-native-vector-icons/FontAwesome";
import { BackButton, Loading, NotFoundComponent, PageHeader } from "@/components/common";
import { fetchSubscriptionPaymentSheetParams } from "@/api/purchase";
import { fetchCarbonCreditSubscription } from "@/api/products";
import { getSubscription, isSubscribedToProduct } from "@/api/payments";
import { fetchEmissionsData } from "@/api/emissions";
import { formatPrice } from "@/utils";
import { CarbonCreditSubscription, Price } from "@/types";

const CarbonCreditSubscriptionScreen = () => {
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [carbonCreditSubscription, setCarbonCreditSubscription] = useState<{
    product: CarbonCreditSubscription;
    recommendedPrice: Price;
  }>();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPeriodStart, setCurrentPeriodStart] = useState("");
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState("");

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const userEmissionsData = await fetchEmissionsData();
        const userEmissions = userEmissionsData?.totalData.totalEmissions;
        if (!userEmissions) {
          console.error("No user emissions data found");
          return;
        }
        const result = await fetchCarbonCreditSubscription(userEmissions);
        if (result) {
          const subscriptionStatus = await isSubscribedToProduct(result.product.id || "");
          setIsSubscribed(subscriptionStatus);
          if (subscriptionStatus) {
            const subscription = await getSubscription(result.product.id || "");
            if (subscription) {
              setCurrentPeriodEnd(dayjs(subscription.current_period_end.seconds * 1000).format("MMMM D, YYYY"));
              setCurrentPeriodStart(dayjs(subscription.current_period_start.seconds * 1000).format("MMMM D, YYYY"));
            }
          }
        }
        setCarbonCreditSubscription(result || undefined);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const initializePaymentSheet = useCallback(
    async (price: string) => {
      if (!auth.currentUser) {
        router.replace("/login");
        return;
      }

      try {
        setIsProcessingPayment(true);
        const { paymentIntent, ephemeralKey, customer } = await fetchSubscriptionPaymentSheetParams(
          price,
          auth.currentUser.uid
        );

        setPaymentIntentId(paymentIntent);

        const { error } = await initPaymentSheet({
          merchantDisplayName: "Forevergreen",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: auth.currentUser.displayName || "",
            email: auth.currentUser.email || "",
          },
          applePay: {
            merchantCountryCode: "US",
            testEnv: true,
          },
          googlePay: {
            merchantCountryCode: "US",
            testEnv: true,
          },
          returnURL: "com.fgdevteam.fgreactapp://stripe-redirect",
        });

        if (error) {
          console.error("Error initializing payment sheet:", error);
          Alert.alert("Error", "Failed to initialize payment. Please try again.");
        }
      } catch (error) {
        console.error("Error initializing payment:", error);
        Alert.alert("Error", "Failed to initialize payment. Please try again.");
      } finally {
        setIsProcessingPayment(false);
      }
    },
    [auth.currentUser, initPaymentSheet]
  );

  const openPaymentSheet = async () => {
    await initializePaymentSheet(carbonCreditSubscription?.recommendedPrice.id || "");

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      handleSuccessfulPurchase(paymentIntentId || "");
    }
  };

  const handleSuccessfulPurchase = async (paymentIntentId: string) => {
    console.log("Successful purchase with paymentIntentId:", paymentIntentId);
    // Handle successful purchase (e.g., update database, show confirmation)
  };

  const handleCancelSubscription = async () => {
    const url = "https://billing.stripe.com/p/login/test_3cscQneUc5zscy43cc";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
    }
  };

  const SubscriptionDetailsItem = ({
    icon,
    text,
  }: {
    icon: "time-outline" | "calendar-outline" | "receipt-outline" | undefined;
    text: string;
  }) => (
    <View style={styles.detailsItem}>
      <Ionicons name={icon} size={24} color="#000" />
      <Text style={styles.detailsText}>{text}</Text>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  if (!carbonCreditSubscription) {
    return <NotFoundComponent />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.greenCircleLarge} />
        <View style={styles.greenCircleSmall} />
        <PageHeader
          subtitle="Carbon Credit Subscription"
          description="Offset your carbon footprint and go net zero now!"
        />
        <BackButton />

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Subscription</Text>
            <Text style={styles.cardDescription}>
              The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon
              credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the
              planet and support awesome climate projects!
            </Text>
            {isSubscribed ? (
              <View style={styles.subscribedContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#409858" />
                <Text style={styles.subscribedText}>Subscribed</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.subscribeButton, isProcessingPayment && styles.disabledButton]}
                onPress={openPaymentSheet}
                disabled={isProcessingPayment}
              >
                <Text style={styles.subscribeButtonText}>
                  {isProcessingPayment
                    ? "Processing..."
                    : `Subscribe for ${formatPrice(carbonCreditSubscription?.recommendedPrice.unit_amount)}/month`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {isSubscribed && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Subscription Details</Text>
              <SubscriptionDetailsItem icon="time-outline" text={`Payment due on ${currentPeriodStart}`} />
              <SubscriptionDetailsItem icon="calendar-outline" text={`Ends on ${currentPeriodEnd}`} />
              <SubscriptionDetailsItem icon="receipt-outline" text="Billed Monthly" />
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
                <Icon name="close" size={24} color="#D22626" />
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
          )}
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
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
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
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: "#409858",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "stretch",
    marginTop: 20,
  },
  subscribeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },

  subscribedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subscribedText: {
    marginLeft: 5,
    color: "#409858",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailsText: {
    marginLeft: 10,
    fontSize: 16,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    marginLeft: 10,
    fontSize: 16,
  },
  paymentCardNumber: {
    marginLeft: "auto",
    fontSize: 16,
    color: "#666",
  },
  cancelButton: {
    backgroundColor: "#DE9D9D",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "stretch",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonText: {
    color: "#D22626",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CarbonCreditSubscriptionScreen;
