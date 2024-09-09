import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from "react-native";
import { getRecentPayments } from "@/api/payments";
import { fetchRecentInvoices } from "@/api/subscriptions";
import { Payment, Invoice, CarbonCredit } from "@/types";
import { BackButton, Loading, PageHeader, ThemedSafeAreaView, ThemedView, ThemedText } from "@/components/common";
import { formatDate, formatPrice } from "@/utils";
import { router } from "expo-router";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { fetchCarbonCreditsByPaymentId } from "@/api/products";

interface CertificateData {
  type: "payment" | "invoice";
  data: Payment | Invoice;
  carbonCredit?: CarbonCredit[];
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

        // Fetch carbon credit details for payments
        const historyWithCarbonCredits = await Promise.all(
          combinedHistory.map(async (item) => {
            if (item.type === "payment") {
              const carbonCredit = await fetchCarbonCreditsByPaymentId(item.data.id);
              return { ...item, carbonCredit };
            }
            return item;
          })
        );
        console.log(historyWithCarbonCredits);
        setPurchaseHistory(historyWithCarbonCredits);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const generateMultiPagePdf = async (items: CertificateData) => {
    try {
      // Generate HTML for each item
      items.carbonCredit = items.carbonCredit || [];
      const htmlPages = items.carbonCredit.map((credit) => generateHtml(credit));
      // Combine all HTML pages into a single string, separated by page breaks
      const combinedHtml = htmlPages.join('<div style="page-break-after: always;"></div>');
      // Generate PDF from combined HTML
      const file = await printToFileAsync({
        html: combinedHtml,
        base64: false,
      });
      // Share the generated PDF
      await shareAsync(file.uri);
    } catch (error) {
      console.error("Error generating multi-page PDF:", error);
    }
  };

  const generateHtml = (item: CarbonCredit) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${item.stripe_metadata_certificate_title || "Certificate of Verified Carbon Unit (VCU) Retirement"}</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              .certificate { border: 2px solid #000; padding: 40px; max-width: 800px; margin: 0 auto; position: relative; }
              .logo { position: absolute; top: 20px; height: 40px; }
              .logo-left { left: 20px; }
              .logo-right { right: 20px; }
              .logo-center { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); height: 60px; }
              .header { text-align: center; margin-top: 120px; margin-bottom: 30px; }
              .content { margin-bottom: 20px; }
              .content h2 { margin-bottom: 5px; }
              .content p { margin-top: 0; }
              .footer { text-align: center; margin-top: 40px; }
              .icon { position: absolute; bottom: 20px; right: 20px; width: 60px; height: 60px; }
          </style>
      </head>
      <body>
          <div class="certificate">
              <img src="${item.stripe_metadata_fg_logo}" alt="Forevergreen" class="logo logo-left">
              <img src="${item.stripe_metadata_mini_standard}" alt="Verra" class="logo logo-right">
              <img src="${item.stripe_metadata_standard_logo}" alt="Verified Carbon Standard" class="logo-center">
              
              <div class="header">
                  <h1>${item.stripe_metadata_certificate_title || "Certificate of Verified Carbon Unit (VCU) Retirement"}</h1>
                  <p>${item.stripe_metadata_quantity || "1"} Carbon Credit retired to offset ${item.stripe_metadata_quantity || "1"} Ton of CO2 on behalf of ${item.stripe_metadata_your_purchase || "Name"}</p>
              </div>
              
              <div class="content">
                  <h2>Project Name:</h2>
                  <p>${item.stripe_metadata_project_name}</p>
                  
                  <h2>VCU Serial Number:</h2>
                  <p>${item.stripe_metadata_serial_number}</p>
                  
                  <h2>Retirement Reason</h2>
                  <p>${item.stripe_metadata_retirement_reason}</p>
                  
                  <h2>${item.stripe_metadata_registry_title || "Registry Link"}:</h2>
                  <p><a href="${item.stripe_metadata_registry_link}">${item.stripe_metadata_registry_link}</a></p>
              </div>
              
              <img src="${item.stripe_metadata_cta}" alt="Energy Icon" class="icon">
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
        {isPayment(data) &&
          data.metadata.items?.map((credit: Credit, index: number) => (
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
        {item.carbonCredit && item.carbonCredit.length > 0 && (
          <View style={styles.carbonCreditsContainer}>
            <ThemedText style={styles.carbonCreditsTitle}>Carbon Credits:</ThemedText>
            {item.carbonCredit.map((credit, index) => (
              <ThemedText key={index} style={styles.carbonCreditItem}>
                {credit.stripe_metadata_project_name} - {credit.stripe_metadata_quantity || 1} ton(s)
              </ThemedText>
            ))}
          </View>
        )}
        <View style={styles.paymentMethodContainer}>
          <ThemedText style={styles.paymentMethod}>
            {isPayment(data) ? "Transaction ID:" : "Invoice Number:"}
          </ThemedText>
          <ThemedText style={styles.paymentMethod}>{isPayment(data) ? data.id : data.number}</ThemedText>
        </View>
        {item.carbonCredit && item.carbonCredit.length > 0 && (
          <TouchableOpacity style={styles.generateButton} onPress={() => generateMultiPagePdf(item)}>
            <ThemedText style={styles.generateButtonText}>Generate Certificates</ThemedText>
          </TouchableOpacity>
        )}
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
  carbonCreditsContainer: {
    marginTop: 10,
  },
  carbonCreditsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  carbonCreditItem: {
    fontSize: 14,
    marginLeft: 10,
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
