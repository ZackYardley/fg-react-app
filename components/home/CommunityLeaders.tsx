import { useState, useEffect, useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getTopReferrers } from "@/api/referral";
import { ThemedView, ThemedText } from "../common";
import { useThemeColor } from "@/hooks";
import { GreenButton } from "../auth";

const CommunityLeaders = () => {
  const [topReferrers, setTopReferrers] = useState<{ userId: string; name: string; totalReferrals: number }[]>([]);
  const [focused, setFocused] = useState(false);
  const primary = useThemeColor({}, "primary");

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
        <GreenButton
          onPress={() => router.push("/referral")}
          title="Refer a friend!"
          style={styles.referButton}
          textStyle={styles.referButtonText}
        />
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
    borderRadius: 50,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  referButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
