import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, PageHeader } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@/utils/stripe";
import { fetchSubscriptionPaymentSheetParams } from "@/api/purchase";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

const ForevergreenSubscriptions = () => {
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet, paymentSheetError } = useStripe();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

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
      <TouchableOpacity style={[styles.button, isProcessingPayment && styles.disabledButton]} onPress={onPress}>
        <Text style={styles.buttonText}>{isProcessingPayment ? "Processing..." : price}</Text>
      </TouchableOpacity>
    </View>
  );

  // useEffect(() => {
  //   const intializePaymentSheet = async () => {
  //     const { error } = await initPaymentSheet({
  //       paymentIntentClientSecret: clientSecret,
  //       returnURL: "forevergreen://stripe-redirect",
  //       allowsDelayedPaymentMethods: true,
  //     });
  //     if (error) {
  //       // Handle error
  //     }
  //   };
  // }, [clientSecret, initPaymentSheet]);

  const initializePaymentSheet = useCallback(
    async (price: string) => {
      if (!auth.currentUser) {
        router.replace("/login");
      }

      // Fetch payment sheet parameters
      try {
        setIsProcessingPayment(true);
        const { paymentIntent, ephemeralKey, customer } = await fetchSubscriptionPaymentSheetParams(
          price,
          auth.currentUser?.uid || ""
        );

        setPaymentIntentId(paymentIntent);

        // Stripe configuration to open the payment sheet
        const { error } = await initPaymentSheet({
          merchantDisplayName: "Forevergreen",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: auth.currentUser?.displayName || "",
            email: auth.currentUser?.email || "",
          },
          applePay: {
            merchantCountryCode: "US",
            testEnv: true,
          },
          googlePay: {
            merchantCountryCode: "US",
            testEnv: true, // use test environment
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

  // Open payment sheet when user taps on "Buy Now"
  const openPaymentSheet = async (price: string) => {
    await initializePaymentSheet(price);

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      handleSuccessfulPurchase(paymentIntentId || "");
    }
  };

  const handleSuccessfulPurchase = async (paymentIntentId: string) => {
    // Handle successful purchase
    // You can update your database or perform other actions here
    console.log("Successful purchase with paymentIntentId:", paymentIntentId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.greenCircleLarge} />
        <View style={styles.greenCircleSmall} />
        <PageHeader subtitle="Subscriptions" description="Choose a subscription to reduce your environmental impact" />
        <BackButton />

        <View style={{ paddingTop: 40 }}>
          <View style={styles.scrollView}>
            <SubscriptionCard
              title="Tree Planting Subscription"
              description="The Forevergreen tree planting subscription includes 1 tree planted on our reforestation projects. We will populate your forest with all the relevant data and credit the carbon sequestered to you. Build a forest and a sustainable future with a consistent effort."
              price="$10 Month"
              onPress={() => openPaymentSheet("price_1PqeipJNQHxtxrkGJV3MTk8B")}
            />
            <SubscriptionCard
              title="Carbon Credit Subscription"
              description="The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet and support awesome climate projects!"
              price="$20 Month"
              onPress={() => openPaymentSheet("price_1PqeuQJNQHxtxrkGJQdTC7jf")}
            />
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Newsletter Subscription</Text>
              <Text style={styles.cardDescription}>
                By joining the newsletter you will be sent personalized info about your journey towards net-zero. This
                is a free an easy way to reduce your emissions.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Subscriptions</Text>
              <View style={styles.subscriptionContainer}>
                <View style={styles.subscriptionItem}>
                  <Ionicons name="close" size={18} color="red" />
                  <Text style={styles.subscriptionText}>Tree Planting Subscription</Text>
                </View>
                <View style={styles.subscriptionItem}>
                  <Ionicons name="close" size={18} color="red" />
                  <Text style={styles.subscriptionText}>Carbon Credit Subscription</Text>
                </View>
                <View style={styles.subscriptionItem}>
                  <Ionicons name="close" size={18} color="red" />
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
