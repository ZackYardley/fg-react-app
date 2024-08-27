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
  longFlights: number;
  shortFlights: number;
  carType: string;
  milesPerWeek: string;
  useTrain: string;
  trainFrequency: string;
  useBus: string;
  busFrequency: string;
  walkBike: string;
  walkBikeFrequency: string;

  // Diet Data
  diet: string;

  // Energy Data
  state: string;
  electricBill: string;
  waterBill: string;
  propaneBill: string;
  gasBill: string;
  useWoodStove: string;
  peopleInHome: number;
}

interface SurveyEmissions {
  // Transportation Emissions
  flightEmissions: number;
  carEmissions: number;
  publicTransportEmissions: number;
  transportationEmissions: number;

  // Diet Emissions
  dietEmissions: number;

  // Energy Emissions
  electricEmissions: number;
  waterEmissions: number;
  otherEnergyEmissions: number;
  energyEmissions: number;
}

interface EmissionsDocument {
  surveyData: Partial<SurveyData>;
  surveyEmissions: Partial<SurveyEmissions>;
  totalEmissions: number;
  lastUpdated: any;
}

export { StateData, SurveyEmissions, SurveyData, EmissionsDocument };
