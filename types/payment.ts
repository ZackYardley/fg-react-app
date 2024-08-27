import { DocumentReference } from "firebase/firestore";
import { TransactionItem } from "./cart";

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
    items?: TransactionItem[];
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
  prices?: DocumentReference[];
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

export { Payment };
