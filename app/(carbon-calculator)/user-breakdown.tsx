import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, useWindowDimensions } from "react-native";
import { fetchEmissionsData } from "@/api/emissions";
import { PieChartBreakdown, BarChartBreakdown, EarthBreakdown, LineChartBreakdown } from "@/components/breakdown";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AVERAGE_AMERICAN_EMISSIONS, TARGET_EMISSIONS } from "@/constants";
import { router } from "expo-router";
import dayjs from "dayjs";
import { PageHeader, BackButton, Loading } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserBreakdownScreen() {
  const { width } = useWindowDimensions();
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [monthlyEmissions, setMonthlyEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [energyEmissions, setEnergyEmissions] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalOffset, setTotalOffset] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEmissionsData();
      if (data !== null) {
        setTotalEmissions(data.totalEmissions);
        setMonthlyEmissions(data.monthlyEmissions);
        setTotalOffset(data.totalOffset || 0);
        setTransportationEmissions(data.surveyEmissions.transportationEmissions || 0);
        setDietEmissions(data.surveyEmissions.dietEmissions || 0);
        setEnergyEmissions(data.surveyEmissions.energyEmissions || 0);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!dataLoaded) {
    return <Loading />;
  }

  const netImpact = monthlyEmissions - totalOffset;
  const isPositiveImpact = netImpact <= 0;

  // Generate a list of 6 months ago to now
  const months = [];

  for (let i = 0; i < 6; i++) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  months.reverse();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container}>
        <View style={styles.emissions}>
          <PageHeader title="Forever" titleAlt="green" subtitle="Your Breakdown" />
          <Text style={styles.welcomeUser}>Welcome, {userName}! Here is your carbon footprint breakdown.</Text>
          <BackButton />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Annual Footprint</Text>
            <Text style={styles.cardText}>Your total emissions this year:</Text>
            <Text style={styles.emissionsStat}>{totalEmissions.toFixed(1)}</Text>
            <Text style={styles.emissionsLabel}>tons of CO2</Text>
          </View>

          <View style={styles.cardSideBySide}>
            <View style={styles.communityStatsContainer}>
              <View style={styles.communityStatBox}>
                <Text style={styles.cardTitle}>Monthly Carbon Emissions</Text>
              </View>
              <View style={styles.communityStatBox}>
                <Text style={styles.emissionsStat}>{monthlyEmissions.toFixed(1)}</Text>
                <Text style={styles.emissionsLabel}>tons of CO2</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardSideBySide}>
            <View style={styles.communityStatsContainer}>
              <View style={styles.communityStatBox}>
                <Text style={styles.cardTitle}>Monthly Carbon Offsets</Text>
              </View>
              <View style={styles.communityStatBox}>
                <Text style={styles.emissionsStat}>{totalOffset.toFixed(1)}</Text>
                <Text style={styles.emissionsLabel}>tons of CO2</Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={[styles.card, isPositiveImpact ? styles.positiveImpact : styles.negativeImpact]}>
            <Text style={styles.cardTitle}>Net Impact this month</Text>
            <Text style={styles.emissionsStat}>{Math.abs(netImpact).toFixed(1)}</Text>
            <Text style={styles.emissionsLabel}>tons of CO2</Text>
            <Text style={styles.emissionsLabel}>
              {isPositiveImpact ? "You are net Net-Zero! 😊" : "You are not Net-Zero 😥"}
            </Text>
          </View>

          {/* Monthly Graph of Emissions */}
          <View style={styles.emissionsGraph}>
            <Text style={styles.sectionTitle}>Your net-zero journey</Text>
            <View style={styles.graphContainer}>
              <LineChartBreakdown />
            </View>
          </View>

          {/* Emission Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Emission Breakdown</Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <PieChartBreakdown
                names={["Transportation", "Diet", "Energy"]}
                values={[transportationEmissions, dietEmissions, energyEmissions]}
                colors={["#44945F", "#AEDCA7", "#66A570"]}
                height={220}
                width={screenWidth}
              />
            </View>
            <View style={styles.legendContainer}>
              {[
                { name: "Transportation", color: "#44945F" },
                { name: "Diet", color: "#AEDCA7" },
                { name: "Energy", color: "#66A570" },
              ].map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Average American */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>You vs the Average American</Text>
            <Text style={styles.chartSubtitle}>See how you rank vs the average American</Text>
            <BarChartBreakdown
              names={["You", "Average American"]}
              values={[totalEmissions - totalOffset, AVERAGE_AMERICAN_EMISSIONS]}
              colors={["#44945F", "#A9A9A9"]}
              width={width - 128}
            />
          </View>

          {/* Earth Breakdown */}
          <View style={styles.card}>
            <Text style={styles.earthBreakdownTitle}>Earth Breakdown</Text>
            <EarthBreakdown emissions={totalEmissions || 0} />
          </View>

          {/* Call to Action */}
          <View style={styles.card}>
            <Text style={styles.ctaTitle}>Help us help you change the World 🌍</Text>
            <Text style={styles.ctaText}>Support green projects around the world!</Text>

            <TouchableOpacity
              onPress={() => {
                router.push("/offset-now");
              }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>Learn More</Text>
            </TouchableOpacity>
            <Text style={styles.ctaText}>
              Build your legacy and leave a lasting impact by planting your own forest.
            </Text>

            <TouchableOpacity
              onPress={() => {
                router.replace("/carbon-credit");
              }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>Start the Pledge today!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 24,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  welcomeUser: {
    fontSize: 16,
    alignSelf: "center",
  },
  greenText: {
    color: "#409858",
  },
  card: {
    backgroundColor: "#eeeeee",
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },

  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  positiveImpact: {
    backgroundColor: "#d4edda", // Light green for positive impact
  },
  negativeImpact: {
    backgroundColor: "#f8d7da", // Light red for negative impact
  },
  impactText: {
    fontWeight: "bold",
  },
  separator: {
    height: 2,
    backgroundColor: "#000000", // You can change this color as needed
    marginVertical: 10, // Adjust the vertical margin as needed
    width: "100%",
  },

  communitySection: {
    marginBottom: 10,
  },
  communityStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  communityStatBox: {
    backgroundColor: "#eeeeee",
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
    marginBottom: 10,
  },
  statMediumText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  emissions: {
    padding: 24,
  },
  cardSideBySide: {
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#eeeeee",
    borderRadius: 16,
    width: "47%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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

  // Pie Chart
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

  // Earth Breakdown
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
  // CTA
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
    backgroundColor: "#44945F",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: "80%",
  },
  ctaButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  emissionsGraph: {
    backgroundColor: "#eeeeee",
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  graphContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  //Average American
  chartBox: {
    backgroundColor: "#eeeeee",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  chartSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartText: {
    fontSize: 18,
    marginBottom: 16,
  },
});
