import { Plan } from "./plan";
import { Price } from "./product";

interface SubscriptionItem {
  billing_thresholds: null;
  created: string;
  discounts: any[];
  id: string;
  metadata: {};
  object: "subscription_item";
  plan: Plan;
  price: Price;
  quantity: number;
  subscription: string;
}

interface Subscription {
  cancel_at: null;
  cancel_at_period_end: boolean;
  canceled_at: null;
  created: string;
  current_period_end: {
    nanoseconds: number;
    seconds: number;
  };
  current_period_start: {
    nanoseconds: number;
    seconds: number;
  };
  ended_at: null;
  items: SubscriptionItem[];
  metadata: {
    firebaseUserUID: string;
    price: string;
  };
  prices: string[];
  product: string;
  quantity: number;
  role: null;
  status: string;
  stripeLink: string;
  trial_end: null;
  trial_start: null;
}

interface Invoice {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  billing_reason: string;
  charge: string;
  collection_method: string;
  created: number;
  currency: string;
  customer: string;
  customer_address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
  customer_email: string;
  customer_name: string;
  customer_tax_exempt: string;
  description: string | null;
  discount: any | null;
  discounts: any[];
  due_date: number | null;
  effective_at: number;
  ending_balance: number;
  hosted_invoice_url: string;
  invoice_pdf: string;
  last_finalization_error: any | null;
  lines: {
    data: {
      amount: number;
      currency: string;
      description: string;
      discountable: boolean;
      id: string;
      livemode: boolean;
      metadata: {
        firebaseUserUID: string;
      };
      period: {
        end: number;
        start: number;
      };
      plan: {
        id: string;
        interval: string;
        product: string;
      };
      price: {
        id: string;
        unit_amount: number;
      };
      proration: boolean;
      quantity: number;
      subscription: string;
      subscription_item: string;
      type: string;
    }[];
    has_more: boolean;
    total_count: number;
  };
  livemode: boolean;
  metadata: Record<string, any>;
  number: string;
  paid: boolean;
  payment_intent: string;
  period_end: number;
  period_start: number;
  status: string;
  subscription: string;
  subtotal: number;
  tax: number | null;
  total: number;
  total_excluding_tax: number;
}

export { Subscription, SubscriptionItem, Invoice };
