import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Payment, Subscription } from "@/types";

// todo: add function to get paginated payments, currently we show only 99 payments (probably enough )
const getRecentPayments = async (count: number = 99): Promise<Payment[]> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const paymentsRef = collection(db, "users", userId, "payments");

  try {
    const querySnapshot = await getDocs(query(paymentsRef, orderBy("created", "desc"), limit(count)));

    const payments: Payment[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Payment)
    );

    return payments;
  } catch (error) {
    console.error("Error fetching recent payments:", error);
    throw error;
  }
};

// Get a specific payment by ID
const getPaymentById = async (paymentIntentId: string): Promise<Payment | null> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const paymentRef = doc(db, "users", userId, "payments", paymentIntentId);
  const paymentDoc = await getDoc(paymentRef);

  if (!paymentDoc.exists()) {
    return null;
  }

  const data = paymentDoc.data() as Payment;
  return {
    ...data,
    id: paymentDoc.id,
  };
};

const isSubscribedToProduct = async (productId: string): Promise<boolean> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const subscriptionsRef = collection(db, "users", userId, "subscriptions");

  try {
    // Query for active subscriptions
    const activeSubscriptionsQuery = query(subscriptionsRef, where("status", "==", "active"));

    const querySnapshot = await getDocs(activeSubscriptionsQuery);

    // Check each subscription's items for the product ID
    for (const doc of querySnapshot.docs) {
      const subscription = doc.data() as Subscription;
      const hasProduct = subscription.items.some((item) => item.plan.product === productId);
      if (hasProduct) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking Carbon Credit subscription:", error);
    throw error;
  }
};

const getSubscription = async (productId: string): Promise<Subscription | null> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const subscriptionsRef = collection(db, "users", userId, "subscriptions");

  try {
    // Query for active subscriptions
    const activeSubscriptionsQuery = query(subscriptionsRef, where("status", "==", "active"));

    const querySnapshot = await getDocs(activeSubscriptionsQuery);

    // Check each subscription's items for the product ID
    for (const doc of querySnapshot.docs) {
      const subscription = doc.data() as Subscription;
      const hasProduct = subscription.items.some((item) => item.plan.product === productId);
      if (hasProduct) {
        return subscription;
      }
    }

    return null;
  } catch (error) {
    console.error("Error checking Carbon Credit subscription:", error);
    throw error;
  }
};

export { getRecentPayments, getPaymentById, isSubscribedToProduct, getSubscription };
