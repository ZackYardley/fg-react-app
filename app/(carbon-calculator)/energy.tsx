import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import statesData from "@/constants/states.json";
import { Header, NumberInput, NextButton, QuestionSlider, RadioButtonGroup } from "@/components/carbon-calculator";
import { fetchEmissionsData, saveEmissionsData } from "@/api/emissions";
import { StateData, SurveyData, SurveyEmissions } from "@/types";
import analytics from "@react-native-firebase/analytics";
import { router } from "expo-router";
import { Loading } from "@/components/common";

export default function EnergyCalculator() {
  // Todo: Use geolocation services to determine which state to choose
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({
    state: "",
    electricBill: "",
    waterBill: "",
    propaneBill: "",
    gasBill: "",
    useWoodStove: "No",
    peopleInHome: 1,
  });

  const [surveyEmissions, setSurveyEmissions] = useState<Partial<SurveyEmissions>>({
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
          } else {
            const randomState = statesData[Math.floor(Math.random() * statesData.length)];
            handleStateChange(randomState.name);
          }
        } else {
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleNextButton = async () => {
    try {
      await saveEmissionsData({
        surveyData: { ...surveyData },
        surveyEmissions: { ...surveyEmissions },
        totalEmissions: (surveyEmissions.energyEmissions || 0) + dietEmissions + transportationEmissions,
      });
      // [Error: You attempted to use a Firebase module that's not installed natively on your project by calling firebase.analytics().
      await analytics().logEvent("energy_emission_calculated", {
        emissionsDocument: {
          surveyData: surveyData,
          surveyEmissions: surveyEmissions,
          totalEmissions: (surveyEmissions.energyEmissions || 0) + transportationEmissions + dietEmissions,
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
          <Picker selectedValue={surveyData.state} onValueChange={handleStateChange} style={styles.picker}>
            {statesData.map((state) => (
              <Picker.Item
                key={state.abbreviation}
                label={`${state.name} (${state.abbreviation})`}
                value={state.name}
              />
            ))}
          </Picker>

          <NumberInput
            question="How much was your electric bill last month? ⚡"
            value={surveyData.electricBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, electricBill: value });
            }}
            unit="$"
            label="per month"
          />

          <NumberInput
            question="How much was your water bill last month? 🚰"
            value={surveyData.waterBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, waterBill: value });
            }}
            unit="$"
            label="per month"
          />

          <NumberInput
            question="How much was spent on propane last month? 🛢"
            value={surveyData.propaneBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, propaneBill: value });
            }}
            unit="$"
            label="per month"
          />

          <NumberInput
            question="How much was spent on natural gas last month? ⛽"
            value={surveyData.gasBill || ""}
            onChange={(value: string) => {
              setSurveyData({ ...surveyData, gasBill: value });
            }}
            unit="$"
            label="per month"
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
                <Text>{(surveyEmissions.electricEmissions! / surveyData.peopleInHome!).toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Water:</Text>
                <Text>{(surveyEmissions.waterEmissions! / surveyData.peopleInHome!).toFixed(2)}</Text>
              </View>
              <View style={styles.emissionRow}>
                <Text>Other Energy:</Text>
                <Text>{(surveyEmissions.otherEnergyEmissions! / surveyData.peopleInHome!).toFixed(2)}</Text>
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
  picker: {
    marginTop: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
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
