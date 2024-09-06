import { useState, useEffect, useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getTopReferrers } from "@/api/referral";
import { ThemedView, ThemedText } from "../common";

const CommunityLeaders = () => {
  const [topReferrers, setTopReferrers] = useState<{ userId: string; name: string; totalReferrals: number }[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Fetch top referrers
      try {
        const referrersData = await getTopReferrers();
        setTopReferrers(referrersData);
      } catch (error) {
        console.error("Error fetching top referrers:", error);
      }
    };

    loadData();
  }, [focused]);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, [])
  );

  return (
    <View style={styles.leadersSection}>
      <ThemedText style={styles.sectionTitle}>Community Leaders</ThemedText>
      <ThemedView style={styles.leadersContainer}>
        <View>
          {topReferrers ? (
            topReferrers.map((referrer, index) => (
              <ThemedText key={referrer.userId} style={styles.leaderText}>
                <ThemedText style={styles.boldText}>{index + 1}.</ThemedText> {referrer.name} -{" "}
                {referrer.totalReferrals} Referrals
              </ThemedText>
            ))
          ) : (
            <ThemedText style={styles.leaderText}>
              <ThemedText style={styles.boldText}>There are no top referrers! Be the first one :)</ThemedText>
            </ThemedText>
          )}
        </View>
        <Pressable style={styles.referButton} onPress={() => router.push("/referral")}>
          <ThemedText style={styles.referButtonText}>Refer a friend!</ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );
};

export default CommunityLeaders;

const styles = StyleSheet.create({
  leadersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  leadersContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 24,
    alignItems: "center",
    borderRadius: 16,
  },
  leaderText: {
    fontSize: 18,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  referButton: {
    backgroundColor: "#409858",
    marginLeft: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 150,
  },
  referButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
