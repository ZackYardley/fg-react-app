import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { fetchEmissionsData } from "@/api/emissions";
import { PieChartBreakdown, BarChartBreakdown, EarthBreakdown, StyledEmissions } from "@/components/breakdown";
import CalculatingScreen from "@/components/carbon-calculator/Calculating";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ConfettiCannon from "react-native-confetti-cannon";
import { AVERAGE_AMERICAN_EMISSIONS } from "@/constants";
import { BackButton, Loading, PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import { StatusBar } from "expo-status-bar";
import { darkenColor } from "@/utils";
import { NextButton } from "@/components/carbon-calculator";

const Breakdown = () => {
  const { from } = useLocalSearchParams<{ from: string }>();
  const { width } = useWindowDimensions();

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [monthlyEmissions, setMonthlyEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [energyEmissions, setEnergyEmissions] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalOffset, setTotalOffset] = useState(0);
  const [userName, setUserName] = useState("");

  const backgroundColor = useThemeColor({}, "background");
  const onPrimary = useThemeColor({}, "onPrimary");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");

  const explosionRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEmissionsData();
      if (data) {
        setTotalEmissions(data.totalEmissions || 0);
        setMonthlyEmissions(data.monthlyEmissions || 0);
        setTransportationEmissions(data.surveyEmissions.transportationEmissions || 0);
        setDietEmissions(data.surveyEmissions.dietEmissions || 0);
        setEnergyEmissions(data.surveyEmissions.energyEmissions || 0);
        setTotalOffset(data.totalOffset || 0);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (dataLoaded && from === "survey") {
      explosionRef.current?.start();
    }
  }, [dataLoaded, from]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAnonymous(user.isAnonymous);
        setUserName(user.displayName || "User");
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!dataLoaded) {
    if (from === "survey") {
      return <CalculatingScreen />;
    } else {
      return <Loading />;
    }
  }

  const netImpact = monthlyEmissions - totalOffset;

  // Generate a list of 6 months ago to now
  const months = [];
  for (let i = 0; i < 6; i++) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  months.reverse();

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <ScrollView style={styles.scrollView}>
        <PageHeader
          title="Forever"
          titleAlt="green"
          subtitle="Your Breakdown"
          description={from !== "survey" ? `Welcome, ${userName}! Here is your carbon footprint breakdown.` : undefined}
        />
        <BackButton />

        <View style={styles.contentContainer}>
          <View style={styles.container}>
            {from !== "survey" && (
              <StyledEmissions
                monthlyEmissions={monthlyEmissions}
                totalEmissions={totalEmissions}
                totalOffset={totalOffset}
                netImpact={netImpact}
              />
            )}

            {/* Carbon Footprint */}
            <ThemedView style={styles.card}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>Your Carbon Footprint</ThemedText>
              <ThemedText>Your total emissions are:</ThemedText>
              <ThemedText style={[styles.greenText, { color: primary }]}>
                {totalEmissions.toFixed(2)} tons co2/year
              </ThemedText>
              <ThemedText>Your total monthly emissions are:</ThemedText>
              <ThemedText style={[styles.greenText, { color: primary }]}>
                {monthlyEmissions.toFixed(2)} tons co2/month
              </ThemedText>
            </ThemedView>

            {/* Emission Breakdown */}
            <ThemedView style={styles.card}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>Your Emission Breakdown</ThemedText>
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <PieChartBreakdown
                  names={["Transportation", "Diet", "Energy"]}
                  values={[transportationEmissions, dietEmissions, energyEmissions]}
                  colors={[darkenColor(primary, 0), darkenColor(primary, 20), darkenColor(primary, 40)]}
                  height={220}
                  width={width}
                />
              </View>
              <View style={styles.legendContainer}>
                {[
                  { name: "Transportation", color: darkenColor(primary, 0) },
                  { name: "Diet", color: darkenColor(primary, 20) },
                  { name: "Energy", color: darkenColor(primary, 40) },
                ].map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <ThemedText>{item.name}</ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>

            {/* Average American */}
            <ThemedView style={styles.card}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>You vs the Average American</ThemedText>
              <View style={styles.legendContainer}>
                {[
                  { name: "You", color: primary },
                  { name: "Average American", color: "#A9A9A9" },
                ].map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <ThemedText>{item.name}</ThemedText>
                  </View>
                ))}
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChartBreakdown
                  names={["You", "Average American"]}
                  values={[totalEmissions, AVERAGE_AMERICAN_EMISSIONS]}
                  colors={[primary, "#A9A9A9"]}
                  width={width - 104}
                  backgroundColor={card}
                />
              </View>
            </ThemedView>

            {/* Earth Breakdown */}
            <ThemedView style={styles.card}>
              <ThemedText style={styles.earthBreakdownTitle}>Earth Breakdown</ThemedText>
              <EarthBreakdown emissions={totalEmissions || 0} />
            </ThemedView>

            {/* Call to Action */}
            <ThemedView style={styles.card}>
              <ThemedText style={styles.ctaTitle}>Help us help you change the World 🌍</ThemedText>
              <ThemedText style={styles.ctaText}>Support green projects around the world!</ThemedText>

              <TouchableOpacity
                onPress={() => {
                  if (isAnonymous) {
                    router.navigate("/signup");
                  } else {
                    router.navigate("/offset-now");
                  }
                }}
              >
                <View style={[styles.ctaButton, { backgroundColor: primary }]}>
                  <ThemedText style={[styles.ctaButtonText, { color: onPrimary }]}>Learn More</ThemedText>
                </View>
              </TouchableOpacity>
              <ThemedText style={styles.ctaText}>
                Build your legacy and leave a lasting impact by planting your own forest.
              </ThemedText>

              <TouchableOpacity
                onPress={() => {
                  if (isAnonymous) {
                    router.navigate("/signup");
                  } else {
                    router.replace("/tree-planting");
                  }
                }}
              >
                <View style={[styles.ctaButton, { backgroundColor: primary }]}>
                  <ThemedText style={[styles.ctaButtonText, { color: onPrimary }]}>Start the Pledge today!</ThemedText>
                </View>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </View>
        {/* Next Button */}
        <NextButton
          onPress={() => {
            if (isAnonymous) {
              router.navigate("/signup");
            } else {
              if (from === "survey") {
                router.replace("/home");
              } else {
                router.navigate("/home");
              }
            }
          }}
        />
      </ScrollView>
      <View style={styles.confettiContainer} pointerEvents="none">
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: 0 }}
          autoStart={false}
          ref={explosionRef}
          fadeOut
          fallSpeed={3000}
          explosionSpeed={1}
        />
      </View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    columnGap: 24,
  },
  headerTitle: {
    fontSize: 36,
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  card: {
    elevation: 5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  emissionsStat: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  emissionsLabel: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  cardSideBySide: {
    marginBottom: 16,
  },
  communityStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  communityStatBox: {
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  separator: {
    height: 2,
    marginVertical: 16,
    width: "100%",
  },
  positiveImpact: {
    backgroundColor: "#d4edda",
  },
  negativeImpact: {
    backgroundColor: "#f8d7da",
  },

  greenText: {
    fontSize: 20,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    height: 16,
    width: 16,
    marginRight: 8,
  },
  earthBreakdownTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  earthBreakdownText: {
    marginBottom: 16,
    fontSize: 18,
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  ctaButton: {
    borderRadius: 9999,
    paddingVertical: 12,
    marginBottom: 16,
  },
  ctaButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // Ensure it is on top of everything else
  },
});

export default Breakdown;
