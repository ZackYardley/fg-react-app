import { getFirestore, collection, query, orderBy, limit, getDocs, doc, where, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Subscription, Invoice } from "@/types";

const fetchSubscriptionStatus = async (subscriptionId: string): Promise<boolean> => {
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
      const hasProduct = subscription.items.some((item) => item.plan.product === subscriptionId);
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

const fetchSubscriptionByInvoice = async (invoiceId: string): Promise<Subscription | null> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const subscriptionsRef = doc(db, "users", userId, "subscriptions", invoiceId);

  try {
    const subscription = await getDoc(subscriptionsRef);
    if (subscription.exists()) {
      return subscription.data() as Subscription;
    }
    return null;
  } catch (error) {
    console.error("Error checking Carbon Credit subscription:", error);
    throw error;
  }
};

const fetchSubscriptionByProduct = async (productId: string): Promise<Subscription | null> => {
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

const fetchRecentInvoices = async (count: number = 99): Promise<Invoice[]> => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  try {
    // Get all subscriptions for the user
    const subscriptionsSnapshot = await getDocs(collection(userRef, "subscriptions"));

    let allInvoices: Invoice[] = [];

    // Iterate through each subscription
    for (const subscriptionDoc of subscriptionsSnapshot.docs) {
      const invoicesRef = collection(subscriptionDoc.ref, "invoices");

      // Get invoices for this subscription
      const invoicesSnapshot = await getDocs(query(invoicesRef, orderBy("created", "desc"), limit(count)));

      const subscriptionInvoices: Invoice[] = invoicesSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            subscriptionId: subscriptionDoc.id,
            ...doc.data(),
          } as unknown as Invoice)
      );

      allInvoices = allInvoices.concat(subscriptionInvoices);
    }

    // Sort all invoices by date and limit to the requested count
    allInvoices.sort((a, b) => b.created * 1000 - a.created * 1000);
    allInvoices = allInvoices.slice(0, count);

    return allInvoices;
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    throw error;
  }
};

const fetchInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = auth.currentUser.uid;

  try {
    // We need to find the subscription that contains this invoice
    const userRef = doc(db, "users", userId);
    const subscriptionsCollectionRef = collection(userRef, "subscriptions");
    const subscriptionsSnapshot = await getDocs(subscriptionsCollectionRef);

    for (const subscriptionDoc of subscriptionsSnapshot.docs) {
      const invoicesCollectionRef = collection(subscriptionDoc.ref, "invoices");
      const invoiceDocRef = doc(invoicesCollectionRef, invoiceId);
      const invoiceSnapshot = await getDoc(invoiceDocRef);

      if (invoiceSnapshot.exists()) {
        const invoiceData = invoiceSnapshot.data();
        return {
          id: invoiceSnapshot.id,
          ...invoiceData,
        } as Invoice;
      }
    }

    // If we've gone through all subscriptions and haven't found the invoice, return null
    return null;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

export {
  fetchSubscriptionStatus,
  fetchSubscriptionByInvoice,
  fetchSubscriptionByProduct,
  fetchRecentInvoices,
  fetchInvoiceById,
};
