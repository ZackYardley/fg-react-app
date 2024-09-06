import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { fetchEmissionsData } from "@/api/emissions";
import { PieChartBreakdown, BarChartBreakdown, EarthBreakdown } from "@/components/breakdown";
import CalculatingScreen from "@/components/carbon-calculator/Calculating";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ConfettiCannon from "react-native-confetti-cannon";
import { AVERAGE_AMERICAN_EMISSIONS } from "@/constants";
import { ThemedSafeAreaView, ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";

const Breakdown = () => {
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [monthlyEmissions, setMonthlyEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [energyEmissions, setEnergyEmissions] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "primaryContainer");

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
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      explosionRef.current?.start();
    }
  }, [dataLoaded]);

  const width = useWindowDimensions().width;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAnonymous(user.isAnonymous);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!dataLoaded) {
    return <CalculatingScreen />;
  }

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="arrow-left" size={24} color={textColor} onPress={() => router.back()} />
            <ThemedText style={styles.headerTitle}>Results</ThemedText>
          </View>

          <View style={styles.contentContainer}>
            {/* Carbon Footprint */}
            <View style={[styles.card, {backgroundColor}]}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>Your Carbon Footprint</ThemedText>
              <ThemedText>Your total emissions are:</ThemedText>
              <ThemedText style={styles.greenText}>{totalEmissions.toFixed(2)} tons co2/year</ThemedText>
              <ThemedText>Your total monthly emissions are:</ThemedText>
              <ThemedText style={styles.greenText}>{monthlyEmissions.toFixed(2)} tons co2/month</ThemedText>
            </View>

            {/* Emission Breakdown */}
            <View style={[styles.card, {backgroundColor}]}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>Your Emission Breakdown</ThemedText>
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <PieChartBreakdown
                  names={["Transportation", "Diet", "Energy"]}
                  values={[transportationEmissions, dietEmissions, energyEmissions]}
                  colors={["#44945F", "#AEDCA7", "#66A570"]}
                  height={220}
                  width={width}
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
                    <ThemedText>{item.name}</ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Average American */}
            <View style={[styles.card, {backgroundColor}]}>
              <ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>You vs the Average American</ThemedText>
              <View style={styles.legendContainer}>
                {[
                  { name: "You", color: "#44945F" },
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
                  colors={["#44945F", "#A9A9A9"]}
                  width={width - 104}
                />
              </View>
            </View>

            {/* Earth Breakdown */}
            <View style={[styles.card, {backgroundColor}]}>
              <ThemedText style={styles.earthBreakdownTitle}>Earth Breakdown</ThemedText>
              <EarthBreakdown emissions={totalEmissions || 0} />
            </View>

            {/* Call to Action */}
            <View style={[styles.card, {backgroundColor}]}>
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
                style={styles.ctaButton}
              >
                <ThemedText style={styles.ctaButtonText}>Learn More</ThemedText>
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
                style={styles.ctaButton}
              >
                <ThemedText style={styles.ctaButtonText}>Start the Pledge today!</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Next Button */}
        <View style={styles.nextButton}>
          <TouchableOpacity
            onPress={() => {
              if (isAnonymous) {
                router.navigate("/signup");
              } else {
                router.replace("/home");
              }
            }}
          >
            <View style={styles.nextButtonInner}>
              <Icon name="arrow-right" size={30} color={"#000"} />
            </View>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 24,
    paddingTop: 8,
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
  greenText: {
    color: "#16a34a",
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
    backgroundColor: "#44945F",
  },
  ctaButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextButton: {
    alignItems: "flex-end",
    marginBottom: 40,
    marginRight: 40,
  },
  nextButtonInner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 2,
    height: 64,
    width: 64,
    borderColor: "black",
    backgroundColor: "#409858",
    justifyContent: "center",
    alignItems: "center",
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // Ensure it is on top of everything else
  },
});

export default Breakdown;
