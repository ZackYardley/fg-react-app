import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { getRecentPayments } from "@/api/payments";
import { fetchSpecificCarbonCreditProduct } from "@/api/products";
import { Payment, CarbonCredit, CartItem } from "@/types";
import { BackButton, Loading, PageHeader } from "@/components/common";
import { formatDate, formatPrice } from "@/utils";

interface PaymentWithCarbonCredit extends Omit<Payment, "metadata"> {
  metadata: {
    items: (CarbonCredit & CartItem)[];
  };
}

const PurchaseHistoryScreen = () => {
  const [paymentsWithCarbonCredits, setPaymentsWithCarbonCredits] = useState<PaymentWithCarbonCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const payments = await getRecentPayments();
        const updatedPayments = await Promise.all(
          payments.map(async (payment) => {
            const updatedItems = await Promise.all(
              payment.metadata.items.map(async (item) => {
                const productInfo = await fetchSpecificCarbonCreditProduct(item.id);
                return { ...item, ...productInfo } as CarbonCredit & CartItem;
              })
            );
            return {
              ...payment,
              metadata: { ...payment.metadata, items: updatedItems },
            } as PaymentWithCarbonCredit;
          })
        );
        setPaymentsWithCarbonCredits(updatedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const renderPaymentItem = ({ item }: { item: PaymentWithCarbonCredit }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.date}>{formatDate(item.created)}</Text>
        <Text style={styles.amount}>{formatPrice(item.amount)}</Text>
      </View>
      {item.metadata.items.map((credit, index) => (
        <View key={index} style={styles.creditItem}>
          <Text style={styles.creditName}>{credit?.name || "Unknown Credit"}</Text>
          <Text style={styles.creditQuantity}>
            {credit.quantity} x{" "}
            {formatPrice(credit.prices.filter((price) => price.active)[0].unit_amount * credit.quantity)}
          </Text>
        </View>
      ))}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethod}>Transaction ID:</Text>
        <Text style={styles.paymentMethod}>{item.id}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader subtitle="Purchase History" />
      <BackButton />
      <FlatList
        data={paymentsWithCarbonCredits}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: "#6E6E77",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  creditItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  creditName: {
    fontSize: 16,
  },
  creditQuantity: {
    fontSize: 16,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  paymentMethod: {
    fontSize: 16,
    color: "#6E6E77",
  },
});

export default PurchaseHistoryScreen;
