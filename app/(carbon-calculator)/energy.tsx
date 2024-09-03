import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";
import analytics from "@react-native-firebase/analytics";
import statesData from "@/constants/states.json";
import { fetchEmissionsData, saveEmissionsData } from "@/api/emissions";
import {
  Header,
  NumberInput,
  NextButton,
  QuestionSlider,
  RadioButtonGroup,
  PlatformPicker,
} from "@/components/carbon-calculator";
import { Loading } from "@/components/common";
import { StateData, SurveyData, SurveyEmissions } from "@/types";

export default function EnergyCalculator() {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    state: "",
    electricBill: "",
    waterBill: "",
    propaneBill: "",
    gasBill: "",
    useWoodStove: "No",
    peopleInHome: 1,
  });

  const [surveyEmissions, setSurveyEmissions] = useState<SurveyEmissions>({
    electricEmissions: 0,
    waterEmissions: 0,
    otherEnergyEmissions: 0,
    energyEmissions: 0,
  });
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);

  // State selection
  const [stateData, setStateData] = useState<StateData>({} as StateData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const stateItems = statesData.map((state) => ({
    label: `${state.name} (${state.abbreviation})`,
    value: state.name,
  }));

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmissionsData();
        if (data && data.surveyData && data.surveyEmissions) {
          setSurveyData(data.surveyData);
          setSurveyEmissions(data.surveyEmissions);
          setDietEmissions(data.surveyEmissions.dietEmissions || 0);
          setTransportationEmissions(data.surveyEmissions.transportationEmissions || 0);
          if (data.surveyData.state) {
            const selectedState = statesData.find((s) => s.name === data.surveyData.state);
            if (selectedState) {
              setStateData(selectedState as StateData);
            }
          }
        } else {
          console.log("No data available");
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
    if (surveyData.state) {
      const selectedState = statesData.find((s) => s.name === surveyData.state);
      if (selectedState) {
        setStateData(selectedState as StateData);
      }
    }
  }, [surveyData.state]);

  useEffect(() => {
    const calculateEnergyEmissions = () => {
      if (
        !stateData ||
        !surveyData.electricBill ||
        !surveyData.waterBill ||
        !surveyData.propaneBill ||
        !surveyData.gasBill ||
        !surveyData.peopleInHome
      ) {
        return;
      }

      const electricityEmissions =
        ((stateData.stateEGridValue * 0.000453592) / 1000) *
        900 *
        12 *
        (parseFloat(surveyData.electricBill) / stateData.averageMonthlyElectricityBill);

      const waterEmissions = (parseFloat(surveyData.waterBill) / stateData.averageMonthlyWaterBill) * 0.0052;

      const propaneEmissions = (parseFloat(surveyData.propaneBill) / stateData.averageMonthlyPropaneBill) * 0.24;

      const gasEmissions = (parseFloat(surveyData.gasBill) / stateData.averageMonthlyGasBill) * 2.12;

      const totalEnergyEmissions =
        (electricityEmissions + waterEmissions + propaneEmissions + gasEmissions) / surveyData.peopleInHome;

      setSurveyEmissions({
        electricEmissions: electricityEmissions,
        waterEmissions: waterEmissions,
        otherEnergyEmissions: propaneEmissions + gasEmissions,
        energyEmissions: totalEnergyEmissions,
      });
    };

    calculateEnergyEmissions();
  }, [stateData, surveyData]);

  useEffect(() => {
    const validateForm = () => {
      const isValid =
        surveyData.state !== "" &&
        surveyData.electricBill !== "" &&
        surveyData.waterBill !== "" &&
        surveyData.propaneBill !== "" &&
        surveyData.gasBill !== "" &&
        surveyData.useWoodStove !== "" &&
        surveyData.peopleInHome !== undefined;
      setIsFormValid(isValid);
    };
    console.log("surveyData", surveyData);
    validateForm();
  }, [surveyData]);

  useEffect(() => {
    const totalQuestions = Object.keys(surveyData).length; // Total number of questions
    const completedQuestions = Object.values(surveyData).filter((value) => value !== "" && value !== undefined).length;
    setProgress(0.66 + (completedQuestions / totalQuestions) * 0.33);
  }, [surveyData]);

  const handleStateChange = (itemValue: string) => {
    const selectedState = statesData.find((s) => s.name === itemValue);
    if (selectedState) {
      setSurveyData({
        ...surveyData,
        state: itemValue,
        electricBill: selectedState.averageMonthlyElectricityBill.toFixed(2),
        waterBill: selectedState.averageMonthlyWaterBill.toFixed(2),
        propaneBill: selectedState.averageMonthlyPropaneBill.toFixed(2),
        gasBill: selectedState.averageMonthlyGasBill.toFixed(2),
      });
      setStateData(selectedState as StateData);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (isProcessing) {
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      return;
    }

    try {
      setIsProcessing(true);
      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);
      let state = statesData.find(
        (s) =>
          s.name.toLowerCase() === address[0].region?.toLowerCase() ||
          s.abbreviation.toLowerCase() === address[0].region?.toLowerCase()
      );

      if (!state) {
        console.log("State not found in statesData, using random state");
        state = statesData[Math.floor(Math.random() * statesData.length)];
      }

      if (state) {
        handleStateChange(state.name);
      }
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextButton = async () => {
    try {
      await saveEmissionsData({
        surveyData: { ...surveyData },
        surveyEmissions: { ...surveyEmissions },
        totalEmissions: (surveyEmissions.energyEmissions || 0) + dietEmissions + transportationEmissions,
        monthlyEmissions: ((surveyEmissions.energyEmissions || 0) + dietEmissions + transportationEmissions) / 12,
      });
      // The use of params here is wrong. There is no emissions document parameter for the logEvent method
      await analytics().logEvent("energy_emission_calculated", {
        emissionsDocument: {
          surveyData: surveyData,
          surveyEmissions: surveyEmissions,
          totalEmissions: (surveyEmissions.energyEmissions || 0) + transportationEmissions + dietEmissions,
          monthlyEmissions: ((surveyEmissions.energyEmissions || 0) + dietEmissions + transportationEmissions) / 12,
        },
      });
    } catch (error) {
      console.error("Error saving emissions data:", error);
    } finally {
      router.push("/breakdown");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView>
        <View style={styles.contentContainer}>
          <Header progress={progress} title="Energy" />
          <Text>The last section are your energy emissions! These are all your utilties and energy usage at home.</Text>

          <Text style={styles.stateSelectionText}>Which State do you live in? 🏠</Text>
          {stateItems && (
            <PlatformPicker
              selectedValue={surveyData.state}
              onValueChange={handleStateChange}
              items={stateItems}
              disabled={isProcessing}
            />
          )}

          <Pressable
            style={[styles.locationButton, isProcessing && styles.locationButtonLoading]}
            onPress={handleUseCurrentLocation}
            disabled={isProcessing}
          >
            <Text style={styles.locationButtonText}>{isProcessing ? "Loading..." : "Use my current location"}</Text>
          </Pressable>

          <NumberInput
            question="How much was your electric bill last month? ⚡"
            value={surveyData.electricBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, electricBill: value });
            }}
            unit="$"
            label="per month"
            disabled={isProcessing}
          />

          <NumberInput
            question="How much was your water bill last month? 🚰"
            value={surveyData.waterBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, waterBill: value });
            }}
            unit="$"
            label="per month"
            disabled={isProcessing}
          />

          <NumberInput
            question="How much was spent on propane last month? 🛢"
            value={surveyData.propaneBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, propaneBill: value });
            }}
            unit="$"
            label="per month"
            disabled={isProcessing}
          />

          <NumberInput
            question="How much was spent on natural gas last month? ⛽"
            value={surveyData.gasBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, gasBill: value });
            }}
            unit="$"
            label="per month"
            disabled={isProcessing}
          />

          <RadioButtonGroup
            question="Do you use a wood stove? 🪵"
            options={["Yes", "No"]}
            value={surveyData.useWoodStove || "No"}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, useWoodStove: value });
            }}
          />

          <QuestionSlider
            question="How many people live in your household?"
            value={surveyData.peopleInHome || 1}
            onChange={(value: number) => {
              setSurveyData({ ...surveyData, peopleInHome: value });
            }}
            minimumValue={1}
            maximumValue={7}
          />

          <View style={styles.emissionsContainer}>
            <Text style={styles.emissionsTitle}>Your Individual Energy/Utilities Emissions</Text>
            <View style={styles.emissionsContent}>
              <View style={styles.emissionRow}>
                <Text>Electric Emissions:</Text>
                <Text>{(surveyEmissions.electricEmissions || 0 / (surveyData.peopleInHome || 1)).toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Water:</Text>
                <Text>{(surveyEmissions.waterEmissions || 0 / (surveyData.peopleInHome || 1)).toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Other Energy:</Text>
                <Text>{(surveyEmissions.otherEnergyEmissions || 0 / (surveyData.peopleInHome || 1)).toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Transportation + Diet:</Text>
                <Text>{(dietEmissions + transportationEmissions).toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text>
                  {(transportationEmissions + dietEmissions + (surveyEmissions.energyEmissions || 0)).toFixed(2)}
                </Text>
                <Text>tons CO2 per year</Text>
              </View>
            </View>
          </View>
        </View>

        <NextButton isFormValid={isFormValid} onPress={() => handleNextButton()} />
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
  stateSelectionText: {
    marginTop: 24,
    fontSize: 18,
  },
  locationButton: {
    backgroundColor: "#409858",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginTop: 10,
    alignItems: "center",
  },
  locationButtonLoading: {
    backgroundColor: "#ccc",
  },
  locationButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
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
});
