import { useState, useEffect } from "react";
import { View, useWindowDimensions, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import dayjs from "dayjs";
import { fetchEmissionsData } from "@/api/emissions";
import { PieChartBreakdown, BarChartBreakdown, EarthBreakdown, LineChartBreakdown } from "@/components/breakdown";
import {
  CarbonFootprint,
  Community,
  CommunityLeaders,
  EmissionsOffset,
  FastFact,
  Prizes,
  Credits,
  Tips,
} from "@/components/home";
import { PageHeader, ThemedSafeAreaView, ThemedText, ThemedView } from "@/components/common";
import { EmissionGroup, EmissionsDocument } from "@/types";
import { useThemeColor } from "@/hooks";

function getHighestEmissionGroup(emissions: EmissionsDocument): EmissionGroup {
  if (
    !emissions.surveyEmissions ||
    !emissions.surveyEmissions.transportationEmissions ||
    !emissions.surveyEmissions.dietEmissions ||
    !emissions.surveyEmissions.energyEmissions
  ) {
    return "Transportation";
  }
  const { transportationEmissions, dietEmissions, energyEmissions } = emissions.surveyEmissions;

  if (transportationEmissions >= dietEmissions && transportationEmissions >= energyEmissions) {
    return "Transportation";
  } else if (dietEmissions >= transportationEmissions && dietEmissions >= energyEmissions) {
    return "Diet";
  } else {
    return "Energy";
  }
}

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const [totalEmissions, setTotalEmissions] = useState(0.0);
  const [monthlyEmissions, setMonthlyEmissions] = useState(0.0);
  const [totalOffset, setTotalOffset] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0.0);
  const [dietEmissions, setDietEmissions] = useState(0.0);
  const [energyEmissions, setEnergyEmissions] = useState(0.0);
  const [highestEmissionGroup, setHighestEmissionGroup] = useState<string>();
  const [isNetZero, setIsNetZero] = useState(false);
  const [netZeroMonths, setNetZeroMonths] = useState(0);
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEmissionsData();
      if (data !== null) {
        setTotalEmissions(data.totalEmissions || 0);
        setMonthlyEmissions(data.monthlyEmissions || 0);
        setTotalOffset(data.totalOffset || 0);
        setTransportationEmissions(data.surveyEmissions.transportationEmissions || 0);
        setDietEmissions(data.surveyEmissions.dietEmissions || 0);
        setEnergyEmissions(data.surveyEmissions.energyEmissions || 0);

        const netZero = data.totalOffset >= data.monthlyEmissions;
        setIsNetZero(netZero);
        setHighestEmissionGroup(getHighestEmissionGroup(data));

        if (netZero && data.monthlyEmissions > 0) {
          const months = Math.floor(data.totalOffset - data.monthlyEmissions);
          setNetZeroMonths(Math.min(24, Math.max(0, months)));
        } else {
          setNetZeroMonths(0);
        }
      }
    };

    loadData();
  }, []);

  // Generate a list of 6 months ago to now
  const months = [];

  for (let i = 0; i < 6; i++) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  months.reverse();

  const displayNetZeroMonths = netZeroMonths === 24 ? "24+" : netZeroMonths.toString();

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <PageHeader />
          <FastFact />
          <CarbonFootprint monthlyEmissions={monthlyEmissions} totalOffset={totalOffset} />
          <LineChartBreakdown />

          <EmissionsOffset
            monthlyEmissions={monthlyEmissions}
            totalOffset={totalOffset}
            isNetZero={isNetZero}
            displayNetZeroMonths={displayNetZeroMonths}
            netZeroMonths={netZeroMonths}
          />

          <Community />
          <CommunityLeaders />
          <Prizes isNetZero={isNetZero} displayNetZeroMonths={displayNetZeroMonths} />

          {/* Charts */}
          <ThemedView style={styles.chartsSection}>
            {/* Your Breakdown Pie Chart */}
            <View style={[styles.chartBox, { backgroundColor }]}>
              <ThemedText style={styles.chartTitle}>Your Breakdown</ThemedText>
              <View style={styles.pieChartContainer}>
                <PieChartBreakdown
                  names={["Transportation", "Diet", "Energy"]}
                  values={[transportationEmissions, dietEmissions, energyEmissions]}
                  colors={["#22C55E", "#AEDCA7", "#66A570"]}
                  width={Math.round(width / 3)}
                  height={100}
                />
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#22C55E" }]} />
                    <ThemedText>Transportation</ThemedText>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#AEDCA7" }]} />
                    <ThemedText>Diet</ThemedText>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#66A570" }]} />
                    <ThemedText>Energy</ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* You vs the Average American */}
            <View style={[styles.chartBox, { backgroundColor }]}>
              <ThemedText style={styles.chartTitle}>You vs the Average American</ThemedText>
              <ThemedText style={styles.chartSubtitle}>See how you rank vs the average American</ThemedText>
              <BarChartBreakdown
                names={["You", "Average American"]}
                values={[totalEmissions - totalOffset, 21]}
                colors={["#22C55E", "#A9A9A9"]}
                width={width - 128}
                backgroundColor={backgroundColor}
              />
            </View>

            {/* If everyone lived like you */}
            <View style={[styles.chartBox, { backgroundColor }]}>
              <ThemedText style={styles.chartTitle}>Earth Breakdown</ThemedText>
              <EarthBreakdown emissions={totalEmissions - totalOffset} />
            </View>
          </ThemedView>

          {highestEmissionGroup && <Tips highestEmissionGroup={highestEmissionGroup} />}
          <Credits />
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  factButton: {
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#22C55E",
    borderRadius: 50,
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
  },
  chartsSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartBox: {
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
  pieChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
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
});
