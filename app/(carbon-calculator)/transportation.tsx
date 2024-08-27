import { useState, useEffect } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, RadioButtonGroup, NumberInput, TransportQuestion, NextButton } from "@/components/carbon-calculator";
import QuestionSliderColor from "@/components/carbon-calculator/QuestionSliderColor";
import { fetchEmissionsData } from "@/api/emissions";
import { TransportationData, TransportationEmissions } from "@/types";
import { Loading } from "@/components/common";

export default function TransportationCalculator() {
  const [transportationData, setTransportationData] = useState<TransportationData>({
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
  const [transportationEmissions, setTransportationEmissions] = useState<TransportationEmissions>({
    flightEmissions: 0,
    carEmissions: 0,
    publicTransportEmissions: 0,
    transportationEmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmissionsData();
        if (data && data.transportationData && data.surveyEmissions.transportationEmissions) {
          setTransportationData(data.transportationData);
          setTransportationEmissions(data.surveyEmissions.transportationEmissions);
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
      if (!transportationData) {
        return;
      }

      let flightEmissions = transportationData.longFlights * 1.35 + transportationData.shortFlights * 0.9;
      let carEmissions = 0;
      let publicTransportEmissions = 0;

      if (transportationData.carType && transportationData.milesPerWeek) {
        let carEmissionRates = 0;

        switch (transportationData.carType) {
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

        carEmissions = (carEmissionRates * parseFloat(transportationData.milesPerWeek) * 52) / 1000000;
      }

      if (transportationData.useTrain && transportationData.trainFrequency) {
        const trainEmissions = parseFloat(transportationData.trainFrequency) * 0.002912 * 52;
        const busEmissions = parseFloat(transportationData.busFrequency) * 0.005824 * 52;
        publicTransportEmissions = trainEmissions + busEmissions;
      }

      setTransportationEmissions({
        flightEmissions,
        carEmissions,
        publicTransportEmissions,
        transportationEmissions: flightEmissions + carEmissions + publicTransportEmissions,
      });
    };

    calculateTransportationEmissions();
  }, [transportationData]);

  // Progress tracking
  const [progress, setProgress] = useState(0);
  // const [completedQuestions, setCompletedQuestions] = useState({
  //   longFlights: false,
  //   shortFlights: false,
  //   carType: false,
  //   milesPerWeek: false,
  //   useTrain: false,
  //   useBus: false,
  //   walkBike: false,
  // });

  // const markQuestionCompleted = (question: string) => {
  //   setCompletedQuestions((prev) => ({ ...prev, [question]: true }));
  // };

  // useEffect(() => {
  //   const totalQuestions = Object.keys(completedQuestions).length;
  //   const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  //   setProgress((completedCount / totalQuestions) * 0.33);
  // }, [completedQuestions]);

  // Form validation
  // const [milesError, setMilesError] = useState("");
  // const [trainFrequencyError, setTrainFrequencyError] = useState("");
  // const [busFrequencyError, setBusFrequencyError] = useState("");
  // const [walkBikeFrequencyError, setWalkBikeFrequencyError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // useEffect(() => {
  //   const validateForm = () => {
  //     const isValid =
  //       parseFloat(transportationData?.milesPerWeek || "0") <= 3500 &&
  //       parseFloat(transportationData?.trainFrequency || "0") <= 30 &&
  //       parseFloat(transportationData?.busFrequency || "0") <= 30 &&
  //       parseFloat(transportationData?.walkBikeFrequency || "0") <= 30;
  //     setIsFormValid(isValid);
  //   };
  //   validateForm();
  // }, [transportationData]);

  // const validateNumber = (
  //   value: string,
  //   setter: (value: string) => void,
  //   errorSetter: React.Dispatch<React.SetStateAction<string>>,
  //   type: "miles" | "trainFrequency" | "busFrequency" | "walkBikeFrequency"
  // ) => {
  //   if (value === "") {
  //     setter("");
  //     errorSetter("");
  //   } else if (isNaN(Number(value)) || parseFloat(value) < 0) {
  //     errorSetter("Please enter a valid amount");
  //   } else if (type === "miles" ? parseFloat(value) > 3500 : parseFloat(value) > 30) {
  //     errorSetter(type === "miles" ? "Please enter a value less than 3500" : "Please enter a value less than 30");
  //   } else {
  //     const decimalPlaces = value.split(".")[1];
  //     if (decimalPlaces && decimalPlaces.length > 2) {
  //       setter(value.slice(0, -1));
  //     } else {
  //       setter(value);
  //       errorSetter("");
  //     }
  //   }
  // };

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
              value={transportationData.longFlights}
              onChange={(value: number) => {
                setTransportationData({ ...transportationData, longFlights: value });
                // markQuestionCompleted("longFlights");
              }}
              minimumValue={0}
              maximumValue={7}
            />

            <QuestionSliderColor
              question="In the last year, how many short round-trip flights have you been on? (less than 10 hours round trip) ✈️"
              value={transportationData.shortFlights}
              onChange={(value: number) => {
                setTransportationData({ ...transportationData, shortFlights: value });
                // markQuestionCompleted("shortFlights");
              }}
              minimumValue={0}
              maximumValue={7}
            />

            <RadioButtonGroup
              question="What type of car do you drive? 🚗"
              options={["Gas - ⛽️", "Hybrid - ⛽️&⚡", "Electric - ⚡"]}
              value={transportationData.carType}
              onChange={(value: string) => {
                setTransportationData({ ...transportationData, carType: value });
                // markQuestionCompleted("carType");
              }}
            />

            <NumberInput
              question="How many miles do you drive per week? 🛞"
              value={transportationData.milesPerWeek}
              onChange={(value: string) => {
                setTransportationData({ ...transportationData, milesPerWeek: value });
                if (value !== "") {
                  // markQuestionCompleted("milesPerWeek");
                }
              }}
              label="Miles per week"
            />

            <TransportQuestion
              question="Do you use the train/metro? 🚉"
              useTransport={transportationData.useTrain}
              setUseTransport={(value: string) => {
                setTransportationData({ ...transportationData, useTrain: value });
                // markQuestionCompleted("useTrain");
              }}
              frequency={transportationData.trainFrequency}
              setFrequency={(value: string) => {
                setTransportationData({ ...transportationData, trainFrequency: value });
                // markQuestionCompleted("useTrain");
              }}
              label="time(s)"
            />
            <TransportQuestion
              question="Do you use the bus? 🚌"
              useTransport={transportationData.useBus}
              setUseTransport={(value: string) => {
                setTransportationData({ ...transportationData, useBus: value });
                // markQuestionCompleted("useBus");
              }}
              frequency={transportationData.busFrequency}
              setFrequency={(value: string) => {
                setTransportationData({ ...transportationData, busFrequency: value });
                // markQuestionCompleted("useBus");
              }}
              label="time(s)"
            />

            <TransportQuestion
              question="Do you walk/bike as a method of transportation? 🚲"
              useTransport={transportationData.walkBike}
              setUseTransport={(value: string) => {
                setTransportationData({ ...transportationData, walkBike: value });
                // markQuestionCompleted("walkBike");
              }}
              frequency={transportationData.walkBikeFrequency}
              setFrequency={(value: string) => {
                setTransportationData({ ...transportationData, walkBikeFrequency: value });
                // markQuestionCompleted("walkBike");
              }}
              label="time(s)"
            />

            <View style={styles.emissionsContainer}>
              <Text style={styles.emissionsTitle}>Your Individual Transportation Emissions</Text>
              <View style={styles.emissionsContent}>
                <View style={styles.emissionRow}>
                  <Text>Flight Emissions:</Text>
                  <Text>{transportationEmissions.flightEmissions.toFixed(2)}</Text>
                </View>
                <View style={styles.emissionRow}>
                  <Text>Car Emissions:</Text>
                  <Text>{transportationEmissions.carEmissions.toFixed(2)}</Text>
                </View>
                <View style={styles.emissionRow}>
                  <Text>Public Transport:</Text>
                  <Text>{transportationEmissions.publicTransportEmissions.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text>{transportationEmissions.transportationEmissions.toFixed(2)}</Text>
                  <Text>tons of CO2 per year</Text>
                </View>
              </View>
            </View>
          </View>
          <NextButton isFormValid={isFormValid} onNext="/diet" />
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
