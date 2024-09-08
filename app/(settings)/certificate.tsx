import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from "react-native";
import { getRecentPayments } from "@/api/payments";
import { fetchRecentInvoices } from "@/api/subscriptions";
import { Payment, Invoice } from "@/types";
import { BackButton, Loading, PageHeader, ThemedSafeAreaView, ThemedView, ThemedText } from "@/components/common";
import { formatDate, formatPrice } from "@/utils";
import { router } from "expo-router";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

interface CertificateData {
  type: "payment" | "invoice";
  data: Payment | Invoice;
}

interface Credit {
  name?: string;
  quantity: number;
  price: number;
}

function isPayment(data: Payment | Invoice): data is Payment {
  return (data as Payment).amount !== undefined;
}

function isInvoice(data: Payment | Invoice): data is Invoice {
  return (data as Invoice).total !== undefined;
}

const PurchaseHistoryScreen = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const [fetchedPayments, fetchedInvoices] = await Promise.all([getRecentPayments(), fetchRecentInvoices()]);

        const combinedHistory: CertificateData[] = [
          ...fetchedPayments.map((payment) => ({ type: "payment" as const, data: payment })),
          ...fetchedInvoices.map((invoice) => ({ type: "invoice" as const, data: invoice })),
        ];

        // Sort by date, most recent first
        combinedHistory.sort((a, b) => b.data.created - a.data.created);

        setPurchaseHistory(combinedHistory);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const generatePdf = async (item: CertificateData) => {
    try {
      const html = generateHtml(item);
      const file = await printToFileAsync({ 
        html: html,
        base64: false
      });
      await shareAsync(file.uri);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateHtml = (item: CertificateData) => {
    const data = item.data;
    const isPaymentData = isPayment(data);
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Carbon Offset Certificate</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              .certificate { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .content { margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 20px; }
          </style>
      </head>
      <body>
          <div class="certificate">
              <div class="header">
                  <h1>Carbon Offset Certificate</h1>
                  <h2>${isPaymentData ? "Payment" : "Invoice"} Details</h2>
              </div>
              <div class="content">
                  <p><strong>Date:</strong> ${formatDate(data.created)}</p>
                  <p><strong>Amount:</strong> ${isPaymentData ? formatPrice(data.amount) : formatPrice(data.total)}</p>
                  <p><strong>${isPaymentData ? "Transaction ID" : "Invoice Number"}:</strong> ${isPaymentData ? data.id : data.number}</p>
                  ${isPaymentData && data.metadata.items ? `
                    <h3>Credits</h3>
                    <ul>
                      ${data.metadata.items.map((credit: Credit) => `
                        <li>${credit.name || "Unknown Credit"}: ${credit.quantity} x ${formatPrice(credit.price)}</li>
                      `).join('')}
                    </ul>
                  ` : ''}
                  ${!isPaymentData && data.lines.data.length > 0 ? `
                    <p><strong>Description:</strong> ${data.lines.data[0].description}</p>
                  ` : ''}
              </div>
              <div class="footer">
                  <p>Thank you for your contribution to carbon offset!</p>
              </div>
          </div>
      </body>
      </html>
    `;
  };

  const renderPurchaseItem = ({ item }: { item: CertificateData }) => {
    const data = item.data;
    
    return (
      <ThemedView style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <ThemedText style={styles.date}>{formatDate(data.created)}</ThemedText>
          <ThemedText style={styles.amount}>
            {isPayment(data) ? formatPrice(data.amount) : formatPrice(data.total)}
          </ThemedText>
        </View>
        {isPayment(data) && data.metadata.items?.map((credit: Credit, index: number) => (
          <View key={index} style={styles.creditItem}>
            <ThemedText style={styles.creditName}>{credit.name || "Unknown Credit"}</ThemedText>
            <ThemedText style={styles.creditQuantity}>
              {credit.quantity} x {formatPrice(credit.price)}
            </ThemedText>
          </View>
        ))}
        {isInvoice(data) && data.lines.data.length > 0 && (
          <View style={styles.creditItem}>
            <ThemedText style={styles.creditName}>{data.lines.data[0].description}</ThemedText>
          </View>
        )}
        <View style={styles.paymentMethodContainer}>
          <ThemedText style={styles.paymentMethod}>
            {isPayment(data) ? "Transaction ID:" : "Invoice Number:"}
          </ThemedText>
          <ThemedText style={styles.paymentMethod}>
            {isPayment(data) ? data.id : data.number}
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={() => generatePdf(item)}
        >
          <ThemedText style={styles.generateButtonText}>Generate PDF</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <View style={{ flexGrow: 1 }}>
        <PageHeader subtitle="Purchase History" />
        <BackButton />
        {loading && <Loading />}
        <FlatList
          data={purchaseHistory}
          renderItem={renderPurchaseItem}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  paymentCard: {
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
  generateButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#22C55E",
    borderRadius: 8,
    height: 40,
    marginTop: 16,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PurchaseHistoryScreen;