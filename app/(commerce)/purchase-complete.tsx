import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { getPaymentById } from "@/api/payments";
import { fetchInvoiceById, fetchSubscriptionByInvoice } from "@/api/subscriptions";
import { fetchCarbonCreditSubscription, fetchSpecificCarbonCreditProduct } from "@/api/products";
import { fetchEmissionsData } from "@/api/emissions";
import { Loading, PageHeader, NotFoundComponent, ThemedSafeAreaView } from "@/components/common";
import { Pamona } from "@/constants/Images";
import { CarbonCreditSubscription, Subscription, Payment, CarbonCredit, TransactionItem } from "@/types";
import { darkenColor, formatPrice } from "@/utils";
import { fetchCreditRequestByPaymentId } from "@/api/purchase";
import { ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";

interface CreditWithQuantity extends CarbonCredit {
  quantity: number;
}

const MAX_RETRIES = 10;
const RETRY_DELAY = 1000; // 1 seconds

const retryFetch = async (fetchFunction: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await fetchFunction();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return retryFetch(fetchFunction, retries - 1);
    }
    throw error;
  }
};

const PurchaseCompleteScreen = () => {
  const { productType, paymentIntentId } = useLocalSearchParams<{ productType: string; paymentIntentId: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [carbonCreditSubscription, setCarbonCreditSubscription] = useState<CarbonCreditSubscription | null>(null);
  const [credits, setCredits] = useState<CreditWithQuantity[]>([]);
  const [totalCO2Offset, setTotalCO2Offset] = useState(0);
  const [loading, setLoading] = useState(true);
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    const fetchData = async () => {
      if (!paymentIntentId) {
        console.error("No paymentIntentId provided");
        setLoading(false);
        return;
      }

      try {
        const fetchedPayment = await retryFetch(() => getPaymentById(paymentIntentId));
        if (!fetchedPayment) {
          throw new Error("Payment not found");
        }
        setPayment(fetchedPayment);

        if (productType === "subscription") {
          await fetchSubscriptionData(fetchedPayment);
        } else {
          await fetchOneTimePurchaseData(fetchedPayment);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while fetching purchase details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentIntentId, productType]);

  const fetchSubscriptionData = async (fetchedPayment: Payment) => {
    const invoice = await retryFetch(() => fetchInvoiceById(fetchedPayment.invoice || ""));
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    setPrice(invoice.amount_paid);

    const fetchedSubscription = await retryFetch(() => fetchSubscriptionByInvoice(invoice.subscription));
    if (!fetchedSubscription) {
      throw new Error("Subscription not found");
    }
    setSubscription(fetchedSubscription);

    const userEmissionsData = await fetchEmissionsData();
    if (userEmissionsData) {
      const userEmissions = userEmissionsData.totalEmissions;
      const carbonCreditSubscription = await retryFetch(() => fetchCarbonCreditSubscription(userEmissions));
      setCarbonCreditSubscription(carbonCreditSubscription?.product || null);
      setTotalCO2Offset(fetchedSubscription.items[0].plan.amount / 1000);
    } else {
      throw new Error("User Emissions not found");
    }
  };

  const fetchOneTimePurchaseData = async (fetchedPayment: Payment) => {
    const creditRequest = await retryFetch(() => fetchCreditRequestByPaymentId(fetchedPayment.id));
    if (!creditRequest) {
      throw new Error("Credit request not found");
    }

    const creditsWithDetails = await Promise.all(
      creditRequest.items.map(async (item: TransactionItem) => {
        const creditDetails = await fetchSpecificCarbonCreditProduct(item.id);
        return {
          ...creditDetails,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    setCredits(creditsWithDetails);
    setTotalCO2Offset(creditsWithDetails.reduce((total, item) => total + item.quantity, 0));
    setPrice(fetchedPayment.amount);
  };

  if (loading) {
    return <Loading />;
  }

  if (!payment) {
    return <NotFoundComponent />;
  }

  const SubscriptionDetailsItem = ({
    icon,
    text,
  }: {
    icon: "time-outline" | "calendar-outline" | "receipt-outline";
    text: string;
  }) => (
    <View style={styles.detailsItem}>
      <Ionicons name={icon} size={24} color={textColor} />
      <ThemedText style={styles.detailsText}>{text}</ThemedText>
    </View>
  );

  const renderSubscriptionContent = () => (
    <>
      <View style={styles.subscriptionInfo}>
        <ThemedText style={styles.subscriptionTitle}>Monthly Subscription</ThemedText>
        <ThemedText style={styles.subscriptionPrice}>
          {formatPrice(price || 0)}
          <Text style={styles.perMonth}>/month</Text>
        </ThemedText>
      </View>
      {carbonCreditSubscription && (
        <LinearGradient
          colors={[
            carbonCreditSubscription.stripe_metadata_color_0,
            carbonCreditSubscription.stripe_metadata_color_1,
            carbonCreditSubscription.stripe_metadata_color_2,
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <Image source={carbonCreditSubscription.images[0]} style={styles.creditImage} />
        </LinearGradient>
      )}
      <Text style={styles.offsetText}>
        <ThemedText>{totalCO2Offset} tons of CO</ThemedText>
        <ThemedText style={{ fontSize: 18 }}>2</ThemedText>
        <ThemedText> Offset Monthly</ThemedText>
      </Text>
    </>
  );

  const renderOneTimePurchaseContent = () => (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          rowGap: 12,
          columnGap: 32,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {credits.map((credit, index) => (
          <View
            key={index}
            style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", maxWidth: "47%" }}
          >
            <LinearGradient
              colors={[credit.stripe_metadata_color_0, credit.stripe_metadata_color_1, credit.stripe_metadata_color_2]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradient}
            >
              <Image source={credit.images[0]} style={{ height: 104, width: 98 }} />
            </LinearGradient>
            <ThemedText
              style={styles.itemDescription}
            >{`${credit.quantity} ${credit.stripe_metadata_carbon_credit_type} Credits`}</ThemedText>
          </View>
        ))}
      </View>
      <Text style={styles.offsetText}>
        <ThemedText>{totalCO2Offset} tons of CO</ThemedText>
        <ThemedText style={{ fontSize: 18 }}>2</ThemedText>
        <ThemedText> Offset</ThemedText>
      </Text>
    </>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }}>
        <PageHeader
          title="Thank you for your "
          titleAlt={productType === "subscription" ? "subscription!" : "purchase!"}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <LinearGradient
            style={styles.card}
            colors={[primaryContainer, darkenColor(primaryContainer, 10)]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {productType === "subscription" ? renderSubscriptionContent() : renderOneTimePurchaseContent()}
          </LinearGradient>

          <LinearGradient
            style={styles.infoContainer}
            colors={[primaryContainer, darkenColor(primaryContainer, 10)]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {productType === "subscription" ? (
              <>
                <ThemedText style={styles.infoTitle}>Subscription Details</ThemedText>
                {subscription && (
                  <>
                    <SubscriptionDetailsItem
                      icon="time-outline"
                      text={`Started on ${dayjs(subscription.current_period_start.seconds * 1000).format(
                        "MMMM D, YYYY"
                      )}`}
                    />
                    <SubscriptionDetailsItem
                      icon="calendar-outline"
                      text={`Next payment on ${dayjs(subscription.current_period_end.seconds * 1000).format(
                        "MMMM D, YYYY"
                      )}`}
                    />
                    <SubscriptionDetailsItem icon="receipt-outline" text="Billed Monthly" />
                  </>
                )}
              </>
            ) : (
              <ThemedText style={styles.infoTitle}>
                You will be receiving an email with more
                <Text style={{ color: "#409858" }}> information shortly!</Text>
              </ThemedText>
            )}
            <Image source={Pamona} style={styles.infoImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => router.push("/home")} style={styles.button}>
                <LinearGradient
                  style={styles.buttonGradient}
                  colors={["#409858", "#B1E8C0"]}
                  start={{ x: 0.4, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                >
                  <ThemedText style={styles.buttonText}>Back Home</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default PurchaseCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  subscriptionInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  subscriptionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subscriptionPrice: {
    fontSize: 30,
    fontWeight: "bold",
  },
  perMonth: {
    fontSize: 18,
    fontWeight: "normal",
  },
  gradient: {
    width: 148,
    height: 148,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
  },
  creditImage: {
    height: 104,
    width: 98,
  },
  offsetText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginVertical: 50,
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  detailsText: {
    marginLeft: 10,
    fontSize: 16,
  },
  infoImage: {
    width: "100%",
    height: 216,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    width: "80%",
    maxWidth: 300,
    minWidth: 200, // Ensure a minimum width
    height: 50, // Set a fixed height
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemDescription: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
