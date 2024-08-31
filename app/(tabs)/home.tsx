import { useState, useEffect } from "react";
import { View, Text, Pressable, useWindowDimensions, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { fetchEmissionsData } from "@/api/emissions";
import dayjs from "dayjs";
import { PieChartBreakdown, BarChartBreakdown, EarthBreakdown, LineChartBreakdown } from "@/components/breakdown";
import { getRandomFact } from "@/constants/facts";
import { TARGET_EMISSIONS } from "@/constants";
import { CarbonFootprint } from "@/components/home";
import { Russas, Colombia, Quebec, Hydro } from "@/constants/Images";

const windowWidth = Dimensions.get('window').width;

type EmissionGroup = 'Transportation' | 'Diet' | 'Energy';

interface Emissions {
  transportationEmissions: number;
  dietEmissions: number;
  energyEmissions: number;
}

function getHighestEmissionGroup(emissions: Emissions): EmissionGroup {
  const { transportationEmissions, dietEmissions, energyEmissions } = emissions;

  if (transportationEmissions >= dietEmissions && transportationEmissions >= energyEmissions) {
    return 'Transportation';
  } else if (dietEmissions >= transportationEmissions && dietEmissions >= energyEmissions) {
    return 'Diet';
  } else {
    return 'Energy';
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
  const [fact, setFact] = useState<string>(getRandomFact());
  const [highestEmissionGroup, setHighestEmissionGroup] = useState<EmissionGroup>('transportation');
  const handleNewFact = () => {
    setFact(getRandomFact());
  };

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

        const emissions: Emissions = {
          transportationEmissions: data.surveyEmissions.transportationEmissions || 0,
          dietEmissions: data.surveyEmissions.dietEmissions || 0,
          energyEmissions: data.surveyEmissions.energyEmissions || 0
        };
        setHighestEmissionGroup(getHighestEmissionGroup(emissions));
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


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Forever<Text style={styles.headerGreen}>green</Text>
          </Text>
        </View>

        {/* Fast Fact */}
        <View style={styles.fastFact}>
          <Text style={styles.fastFactTitle}>Forevergreen Fast Fact of the Day</Text>
          <Text style={styles.fastFactText}>{fact}</Text>
          <TouchableOpacity
            style={styles.factButton}
            onPress={handleNewFact} // Call the function directly
          >
            <Text style={styles.offsetButtonText}>See New Fact</Text>
          </TouchableOpacity>
        </View>

        {/* Carbon Footprint and Calculator */}
        <CarbonFootprint monthlyEmissions={monthlyEmissions} totalOffset={totalOffset} />

        {/* Monthly Graph of Emissions */}
        <View style={styles.emissionsGraph}>
          <Text style={styles.sectionTitle}>Your net-zero journey</Text>
          <View style={styles.graphContainer}>
            <LineChartBreakdown />
          </View>
          <TouchableOpacity
            style={styles.offsetButton}
            onPress={() => {
              router.push("/offset-now");
            }}
          >
            <Text style={styles.offsetButtonText}>Offset Now!</Text>
          </TouchableOpacity>
        </View>

        {/* Emissions vs Offset */}
        <View style={styles.carbonFootprint}>
          <Text style={styles.carbonFootprintTitle}>Your Carbon Footprint...</Text>
          <View style={styles.carbonFootprintContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emissions</Text>
              <Text style={styles.emissionText}>
                {monthlyEmissions.toFixed(2)}
                <Text style={styles.emissionUnit}> tons of CO₂</Text>
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Offsets</Text>
              <Text style={styles.offsetText}>
                {totalOffset.toFixed(2)}
                <Text style={styles.emissionUnit}> tons of CO₂</Text>
              </Text>
            </View>
          </View>

          {monthlyEmissions <= totalOffset ? (
            <Text style={styles.netZeroText}>You are net zero this month!</Text>
          ) : (
            <Text style={styles.netZeroText}>You are not net zero this month!</Text>
          )}

          <TouchableOpacity onPress={() => router.push("/offset-now")} style={styles.offsetButton}>
            <Text style={styles.offsetButtonText}>Offset Now!</Text>
          </TouchableOpacity>
        </View>

        {/* Community */}
        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Forevergreen Community</Text>
          <View style={styles.communityStatsContainer}>
            <View style={styles.communityStatBox}>
              <Text style={styles.statLargeText}>10,000</Text>
              <Text style={styles.statMediumText}>Total Emissions Calculated</Text>
            </View>
            <View style={styles.communityStatBox}>
              <Text style={styles.statLargeText}>10,000</Text>
              <Text style={styles.statMediumText}>Tons CO2 Gone</Text>
            </View>
          </View>
        </View>

        {/* Forevergreen Community Leaders/Referral */}
        <View style={styles.leadersSection}>
          <Text style={styles.sectionTitle}>Community Leaders</Text>
          <View style={styles.leadersContainer}>
            <View>
              <Text style={styles.leaderText}>
                <Text style={styles.boldText}>1.</Text> jpear - 10 Referrals
              </Text>
              <Text style={styles.leaderText}>
                <Text style={styles.boldText}>2.</Text> joegjoe - 9 Referrals
              </Text>
              <Text style={styles.leaderText}>
                <Text style={styles.boldText}>3.</Text> zyardley - 8 Referrals
              </Text>
            </View>
            <Pressable style={styles.referButton} onPress={() => router.push("/referral")}>
              <Text style={styles.referButtonText}>Refer a friend!</Text>
            </Pressable>
          </View>
        </View>
        
        
        {/* Prizes */}
        <View style={styles.chartsSection}>
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Be Net-Zero, Earn Prizes!</Text>
                <TouchableOpacity
                style={styles.prizeBox}
                onPress={() => {
                  router.push("/journey");
                }}
              >
                <Text style={styles.netZeroText}>3</Text>
                <Text style={styles.subtitleText}>Months Net-Zero</Text>
              </TouchableOpacity>

          


            </View>
          </View>
        {/* Charts */}
        <View style={styles.chartsSection}>
          {/* Your Breakdown Pie Chart */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Your Breakdown</Text>
            <View style={styles.pieChartContainer}>
              <PieChartBreakdown
                names={["Transportation", "Diet", "Energy"]}
                values={[transportationEmissions, dietEmissions, energyEmissions]}
                colors={["#44945F", "#AEDCA7", "#66A570"]}
                width={Math.round(width / 3)}
                height={100}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#44945F" }]} />
                  <Text>Transportation</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#AEDCA7" }]} />
                  <Text>Diet</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#66A570" }]} />
                  <Text>Energy</Text>
                </View>
              </View>
            </View>
          </View>

          {/* You vs the Average American */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>You vs the Average American</Text>
            <Text style={styles.chartSubtitle}>See how you rank vs the average American</Text>
            <BarChartBreakdown
              names={["You", "Average American"]}
              values={[totalEmissions - totalOffset, 21]}
              colors={["#44945F", "#A9A9A9"]}
              width={width - 128}
            />
          </View>

          {/* If everyone lived like you */}
          <View style={styles.chartBox}>
            <Text style={styles.chartText}>
              If everyone lived like you we'd need {((totalEmissions - totalOffset) / TARGET_EMISSIONS).toFixed(2)}{" "}
              Earths
            </Text>
            <EarthBreakdown emissions={totalEmissions - totalOffset} />
          </View>


        </View>

          {/* Tips */}
        <View style={styles.fastFact}>
          <Text style={styles.fastFactTitle}>Top 3 Ways to Reduce your Emissions</Text>
          <Text style={styles.fastFactText}>Your highest emissions source: {highestEmissionGroup}</Text>
          <Text style={styles.fastFactText}>Tip 1</Text>
          <Text style={styles.fastFactText}>Tip 2</Text>
          <Text style={styles.fastFactText}>Tip 3</Text>
        </View>
          
          {/* Credits */}
        <TouchableOpacity style={styles.creditBox} onPress={() => router.push("/carbon-credit")}>
          <Text style={styles.sectionTitle}>Explore Our Carbon Credits!</Text>
          <Text style={styles.subtitleText}>From Reforestation to Renewable Energy, Choose How You Offset Your Footprint!</Text>


                    <View style={styles.creditsContainer}>
                      <View style={styles.creditRow}>
                        <Image source={Russas} style={styles.creditIcon} />
                        <Image source={Colombia} style={styles.creditIcon} />
                      </View>
                      <View style={styles.creditRow}>
                      <Text style={styles.creditName}>The Russas Project</Text>
                      <Text style={styles.creditName}>Colombian Reforestation</Text>
                      </View>

                      <View style={styles.creditRow}>
                        <Image source={Quebec} style={styles.creditIcon} />
                        <Image source={Hydro} style={styles.creditIcon} />
                      </View>
                      <View style={styles.creditRow}>
                      <Text style={styles.creditName}>Canadian Energy & Waste</Text>
                      <Text style={styles.creditName}>Pamona Hydroelectric</Text>
                      </View>
                    </View>
        </TouchableOpacity>
          
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  headerGreen: {
    color: "#409858",
  },
  fastFact: {
    backgroundColor: "#eeeeee",
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
  },
  fastFactTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  fastFactText: {
    fontSize: 18,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    textAlign: "center",
  },
  netZeroText: {
    fontSize: 36,
    textAlign: "center",
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
  offsetButton: {
    marginTop: 10,
    backgroundColor: "#409858",
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  factButton: {
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#409858",
    borderRadius: 50,
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
  },
  offsetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
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
    marginBottom: 8,
  },
  statMediumText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  leadersSection: {
    marginBottom: 24,
  },
  leadersContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#eeeeee",
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
  chartsSection: {
    backgroundColor: "#eeeeee",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartBox: {
    backgroundColor: "white",
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
  carbonFootprint: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
    backgroundColor: "#e5e7eb",
  },
  carbonFootprintTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "700",
  },
  carbonFootprintContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emissionText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#b91c1c",
  },
  offsetText: {
    fontSize: 24,
    fontWeight: "700",
    color: "green",
  },
  emissionUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  creditIcon: {
    width: 200,
    height: 125,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  creditsContainer: {
    width: '100%',
  },
  creditBox: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
    backgroundColor: "#e5e7eb",
  },
  creditName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 16,
    alignItems: "center",
  },
  prizeBox: {
    backgroundColor: "#d4edda",
    borderRadius: 16,
    width: "40%",
    padding: 16,
    // ADD BUTTON IS GREEN OR RED IF NET ZERO
  },
});
