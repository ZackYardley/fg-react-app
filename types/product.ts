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
  stripe_metadata_quantity: string;
  isPlaceholder: boolean;
}

interface CarbonCreditSubscription extends Product {
  stripe_metadata_product_type: string;
  stripe_metadata_subscription_type: string;
  stripe_metadata_color_0: string;
  stripe_metadata_color_1: string;
  stripe_metadata_color_2: string;
}

export { Product, Price, CarbonCredit, CarbonCreditSubscription };
