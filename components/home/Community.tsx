import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { fetchCommunityEmissionsData } from "@/api/emissions";
import { CommunityEmissionsData } from "@/types";
import { ThemedView, ThemedText } from "../common";

const Community = () => {
  const [communityEmissions, setCommunityEmissions] = useState<CommunityEmissionsData>();

  useEffect(() => {
    const loadData = async () => {
      // Fetch community emissions data
      try {
        const communityEmissions = await fetchCommunityEmissionsData();
        setCommunityEmissions({
          emissions_calculated: communityEmissions?.emissions_calculated || 0,
          emissions_offset: communityEmissions?.emissions_offset || 0,
          last_updated: communityEmissions?.last_updated || new Date(),
        });
      } catch (error) {
        console.error("Error fetching community emissions data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.communitySection}>
      <ThemedText style={styles.sectionTitle}>Forevergreen Community</ThemedText>
      <View style={styles.communityStatsContainer}>
        <ThemedView style={styles.communityStatBox}>
          {communityEmissions ? (
            <>
              <ThemedText style={styles.statLargeText}>{communityEmissions?.emissions_calculated.toFixed(0)}</ThemedText>
              <ThemedText style={styles.statMediumText}>Total Emissions Calculated</ThemedText>
            </>
          ) : (
            <ThemedText style={styles.statMediumText}>Loading...</ThemedText>
          )}
        </ThemedView>
        <ThemedView style={styles.communityStatBox}>
          {communityEmissions ? (
            <>
              <ThemedText style={styles.statLargeText}>{communityEmissions?.emissions_offset.toFixed(0)}</ThemedText>
              <ThemedText style={styles.statMediumText}>Tons CO2 Offset</ThemedText>
            </>
          ) : (
            <ThemedText style={styles.statMediumText}>Loading...</ThemedText>
          )}
        </ThemedView>
      </View>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  communitySection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  communityStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  communityStatBox: {
    borderRadius: 16,
    width: "47%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  statLargeText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  statMediumText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
