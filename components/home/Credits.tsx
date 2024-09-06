import { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { fetchCarbonCreditProducts } from "@/api/products";
import { CarbonCredit } from "@/types";
import { ThemedView, ThemedText } from "../common";

const Credits = () => {
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Fetch carbon credit products
      try {
        const credits = await fetchCarbonCreditProducts();
        setCarbonCredits(credits.slice(0, 4)); // Get the first 4 credits for display
      } catch (error) {
        console.error("Error fetching carbon credits:", error);
      }
    };

    loadData();
  }, []);

  const renderCreditItem = (credit: CarbonCredit, index: number) => (
    <View key={index} style={styles.creditItem}>
      <LinearGradient
        colors={[credit.stripe_metadata_color_0, credit.stripe_metadata_color_1, credit.stripe_metadata_color_2]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Image source={{ uri: credit.images[0] }} style={styles.creditIcon} />
      </LinearGradient>
      <ThemedText style={styles.creditName}>{credit.name}</ThemedText>
    </View>
  );

  return (
    <TouchableOpacity onPress={() => router.navigate("/carbon-credit")}>
      <ThemedView style={styles.creditBox}>
        <View style={{ padding: 24 }}>
          <ThemedText style={styles.sectionTitle}>Explore Our Carbon Credits!</ThemedText>
          <ThemedText style={styles.subtitleText}>
            From Reforestation to Renewable Energy, Choose How You Offset Your Footprint!
          </ThemedText>
        </View>

        <View style={styles.creditsContainer}>
          {carbonCredits.length > 0 ? (
            carbonCredits.map((credit, index) => renderCreditItem(credit, index))
          ) : (
            <ThemedText>Loading carbon credits...</ThemedText>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default Credits;

const styles = StyleSheet.create({
  creditBox: {
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    textAlign: "center",
  },
  creditsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 16,
  },
  creditItem: {
    maxWidth: 120,
  },
  creditIcon: {
    width: 86,
    height: 92,
  },
  creditName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
