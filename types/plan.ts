interface Plan {
  active: boolean;
  aggregate_usage: null;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  id: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: {};
  meter: null;
  nickname: null;
  object: "plan";
  product: string;
  tiers_mode: null;
  transform_usage: null;
  trial_period_days: null;
  usage_type: string;
}

export { Plan };
