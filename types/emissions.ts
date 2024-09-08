import { Timestamp } from "firebase/firestore";

interface StateData {
  name: string;
  abbreviation: string;
  stateEGridValue: number;
  averageMonthlyElectricityBill: number;
  averageMonthlyWaterBill: number;
  averageMonthlyGasBill: number;
  averageMonthlyPropaneBill: number;
}

interface SurveyData {
  // Transportation Data
  longFlights?: number;
  shortFlights?: number;
  carType?: string;
  milesPerWeek?: string;
  useTrain?: string;
  trainFrequency?: string;
  useBus?: string;
  busFrequency?: string;
  walkBike?: string;
  walkBikeFrequency?: string;

  // Diet Data
  diet?: string;

  // Energy Data
  state?: string;
  electricBill?: string;
  waterBill?: string;
  propaneBill?: string;
  gasBill?: string;
  useWoodStove?: string;
  peopleInHome?: number;
}

interface SurveyEmissions {
  // Transportation Emissions
  flightEmissions?: number;
  carEmissions?: number;
  publicTransportEmissions?: number;
  transportationEmissions?: number;

  // Diet Emissions
  dietEmissions?: number;

  // Energy Emissions
  electricEmissions?: number;
  waterEmissions?: number;
  otherEnergyEmissions?: number;
  energyEmissions?: number;
}

interface EmissionsDocument {
  surveyData: SurveyData;
  surveyEmissions: SurveyEmissions;
  totalEmissions: number;
  monthlyEmissions: number;
  totalOffset: number;
  lastUpdated: Timestamp;
}

interface CommunityEmissionsData {
  emissions_calculated: number;
  emissions_offset: number;
  last_updated: Date;
}

type EmissionGroup = "Transportation" | "Diet" | "Energy";

interface JourneyDocument {
  netZeroMonths: number;
  lastUpdated: Date;
  // Add any other relevant fields
}

export { StateData, SurveyEmissions, SurveyData, EmissionsDocument, CommunityEmissionsData, EmissionGroup, JourneyDocument };
