import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BackButton, Loading, PageHeader, NotFoundComponent } from "@/components/common";
import { getPaymentById } from "@/api/payments";
import { Pamona } from "@/constants/Images";
import { CarbonCredit, Payment } from "@/types";
import { fetchSpecificCarbonCreditProduct } from "@/api/products";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreditWithQuantity extends CarbonCredit {
  quantity: number;
}

const PurchaseCompleteScreen = () => {
  const { paymentIntentId } = useLocalSearchParams<{ paymentIntentId: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [credits, setCredits] = useState<CreditWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentAndCredits = async () => {
      if (!paymentIntentId) {
        console.error("No paymentIntentId provided");
        setLoading(false);
        return;
      }

      const maxAttempts = 5;
      const retryDelay = 2000; // 2 seconds

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const fetchedPayment = await getPaymentById(paymentIntentId);
          if (fetchedPayment) {
            setPayment(fetchedPayment);

            const carbonCredits = fetchedPayment.metadata.items;
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
            break; // Exit the loop if successful
          } else {
            console.log(`Attempt ${attempt + 1}: Payment not found, retrying...`);
            if (attempt === maxAttempts - 1) {
              // This is the last attempt
              console.error("Payment not found after all attempts");
              Alert.alert("Error", "Unable to retrieve payment information. Please try again later.");
            } else {
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
          }
        } catch (error) {
          console.error("Error fetching payment or credits:", error);
          if (attempt === maxAttempts - 1) {
            Alert.alert(
              "Error",
              "An error occurred while retrieving your purchase information. Please try again later."
            );
          }
        }
      }
      setLoading(false);
    };

    fetchPaymentAndCredits();
  }, [paymentIntentId]);

  if (loading) {
    return <Loading />;
  }

  if (!payment) {
    return <NotFoundComponent />;
  }

  // Calculate total CO2 offset
  const totalCO2Offset = payment.metadata.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }}>
        <PageHeader title="Thank you for your " titleAlt="purchase!" />
        <BackButton />
        <View style={{ padding: 16 }}>
          <LinearGradient
            style={styles.card}
            colors={["#EFEFEF", "#E5F5F6"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 32 }}>
              {credits.map((credit, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <LinearGradient
                    colors={[
                      credit.stripe_metadata_color_0,
                      credit.stripe_metadata_color_1,
                      credit.stripe_metadata_color_2,
                    ]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}
                  >
                    <Image source={credit.images[0]} style={{ height: 104, width: 98 }} />
                  </LinearGradient>

                  <Text style={styles.itemDescription}>{`${
                    credit.quantity
                  } ${credit.stripe_metadata_carbon_credit_type} Credits`}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.offsetText}>
              <Text>{totalCO2Offset} tons of CO</Text>
              <Text style={{ fontSize: 18 }}>2</Text>
              <Text> Offset</Text>
            </Text>
          </LinearGradient>

          <LinearGradient
            style={styles.infoContainer}
            colors={["#EFEFEF", "#E5F5F6"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <Text style={styles.infoTitle}>
              You will be receiving an email with more
              <Text style={{ color: "#409858" }}> information shortly!</Text>
            </Text>
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
  gradient: {
    width: 148,
    height: 148,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  offsetText: {
    marginTop: 40,
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
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
    textAlign: "center",
    marginBottom: 20,
  },
  infoImage: {
    width: "100%",
    height: 216,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  linkStyle: {
    width: "80%",
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
});
