import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, PageHeader } from "@/components/common";
import { useStripe } from "@/utils/stripe";
import { fetchSubscriptionPaymentSheetParams } from "@/api/purchase";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

const SubscriptionDetailsItem = ({
  icon,
  text,
}: {
  icon: "time-outline" | "calendar-outline" | "receipt-outline" | undefined;
  text: string;
}) => (
  <View style={styles.detailsItem}>
    <Ionicons name={icon} size={24} color="#666" />
    <Text style={styles.detailsText}>{text}</Text>
  </View>
);

const CarbonCreditSubscriptionScreen = () => {
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

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
    await initializePaymentSheet("price_1PqeuQJNQHxtxrkGJQdTC7jf");

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
              The Forevergreen tree planting subscription includes 1 tree planted on our reforestation projects. We will
              populate your forest with all the relevant data and credit the carbon sequestered to you. Build a forest
              and a sustainable future with a consistent effort.
            </Text>
            <TouchableOpacity
              style={[styles.subscribeButton, isProcessingPayment && styles.disabledButton]}
              onPress={openPaymentSheet}
              disabled={isProcessingPayment}
            >
              <Text style={styles.subscribeButtonText}>
                {isProcessingPayment ? "Processing..." : "Subscribe for $20/month"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Subscription Details</Text>
            <SubscriptionDetailsItem icon="time-outline" text="Payment due on May 1, 2024" />
            <SubscriptionDetailsItem icon="calendar-outline" text="Ends on May 31, 2024" />
            <SubscriptionDetailsItem icon="receipt-outline" text="Billed Monthly" />
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
    backgroundColor: "#ffcccb",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "stretch",
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default CarbonCreditSubscriptionScreen;
