import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking, Dimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useStripe } from "@/utils/stripe";
import dayjs from "dayjs";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  BackButton,
  Loading,
  NotFoundComponent,
  PageHeader,
  ThemedSafeAreaView,
  ThemedView,
} from "@/components/common";
import { fetchSubscriptionPaymentSheetParams } from "@/api/purchase";
import { fetchCarbonCreditSubscription } from "@/api/products";
import { fetchSubscriptionStatus, fetchSubscriptionByProduct } from "@/api/subscriptions";
import { fetchEmissionsData, saveEmissionsData } from "@/api/emissions";
import { formatPrice } from "@/utils";
import { CarbonCreditSubscription, Price } from "@/types";
import { ThemedText } from "@/components/common";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "@/hooks";

const { height } = Dimensions.get("window");

const CarbonCreditSubscriptionScreen = () => {
  const textColor = useThemeColor({}, "text");
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const paymentIntentIdRef = useRef<string | null>(null);
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
        // First we fetch the user's emissions data
        const userEmissionsData = await fetchEmissionsData();
        const userEmissions = userEmissionsData?.totalEmissions;
        if (!userEmissions) {
          console.error("No user emissions data found");
          return;
        }
        // Then we fetch the carbon credit subscription based on the user's emissions
        const result = await fetchCarbonCreditSubscription(userEmissions);
        if (result) {
          // If the user has a carbon credit subscription, we fetch the subscription status
          const subscriptionStatus = await fetchSubscriptionStatus(result.product.id || "");
          setIsSubscribed(subscriptionStatus);
          if (subscriptionStatus) {
            // If the user has a subscription, we fetch the subscription details
            const subscription = await fetchSubscriptionByProduct(result.product.id || "");
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

        // Extract the Payment Intent ID without the secret
        const paymentIntentId = paymentIntent.split("_secret_")[0];
        paymentIntentIdRef.current = paymentIntentId;

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
      handleSuccessfulPurchase(paymentIntentIdRef.current || "");
    }
  };

  const handleSuccessfulPurchase = async (paymentIntentId: string) => {
    console.log("Successful purchase with subscriptionId:", paymentIntentId);
    let newTotalOffset = 0;
    if (carbonCreditSubscription?.recommendedPrice.unit_amount) {
      newTotalOffset = carbonCreditSubscription?.recommendedPrice.unit_amount / 1000 || 0;
    }
    const emissionsData = await fetchEmissionsData();
    const oldTotalOffset = emissionsData?.totalOffset || 0;
    saveEmissionsData({ totalOffset: oldTotalOffset + newTotalOffset });

    // Navigate to the purchase-complete page with the paymentIntentId
    router.replace({
      pathname: "/purchase-complete",
      params: { productType: "subscription", paymentIntentId: paymentIntentId },
    });
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
      <Ionicons name={icon} size={24} color={textColor} />
      <ThemedText style={styles.detailsText}>{text}</ThemedText>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } else if (!carbonCreditSubscription) {
      return <NotFoundComponent />;
    } else {
      return (
        <>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Monthly Subscription</ThemedText>
            <ThemedText style={{ fontSize: 30, fontWeight: "bold" }}>
              {formatPrice(carbonCreditSubscription?.recommendedPrice.unit_amount)}
              <Text style={{ fontSize: 18, fontWeight: "normal" }}>/month</Text>
            </ThemedText>
            <ThemedText style={styles.cardDescription}>Offset your calculated carbon emissions</ThemedText>
            <ThemedText style={styles.cardDescription}>
              <Icon name="check" size={24} color="#409858" />
              <Text style={{ fontWeight: "bold" }}>Purchase of Carbon Credits: </Text>
              Includes buying the nearest whole number of carbon credits to ensure you are net zero.
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              <Icon name="check" size={24} color="#409858" />
              <Text style={{ fontWeight: "bold" }}>Hassle-Free: </Text>
              Easy way to reduce your environmental impact.
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              <Icon name="check" size={24} color="#409858" />
              <Text style={{ fontWeight: "bold" }}>Support Climate Projects: </Text>
              Contributes to awesome climate initiatives.
            </ThemedText>
            {isSubscribed ? (
              <View style={styles.subscribedContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#409858" />
                <ThemedText style={styles.subscribedText}>Subscribed</ThemedText>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.subscribeButton, isProcessingPayment && styles.disabledButton]}
                onPress={openPaymentSheet}
                disabled={isProcessingPayment}
              >
                <ThemedText style={styles.subscribeButtonText}>
                  {isProcessingPayment ? "Processing..." : `Subscribe now`}
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
          {isSubscribed && (
            <ThemedView style={styles.card}>
              <ThemedText style={styles.sectionTitle}>Subscription Details</ThemedText>
              <SubscriptionDetailsItem icon="time-outline" text={`Payment due on ${currentPeriodStart}`} />
              <SubscriptionDetailsItem icon="calendar-outline" text={`Ends on ${currentPeriodEnd}`} />
              <SubscriptionDetailsItem icon="receipt-outline" text="Billed Monthly" />
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
                <Icon name="close" size={24} color="#D22626" />
                <ThemedText style={styles.cancelButtonText}>Cancel Subscription</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </>
      );
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.greenCircleLarge} />
        <View style={styles.greenCircleSmall} />
        <View style={styles.contentWrapper}>
          <PageHeader
            subtitle="Carbon Credit Subscription"
            description="Offset your carbon footprint and go net zero now!"
          />
          <BackButton />

          <View style={styles.content}>{renderContent()}</View>
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
  scrollViewContent: {
    flexGrow: 1,
    minHeight: height,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
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
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: "#409858",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    marginHorizontal: "auto",
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
