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
  flightEmissions?: number;
  carEmissions?: number;
  publicTransportEmissions?: number;
  transportationEmissions?: number;
}

interface DietData {
  diet?: string;
  dietEmissions?: number;
}

interface EnergyData {
  state?: string;
  electricBill?: string;
  waterBill?: string;
  propaneBill?: string;
  gasBill?: string;
  useWoodStove?: string;
  peopleInHome?: number;
  electricEmissions?: number;
  waterEmissions?: number;
  otherEnergyEmissions?: number;
  energyEmissions?: number;
}

interface TotalData {
  transportationEmissions: number;
  dietEmissions: number;
  energyEmissions: number;
  totalEmissions: number;
}

interface EmissionsData {
  transportationData: TransportationData;
  dietData: DietData;
  energyData: EnergyData;
  totalData: TotalData;
}

export { StateData, TransportationData, DietData, EnergyData, TotalData, EmissionsData };
