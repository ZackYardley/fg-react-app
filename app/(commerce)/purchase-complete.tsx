import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { BackButton, Loading, PageHeader, NotFoundComponent } from "@/components/common";
import { getPaymentById } from "@/api/payments";
import { fetchInvoiceById, fetchSubscriptionByInvoice } from "@/api/subscriptions";
import { fetchCarbonCreditSubscription, fetchSpecificCarbonCreditProduct } from "@/api/products";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pamona } from "@/constants/Images";
import { CarbonCreditSubscription, Subscription, Payment, CarbonCredit } from "@/types";
import { formatPrice } from "@/utils";
import { fetchEmissionsData } from "@/api/emissions";

interface CreditWithQuantity extends CarbonCredit {
  quantity: number;
}

const PurchaseCompleteScreen = () => {
  const { productType, paymentIntentId } = useLocalSearchParams<{ productType: string; paymentIntentId: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [carbonCreditSubscription, setCarbonCreditSubscription] = useState<CarbonCreditSubscription | null>(null);
  const [credits, setCredits] = useState<CreditWithQuantity[]>([]);
  const [totalCO2Offset, setTotalCO2Offset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!paymentIntentId) {
        console.error("No paymentIntentId provided");
        setLoading(false);
        return;
      }

      try {
        const fetchedPayment = await getPaymentById(paymentIntentId);
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
    const invoice = await fetchInvoiceById(fetchedPayment.invoice || "");
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    setPrice(invoice.amount_paid);

    const fetchedSubscription = await fetchSubscriptionByInvoice(invoice.subscription);
    if (!fetchedSubscription) {
      throw new Error("Subscription not found");
    }
    setSubscription(fetchedSubscription);

    const userEmissionsData = await fetchEmissionsData();
    if (userEmissionsData) {
      const userEmissions = userEmissionsData.totalEmissions;
      const carbonCreditSubscription = await fetchCarbonCreditSubscription(userEmissions);
      setCarbonCreditSubscription(carbonCreditSubscription?.product || null);
      setTotalCO2Offset(fetchedSubscription.quantity);
    } else {
      throw new Error("User Emissions not found");
    }
  };

  const fetchOneTimePurchaseData = async (fetchedPayment: Payment) => {
    const carbonCredits = fetchedPayment.metadata.items;
    if (carbonCredits) {
      const fetchedCredits = await Promise.all(
        carbonCredits.map(async (credit) => {
          const creditData = await fetchSpecificCarbonCreditProduct(credit.id);
          if (!creditData) {
            throw new Error(`Carbon credit with ID ${credit.id} does not exist`);
          }
          return { ...creditData, quantity: credit.quantity };
        })
      );
      setCredits(fetchedCredits);
      setTotalCO2Offset(carbonCredits.reduce((total, item) => total + item.quantity, 0));
    }
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
      <Ionicons name={icon} size={24} color="#000" />
      <Text style={styles.detailsText}>{text}</Text>
    </View>
  );

  const renderSubscriptionContent = () => (
    <>
      <View style={styles.subscriptionInfo}>
        <Text style={styles.subscriptionTitle}>Monthly Subscription</Text>
        <Text style={styles.subscriptionPrice}>
          {formatPrice(price || 0)}
          <Text style={styles.perMonth}>/month</Text>
        </Text>
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
        <Text>{totalCO2Offset} tons of CO</Text>
        <Text style={{ fontSize: 18 }}>2</Text>
        <Text> Offset Monthly</Text>
      </Text>
    </>
  );

  const renderOneTimePurchaseContent = () => (
    <>
      <View style={{ display: "flex", flexDirection: "row", gap: 32 }}>
        {credits.map((credit, index) => (
          <View key={index} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <LinearGradient
              colors={[credit.stripe_metadata_color_0, credit.stripe_metadata_color_1, credit.stripe_metadata_color_2]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradient}
            >
              <Image source={credit.images[0]} style={{ height: 104, width: 98 }} />
            </LinearGradient>
            <Text
              style={styles.itemDescription}
            >{`${credit.quantity} ${credit.stripe_metadata_carbon_credit_type} Credits`}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.offsetText}>
        <Text>{totalCO2Offset} tons of CO</Text>
        <Text style={{ fontSize: 18 }}>2</Text>
        <Text> Offset</Text>
      </Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }}>
        <PageHeader
          title="Thank you for your "
          titleAlt={productType === "subscription" ? "subscription!" : "purchase!"}
        />
        <BackButton />
        <View style={{ padding: 16 }}>
          <LinearGradient
            style={styles.card}
            colors={["#EFEFEF", "#E5F5F6"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {productType === "subscription" ? renderSubscriptionContent() : renderOneTimePurchaseContent()}
          </LinearGradient>

          <LinearGradient
            style={styles.infoContainer}
            colors={["#EFEFEF", "#E5F5F6"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {productType === "subscription" ? (
              <>
                <Text style={styles.infoTitle}>Subscription Details</Text>
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
              <Text style={styles.infoTitle}>
                You will be receiving an email with more
                <Text style={{ color: "#409858" }}> information shortly!</Text>
              </Text>
            )}
            <Image source={Pamona} style={styles.infoImage} />
            <View style={styles.buttonContainer}>
              <Link href="/home" style={styles.linkStyle}>
                <LinearGradient
                  style={styles.button}
                  colors={["#409858", "#B1E8C0"]}
                  start={{ x: 0.4, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                >
                  <Text style={styles.buttonText}>Back Home</Text>
                </LinearGradient>
              </Link>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PurchaseCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
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
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  linkStyle: {
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});
