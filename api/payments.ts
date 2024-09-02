import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Payment } from "@/types";

// todo: add function to get paginated payments, currently we show only 99 payments (probably enough)
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

export { getRecentPayments, getPaymentById };
