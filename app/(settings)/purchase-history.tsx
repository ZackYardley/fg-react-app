import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { getRecentPayments } from "@/api/payments";
import { fetchRecentInvoices } from "@/api/subscriptions";
import { Payment, Invoice } from "@/types";
import { BackButton, Loading, PageHeader } from "@/components/common";
import { formatDate, formatPrice } from "@/utils";

interface PurchaseItem {
  type: "payment" | "invoice";
  data: Payment | Invoice;
}

const PurchaseHistoryScreen = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const [fetchedPayments, fetchedInvoices] = await Promise.all([getRecentPayments(), fetchRecentInvoices()]);

        const combinedHistory: PurchaseItem[] = [
          ...fetchedPayments.map((payment) => ({ type: "payment" as const, data: payment })),
          ...fetchedInvoices.map((invoice) => ({ type: "invoice" as const, data: invoice })),
        ];

        // Sort by date, most recent first
        combinedHistory.sort((a, b) => {
          const dateA = a.type === "payment" ? a.data.created : a.data.created;
          const dateB = b.type === "payment" ? b.data.created : b.data.created;
          return dateB - dateA;
        });

        setPurchaseHistory(combinedHistory);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const renderPurchaseItem = ({ item }: { item: PurchaseItem }) => {
    if (item.type === "payment") {
      return renderPaymentItem(item.data as Payment);
    } else {
      return renderInvoiceItem(item.data as Invoice);
    }
  };

  const renderPaymentItem = (item: Payment) =>
    item.metadata.items ? (
      <View style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <Text style={styles.date}>{formatDate(item.created)}</Text>
          <Text style={styles.amount}>{formatPrice(item.amount)}</Text>
        </View>
        {item.metadata.items.map((credit, index) => (
          <View key={index} style={styles.creditItem}>
            <Text style={styles.creditName}>{credit?.name || "Unknown Credit"}</Text>
            <Text style={styles.creditQuantity}>
              {credit.quantity} x {formatPrice(credit.price)}
            </Text>
          </View>
        ))}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethod}>Transaction ID:</Text>
          <Text style={styles.paymentMethod}>{item.id}</Text>
        </View>
      </View>
    ) : null;

  const renderInvoiceItem = (item: Invoice) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.date}>{formatDate(item.created)}</Text>
        <Text style={styles.amount}>{formatPrice(item.total)}</Text>
      </View>
      {item.lines.data.length > 0 && (
        <View style={styles.creditItem}>
          <Text style={styles.creditName}>{item.lines.data[0].description}</Text>
        </View>
      )}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethod}>Invoice Number:</Text>
        <Text style={styles.paymentMethod}>{item.number}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexGrow: 1 }}>
        <PageHeader subtitle="Purchase History" />
        <BackButton />
        <FlatList
          data={purchaseHistory}
          renderItem={renderPurchaseItem}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
