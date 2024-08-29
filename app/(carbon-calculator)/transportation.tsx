import { useState, useEffect } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, RadioButtonGroup, NumberInput, TransportQuestion, NextButton } from "@/components/carbon-calculator";
import QuestionSliderColor from "@/components/carbon-calculator/QuestionSliderColor";
import { fetchEmissionsData, saveEmissionsData } from "@/api/emissions";
import { SurveyData, SurveyEmissions } from "@/types";
import { Loading } from "@/components/common";
import { router } from "expo-router";

export default function TransportationCalculator() {
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({
    longFlights: 0,
    shortFlights: 0,
    carType: "Gas - ⛽️",
    milesPerWeek: "300",
    useTrain: "No",
    trainFrequency: "",
    useBus: "No",
    busFrequency: "",
    walkBike: "No",
    walkBikeFrequency: "",
  });
  const [surveyEmissions, setSurveyEmissions] = useState<Partial<SurveyEmissions>>({
    flightEmissions: 0,
    carEmissions: 0,
    publicTransportEmissions: 0,
    transportationEmissions: 0,
  });
  const [progress, setProgress] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState({
    longFlights: false,
    shortFlights: false,
    carType: false,
    milesPerWeek: false,
    useTrain: false,
    useBus: false,
    walkBike: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmissionsData();
        if (data && data.surveyData && data.surveyEmissions) {
          setSurveyData(data.surveyData);
          setSurveyEmissions(data.surveyEmissions);
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
    const calculateTransportationEmissions = () => {
      if (!surveyData) {
        return;
      }
      let flightEmissions = 0;
      let carEmissions = 0;
      let publicTransportEmissions = 0;

      if (surveyData.longFlights) {
        flightEmissions += surveyData.longFlights * 1.35;
      }

      if (surveyData.shortFlights) {
        flightEmissions += surveyData.shortFlights * 0.9;
      }

      if (surveyData.carType && surveyData.milesPerWeek) {
        let carEmissionRates = 0;

        switch (surveyData.carType) {
          case "Gas - ⛽️":
            carEmissionRates = 300;
            break;
          case "Hybrid - ⛽️&⚡":
            carEmissionRates = 250;
            break;
          case "Electric - ⚡":
            carEmissionRates = 200;
            break;
          default:
            carEmissionRates = 300; // Default to gas
        }

        carEmissions = (carEmissionRates * parseFloat(surveyData.milesPerWeek) * 52) / 1000000;
      }

      if (surveyData.useTrain && surveyData.trainFrequency) {
        const trainEmissions = parseFloat(surveyData.trainFrequency) * 0.002912 * 52;
        if (surveyData.useBus && surveyData.busFrequency) {
          const busEmissions = parseFloat(surveyData.busFrequency) * 0.005824 * 52;
          publicTransportEmissions = trainEmissions + busEmissions;
        } else {
          publicTransportEmissions = trainEmissions;
        }
      }

      setSurveyEmissions({
        flightEmissions,
        carEmissions,
        publicTransportEmissions,
        transportationEmissions: flightEmissions + carEmissions + publicTransportEmissions,
      });
    };

    calculateTransportationEmissions();
  }, [surveyData]);

  useEffect(() => {
    const totalQuestions = Object.keys(completedQuestions).length;
    const completedCount = Object.values(completedQuestions).filter((value) => value === true).length;
    setProgress((completedCount / totalQuestions) * 0.33);
  }, [completedQuestions]);

  useEffect(() => {
    const validateForm = () => {
      const isValid =
        surveyData.longFlights! >= 0 &&
        surveyData.shortFlights! >= 0 &&
        surveyData.carType !== "" &&
        surveyData.milesPerWeek !== "" &&
        surveyData.useTrain !== "" &&
        surveyData.useBus !== "" &&
        surveyData.walkBike !== "";
      setIsFormValid(isValid);
    };
    validateForm();
  }, [surveyData]);

  const handleNextButton = async () => {
    // Save data to backend
    await saveEmissionsData({
      surveyData: { ...surveyData },
      surveyEmissions: { ...surveyEmissions },
    });
    // Navigate to next screen
    router.push("/diet");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SafeAreaView>
          <View style={styles.contentContainer}>
            <Header progress={progress} title="Transportation" />
            <Text>
              First you will calculate your transportation emissions! These are all the related emissions for how you
              choose to get around.
            </Text>
            <QuestionSliderColor
              question="In the last year, how many long round-trip flights have you been on? (more than 10 hours round trip) ✈️"
              value={surveyData.longFlights || 0}
              onChange={(value: number) => {
                setSurveyData({ ...surveyData, longFlights: value });
                setCompletedQuestions({ ...completedQuestions, longFlights: true });
              }}
              minimumValue={0}
              maximumValue={7}
            />

            <QuestionSliderColor
              question="In the last year, how many short round-trip flights have you been on? (less than 10 hours round trip) ✈️"
              value={surveyData.shortFlights || 0}
              onChange={(value: number) => {
                setSurveyData({ ...surveyData, shortFlights: value });
                setCompletedQuestions({ ...completedQuestions, shortFlights: true });
              }}
              minimumValue={0}
              maximumValue={7}
            />

            <RadioButtonGroup
              question="What type of car do you drive? 🚗"
              options={["Gas - ⛽️", "Hybrid - ⛽️&⚡", "Electric - ⚡"]}
              value={surveyData.carType || "Gas - ⛽️"}
              onChange={(value: string) => {
                setSurveyData({ ...surveyData, carType: value });
                setCompletedQuestions({ ...completedQuestions, carType: true });
              }}
            />

            <NumberInput
              question="How many miles do you drive per week? 🛞"
              value={surveyData.milesPerWeek || ""}
              onChange={(value: string) => {
                setSurveyData({ ...surveyData, milesPerWeek: value });
                if (value !== "") {
                  setCompletedQuestions({ ...completedQuestions, milesPerWeek: true });
                }
              }}
              label="Miles per week"
            />

            <TransportQuestion
              question="Do you use the train/metro? 🚉"
              useTransport={surveyData.useTrain || "No"}
              setUseTransport={(value: string) => {
                setSurveyData({ ...surveyData, useTrain: value });
                setCompletedQuestions({ ...completedQuestions, useTrain: true });
              }}
              frequency={surveyData.trainFrequency || ""}
              setFrequency={(value: string) => {
                setSurveyData({ ...surveyData, trainFrequency: value });
              }}
              label="time(s)"
            />
            <TransportQuestion
              question="Do you use the bus? 🚌"
              useTransport={surveyData.useBus || "No"}
              setUseTransport={(value: string) => {
                setSurveyData({ ...surveyData, useBus: value });
                setCompletedQuestions({ ...completedQuestions, useBus: true });
              }}
              frequency={surveyData.busFrequency || ""}
              setFrequency={(value: string) => {
                setSurveyData({ ...surveyData, busFrequency: value });
              }}
              label="time(s)"
            />

            <TransportQuestion
              question="Do you walk/bike as a method of transportation? 🚲"
              useTransport={surveyData.walkBike || "No"}
              setUseTransport={(value: string) => {
                setSurveyData({ ...surveyData, walkBike: value });
                setCompletedQuestions({ ...completedQuestions, walkBike: true });
              }}
              frequency={surveyData.walkBikeFrequency || ""}
              setFrequency={(value: string) => {
                setSurveyData({ ...surveyData, walkBikeFrequency: value });
              }}
              label="time(s)"
            />

            <View style={styles.emissionsContainer}>
              <Text style={styles.emissionsTitle}>Your Individual Transportation Emissions</Text>
              <View style={styles.emissionsContent}>
                <View style={styles.emissionRow}>
                  <Text>Flight Emissions:</Text>
                  <Text>{surveyEmissions.flightEmissions?.toFixed(2)}</Text>
                </View>
                <View style={styles.emissionRow}>
                  <Text>Car Emissions:</Text>
                  <Text>{surveyEmissions.carEmissions?.toFixed(2)}</Text>
                </View>
                <View style={styles.emissionRow}>
                  <Text>Public Transport:</Text>
                  <Text>{surveyEmissions.publicTransportEmissions?.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text>{surveyEmissions.transportationEmissions?.toFixed(2)}</Text>
                  <Text>tons of CO2 per year</Text>
                </View>
              </View>
            </View>
          </View>
          <NextButton isFormValid={isFormValid} onPress={() => handleNextButton()} />
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 48,
  },
  totalSection: {
    marginTop: 32,
    marginBottom: 64,
    rowGap: 24,
  },
  totalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 18,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 32,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
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
  totalLabel: {
    fontWeight: "bold",
  },
});
