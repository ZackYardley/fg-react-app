import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, RadioButtonGroup, NextButton } from "@/components/carbon-calculator";
import { SurveyData, SurveyEmissions } from "@/types";
import { fetchEmissionsData, saveEmissionsData } from "@/api/emissions";
import { router } from "expo-router";
import { Loading } from "@/components/common";

export default function DietCalculator() {
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({
    diet: "",
  });
  const [surveyEmissions, setSurveyEmissions] = useState<Partial<SurveyEmissions>>({
    dietEmissions: 0,
  });
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [progress, setProgress] = useState(0.33);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmissionsData();
        if (data && data.surveyData && data.surveyEmissions) {
          setSurveyData(data.surveyData);
          setSurveyEmissions(data.surveyEmissions);
          setTransportationEmissions(data.surveyEmissions.transportationEmissions || 0);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const calculateDietEmissions = () => {
      let emissions = 0;
      switch (surveyData.diet) {
        case "Meat Lover 🍖 ":
          emissions = 3.3;
          break;
        case "Average 🍗 ":
          emissions = 2.5;
          break;
        case "No Beef Or Lamb 🐟🥗 ":
          emissions = 1.9;
          break;
        case "Vegetarian 🥕🥦 ":
          emissions = 1.7;
          break;
        case "Vegan 🌱🥑 ":
          emissions = 1.5;
          break;
        default:
          emissions = 2.5; // Default to average
      }
      setSurveyEmissions({ dietEmissions: emissions });
    };

    calculateDietEmissions();
  }, [surveyData.diet]);

  useEffect(() => {
    setIsFormValid(surveyData.diet !== "");
    setProgress(surveyData.diet ? 0.66 : 0.33);
  }, [surveyData.diet]);

  const handleNextButton = async () => {
    await saveEmissionsData({ surveyData: { ...surveyData }, surveyEmissions: { ...surveyEmissions } });
    router.push("/energy");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView>
        <View style={styles.contentContainer}>
          {/* Header */}
          <Header progress={progress} title="Diet" />
          <Text>Next up is your dietary emissions! These are all the emissions related to what you eat.</Text>

          {/* Diet Selection */}
          <RadioButtonGroup
            question="Select your Diet"
            options={["Meat Lover 🍖 ", "Average 🍗 ", "No Beef Or Lamb 🐟🥗 ", "Vegetarian 🥕🥦 ", "Vegan 🌱🥑 "]}
            value={surveyData.diet || "Average 🍗 "}
            onChange={(selectedDiet: string) => {
              setSurveyData({ ...surveyData, diet: selectedDiet });
            }}
          />

          {/* Emissions Display */}
          <View style={styles.emissionsContainer}>
            <Text style={styles.emissionsTitle}>Your Individual Diet Emissions</Text>
            <View style={styles.emissionsContent}>
              <View style={styles.emissionRow}>
                <Text>Transportation Emissions:</Text>
                <Text>{transportationEmissions.toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Diet Emissions:</Text>
                <Text>{surveyEmissions.dietEmissions?.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text>{(transportationEmissions || 0 + (surveyEmissions.dietEmissions || 0)).toFixed(2)}</Text>
                <Text>tons CO2 per year</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <NextButton isFormValid={isFormValid} onPress={handleNextButton} />
      </SafeAreaView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 48,
  },
  emissionsContainer: {
    marginTop: 32,
    marginBottom: 64,
  },
  emissionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emissionsContent: {
    marginTop: 16,
    rowGap: 16,
  },
  emissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 40,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  emissionLabel: {
    fontSize: 18,
    marginRight: 16,
  },
  emissionValue: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 18,
  },
  totalUnit: {
    fontSize: 18,
  },
});
