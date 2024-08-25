/* Payment Types */
interface Product {
  id: string;
  active: boolean;
  description?: string;
  images: string[];
  metadata: {};
  name: string;
  role?: string;
  tax_code?: string;
  prices: Price[];
}

interface Price {
  id: string;
  active: boolean;
  billing_scheme: string;
  currency: string;
  description?: string;
  interval?: string;
  interval_count?: number;
  metadata: {};
  product: Product["id"];
  recurring?: {
    aggregate_usage?: string;
    interval: string;
    interval_count: number;
    meter?: string;
    trial_period_days?: number;
    usage_type?: string;
  };
  tax_behavior: string;
  tiers?: string;
  tiers_mode?: string;
  transform_quantity?: string;
  trial_period_days?: number;
  type: string;
  unit_amount: number;
}

interface CarbonCredit extends Product {
  stripe_metadata_carbon_credit_type: string;
  stripe_metadata_color_0: string;
  stripe_metadata_color_1: string;
  stripe_metadata_color_2: string;
  stripe_metadata_cta: string;
  stripe_metadata_key_features: string;
  stripe_metadata_product_type: string;
  stripe_metadata_project_overview: string;
  stripe_metadata_registry_link: string;
  stripe_metadata_registry_title: string;
  stripe_metadata_your_purchase: string;
}

interface CartItem {
  id: string;
  name: string;
  productType: string;
  quantity: number;
}

interface TransactionItem {
  id: string;
  name: string;
  productType: string;
  quantity: number;
  price: number;
}

interface Payment {
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip?: {
      amount: number;
    };
  };
  amount_received: number;
  application?: string;
  application_fee_amount?: number;
  automatic_payment_methods: {
    allow_redirects: string;
    enabled: boolean;
  };
  canceled_at?: number;
  cancellation_reason?: string;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  customer: string;
  description?: string;
  id: string;
  invoice?: string;
  lastPaymentError?: string;
  latest_charge: string;
  livemode: boolean;
  metadata: {
    items: TransactionItem[];
  };
  next_action?: string;
  object: string;
  on_behalf_of?: string;
  payment_method: string;
  payment_method_configuration_details: {
    id: string;
    parent?: string;
  };
  payment_method_options: {
    card?: {
      installments?: number;
      mandage_options?: string;
      network?: string;
      request_three_d_secure: string;
    };
    cashapp: {};
    link: {
      persistent_token?: string;
    };
  };
  paymentMethodTypes: string[];
  processing?: string;
  receipt_email?: string;
  review?: string;
  setup_future_usage?: string;
  shipping?: string;
  source?: string;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status: string;
  transfer_data?: string;
  transfer_group?: string;
}

/* Emissions Calculator Types */
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

export {
  Product,
  Price,
  CarbonCredit,
  CartItem,
  TransactionItem,
  Payment,
  StateData,
  TransportationData,
  DietData,
  EnergyData,
  TotalData,
  EmissionsData,
};
