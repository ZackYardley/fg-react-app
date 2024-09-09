import { getFirestore, collection, getDoc, addDoc, serverTimestamp, query, getDocs, where } from "firebase/firestore";
import { TransactionItem } from "@/types";
import { getAuth } from "firebase/auth";

const fetchOneTimePaymentSheetParams = async (
  amount: number,
  uid: string
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "payment",
      amount: amount,
      currency: "usd",
    });
    // console.log("New session doc:", newSessionDoc);

    // Poll for the additional fields
    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // console.log("Polling for additional fields...");
      // console.log("Attempt:", attempt);

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.paymentIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        // console.log("Additional fields added to the session:", data);
        return {
          paymentIntent: data.paymentIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving checkout session:", error);
    throw error;
  }
};

const fetchSubscriptionPaymentSheetParams = async (
  price: string,
  uid: string
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "subscription",
      price: price,
    });
    // console.log("New session doc:", newSessionDoc);

    // Poll for the additional fields
    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // console.log("Polling for additional fields...");
      // console.log("Attempt:", attempt);

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.paymentIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        // console.log("Additional fields added to the session:", data);
        return {
          paymentIntent: data.paymentIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving checkout session:", error);
    throw error;
  }
};

const fetchSetupPaymentSheetParams = async (
  uid: string
): Promise<{
  setupIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "setup",
    });

    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.setupIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        return {
          setupIntent: data.setupIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving setup session:", error);
    throw error;
  }
};

const validateRequestData = (data: any): boolean => {
  const requiredFields = ["type", "items", "paymentIntentId", "status"];
  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    console.error("Items must be a non-empty array");
    return false;
  }

  for (const item of data.items) {
    const itemFields = ["id", "name", "productType", "quantity"];
    for (const field of itemFields) {
      if (item[field] === undefined) {
        console.error(`Missing required field in item: ${field}`);
        return false;
      }
    }
  }

  return true;
};

const requestCarbonCredits = async (
  userId: string,
  items: TransactionItem[],
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> => {
  const db = getFirestore();
  const requestsRef = collection(db, "users", userId, "requests");

  try {
    const docData = {
      type: "carbonCredits",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        productType: item.productType,
        quantity: item.quantity,
      })),
      paymentIntentId,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    if (!validateRequestData(docData)) {
      throw new Error("Invalid request data");
    }

    await addDoc(requestsRef, docData);
    return { success: true };
  } catch (error: any) {
    console.error("Error adding carbon credits request:", error);
    return { success: false, error: error.message || "Failed to add carbon credits request." };
  }
};

const fetchCreditRequestByPaymentId = async (paymentIntentId: string) => {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const requestsRef = collection(db, "users", userId, "requests");

  const q = query(requestsRef, where("paymentIntentId", "==", paymentIntentId));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      tyoe: data.type,
      items: data.items,
      paymentIntentId: data.paymentIntentId,
      status: data.status,
      createdAt: data.createdAt,
    };
  }
};

export {
  fetchOneTimePaymentSheetParams,
  fetchSubscriptionPaymentSheetParams,
  fetchSetupPaymentSheetParams,
  requestCarbonCredits,
  fetchCreditRequestByPaymentId,
};
