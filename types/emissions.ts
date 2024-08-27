interface StateData {
  name: string;
  abbreviation: string;
  stateEGridValue: number;
  averageMonthlyElectricityBill: number;
  averageMonthlyWaterBill: number;
  averageMonthlyGasBill: number;
  averageMonthlyPropaneBill: number;
}

interface TransportationData {
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
}

interface TransportationEmissions {
  flightEmissions: number;
  carEmissions: number;
  publicTransportEmissions: number;
  transportationEmissions: number;
}

interface DietData {
  diet: string;
}

interface DietEmissions {
  dietEmissions: number;
}

interface EnergyData {
  state: string;
  electricBill: string;
  waterBill: string;
  propaneBill: string;
  gasBill: string;
  useWoodStove: string;
  peopleInHome: number;
}

interface EnergyEmissions {
  electricEmissions: number;
  waterEmissions: number;
  otherEnergyEmissions: number;
  energyEmissions: number;
}

interface SurveyEmissions {
  transportationEmissions: TransportationEmissions;
  dietEmissions: DietEmissions;
  energyEmissions: EnergyEmissions;
  totalEmissions: number;
}

interface SurveyData {
  transportationData: TransportationData;
  dietData: DietData;
  energyData: EnergyData;
  surveyEmissions: SurveyEmissions;
}

export {
  StateData,
  TransportationData,
  TransportationEmissions,
  DietData,
  DietEmissions,
  EnergyData,
  EnergyEmissions,
  SurveyEmissions,
  SurveyData,
};
