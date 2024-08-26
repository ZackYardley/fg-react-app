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

export { Subscription, SubscriptionItem };
